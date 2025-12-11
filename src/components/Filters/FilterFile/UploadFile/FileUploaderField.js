import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';

import FileUploaderFieldView from './FileUploaderFieldView';
import { isFileSizeValid, createFileSizeErrorDetails, HTTP_STATUS_PAYLOAD_TOO_LARGE } from '../../../../util/fileUtils';

/**
 * Helper function to create file size error message
 * @param {number} fileSize - Size of the file in bytes
 * @param {object} intl - Internationalization object
 * @returns {string} Formatted error message
 */
const createFileSizeErrorMessage = (fileSize, intl) => {
  const errorDetails = createFileSizeErrorDetails(fileSize);
  return intl.formatMessage(
    { id: 'ui-finc-select.filter.file.uploadError.fileTooLarge' },
    {
      actualSize: errorDetails.actualSize,
      maxSize: errorDetails.maxSize,
    }
  );
};

/**
 * Helper function to handle HTTP 413 Payload Too Large errors
 * Sanitizes backend messages to prevent information disclosure
 * @param {Response} response - HTTP response object
 * @param {File} file - The uploaded file
 * @param {object} intl - Internationalization object
 * @returns {Promise<string>} Error message
 */
const handlePayloadTooLargeError = async (response, file, intl) => {
  // Check Content-Length header first to avoid fetching large error message bodies
  const contentLength = response.headers.get('Content-Length');
  if (contentLength) {
    const length = parseInt(contentLength, 10);
    if (Number.isNaN(length) || length === 0 || length > 200) {
      return createFileSizeErrorMessage(file.size, intl);
    }
  }

  try {
    const backendMessage = await response.text();
    // Sanitize backend message - only show if it's a simple size message
    // Reject messages that are too long or contain HTML/script tags (potential XSS)
    const hasHtmlTags = backendMessage.includes('<') && backendMessage.includes('>');
    if (backendMessage && backendMessage.length < 200 && !hasHtmlTags) {
      return intl.formatMessage(
        { id: 'ui-finc-select.filter.file.uploadError.backendRejected' },
        { message: backendMessage }
      );
    }
  } catch (error) {
    // Error fetching backend message - fall through to use formatted error
  }

  return createFileSizeErrorMessage(file.size, intl);
};

const FileUploaderField = ({
  input: { onChange, value },
  meta,
  onUploadFile,
}) => {
  const intl = useIntl();
  const [error, setError] = useState(null);
  const [file, setFile] = useState({});
  const [isDropZoneActive, setIsDropZoneActive] = useState(false);
  const [uploadInProgress, setUploadInProgress] = useState(false);

  useEffect(() => {
    if (value?.fileId) {
      // We've been passed an initial value for the field that is an object
      // with an ID. This means we're currently showing a previously-saved file.
      // So if this is different from the file we've saved to our internal state,
      // save it off so we can properly render the metadata.
      if (file && (file.fileId !== value.fileId)) {
        setFile(value);
      }
    }
  }, [value, file]);

  const handleDrop = async (acceptedFiles) => {
    if (acceptedFiles.length !== 1) return;

    const droppedFile = acceptedFiles[0];

    if (!isFileSizeValid(droppedFile.size)) {
      const errorMessage = createFileSizeErrorMessage(droppedFile.size, intl);
      setError(errorMessage);
      setIsDropZoneActive(false);
      setUploadInProgress(false);
      return;
    }

    setError(undefined);
    setIsDropZoneActive(false);
    setUploadInProgress(true);

    try {
      const response = await onUploadFile(droppedFile);

      if (response.ok) {
        const fileId = await response.text();
        onChange(fileId);
        setFile({ fileId });
      } else if (response.status === HTTP_STATUS_PAYLOAD_TOO_LARGE) {
        const errorMessage = await handlePayloadTooLargeError(response, droppedFile, intl);
        throw new Error(errorMessage);
      } else {
        throw new Error(
          intl.formatMessage({ id: 'ui-finc-select.filter.file.uploadError' })
        );
      }
    } catch (err) {
      setError(err.message);
      setFile({});
    } finally {
      setUploadInProgress(false);
    }
  };

  return (
    <FileUploaderFieldView
      error={error || ((meta.touched || meta.submitFailed) && meta.error)}
      isDropZoneActive={isDropZoneActive}
      onDragEnter={() => setIsDropZoneActive(true)}
      onDragLeave={() => setIsDropZoneActive(false)}
      onDrop={(data) => handleDrop(data)}
      uploadInProgress={uploadInProgress}
    />
  );
};

FileUploaderField.propTypes = {
  input: PropTypes.shape({
    onChange: PropTypes.func.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  }).isRequired,
  meta: PropTypes.object,
  onUploadFile: PropTypes.func.isRequired,
};

export default FileUploaderField;

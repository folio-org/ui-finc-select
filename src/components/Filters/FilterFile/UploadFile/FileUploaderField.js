import PropTypes from 'prop-types';
import { useState } from 'react';
import { useIntl } from 'react-intl';

import {
  createFileSizeErrorDetails,
  HTTP_STATUS_PAYLOAD_TOO_LARGE,
  isFileSizeValid,
} from '../../../../util/fileUtils';
import FileUploaderFieldView from './FileUploaderFieldView';

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
    const length = Number.parseInt(contentLength, 10);

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
  } catch {
    // Unable to read server response - return generic error message
    return intl.formatMessage({ id: 'ui-finc-select.filter.file.uploadError' });
  }

  return createFileSizeErrorMessage(file.size, intl);
};

const FileUploaderField = ({
  input: { onChange },
  meta,
  onUploadFile,
}) => {
  const intl = useIntl();
  const [error, setError] = useState(null);
  const [isDropZoneActive, setIsDropZoneActive] = useState(false);
  const [uploadInProgress, setUploadInProgress] = useState(false);

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
  }).isRequired,
  meta: PropTypes.object,
  onUploadFile: PropTypes.func.isRequired,
};

export default FileUploaderField;

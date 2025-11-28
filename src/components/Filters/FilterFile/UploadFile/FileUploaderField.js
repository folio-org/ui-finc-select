import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';

import FileUploaderFieldView from './FileUploaderFieldView';
import { isFileSizeValid, createFileSizeErrorDetails } from '../../../../util/fileUtils';

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

  const handleDrop = (acceptedFiles) => {
    if (acceptedFiles.length !== 1) return;

    const file = acceptedFiles[0];
    let mounted = true;

    if (!isFileSizeValid(file.size)) {
      const errorDetails = createFileSizeErrorDetails(file.size);
      const errorMessage = intl.formatMessage(
        { id: 'ui-finc-select.filter.file.uploadError.fileTooLarge' },
        {
          actualSize: errorDetails.actualSize,
          maxSize: errorDetails.maxSize,
        }
      );
      setError(errorMessage);
      setIsDropZoneActive(false);
      setUploadInProgress(false);
      return;
    }

    setError(undefined);
    setIsDropZoneActive(false);
    setUploadInProgress(true);

    onUploadFile(file)
      .then(response => {
        if (response.ok) {
          // example: file = "34bdd9da-b765-448a-8519-11d460a4df5d"
          response.text().then(fileId => {
            // the value of the fieldId will connected with the Field in DocuemtsFieldArray with onChange(file);
            onChange(fileId);
            if (mounted) {
              setFile({ fileId });
            }
          });
        } else if (response.status === 413) {
          response.text().then(backendMessage => {
            const errorMessage = intl.formatMessage(
              { id: 'ui-finc-select.filter.file.uploadError.backendRejected' },
              { message: backendMessage }
            );
            throw new Error(errorMessage);
          }).catch(() => {
            // Fallback if reading response body fails
            const errorDetails = createFileSizeErrorDetails(file.size);
            const errorMessage = intl.formatMessage(
              { id: 'ui-finc-select.filter.file.uploadError.fileTooLarge' },
              {
                actualSize: errorDetails.actualSize,
                maxSize: errorDetails.maxSize,
              }
            );
            throw new Error(errorMessage);
          });
        } else {
          // Other HTTP errors
          throw new Error(
            intl.formatMessage({ id: 'ui-finc-select.filter.file.uploadError.network' })
          );
        }
      })
      .catch(err => {
        console.error(err); // eslint-disable-line no-console
        setError(err.message);
        setFile({});
      })
      .finally(() => setUploadInProgress(false));
    mounted = false;
  };

  return (
    <FileUploaderFieldView
      error={error || meta.error}
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
    value: PropTypes.string,
  }).isRequired,
  meta: PropTypes.object,
  onUploadFile: PropTypes.func.isRequired,
};

export default FileUploaderField;

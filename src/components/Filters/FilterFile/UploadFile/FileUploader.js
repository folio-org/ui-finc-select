import PropTypes from 'prop-types';
import { useDropzone } from 'react-dropzone';

import { Button, Icon } from '@folio/stripes/components';

import css from './FileUploader.css';

const FileUploader = ({
  errorMessage,
  isDropZoneActive,
  onDragEnter,
  onDragLeave,
  onDrop,
  title,
  uploadButtonText,
  uploadInProgress,
  uploadInProgressText,
}) => {
  const {
    getRootProps,
    getInputProps,
  } = useDropzone({
    onDrop,
    onDragEnter,
    onDragLeave,
    maxFiles: 1,
  });

  const renderErrorMessage = () => {
    return (
      errorMessage && (
        <span
          className={css.errorMessage}
          hidden={isDropZoneActive}
        >
          <Icon icon="exclamation-circle">
            <span>{errorMessage}</span>
          </Icon>
        </span>
      )
    );
  };

  const renderUploadFields = () => {
    return (
      <>
        <span
          className={`${css.uploadTitle} ${
            isDropZoneActive ? css.activeUploadTitle : ''
          }`}
        >
          {uploadInProgress ? (
            <div>
              {uploadInProgressText}
              <Icon icon="spinner-ellipsis" width="10px" />
            </div>
          ) : (
            title
          )}
        </span>
        <Button
          buttonStyle="primary"
          hidden={isDropZoneActive}
          id="filter-file-upload-button"
        >
          {uploadButtonText}
        </Button>
      </>
    );
  };

  return (
    <div
      className={`${css.upload}`}
      {...getRootProps()}
    >
      <input id="filter-file-input" {...getInputProps()} />
      {renderErrorMessage()}
      {renderUploadFields()}
    </div>
  );
};

FileUploader.propTypes = {
  errorMessage: PropTypes.node,
  isDropZoneActive: PropTypes.bool.isRequired,
  onDragEnter: PropTypes.func,
  onDragLeave: PropTypes.func,
  onDrop: PropTypes.func.isRequired,
  title: PropTypes.node.isRequired,
  uploadButtonText: PropTypes.node.isRequired,
  uploadInProgress: PropTypes.bool,
  uploadInProgressText: PropTypes.node,
};

export default FileUploader;

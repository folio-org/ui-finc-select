import React from 'react';
import PropTypes from 'prop-types';
import ReactDropzone from 'react-dropzone';

import {
  Button,
  Icon,
} from '@folio/stripes/components';

import css from './FileUploader.css';

export default class FileUploader extends React.Component {
  static propTypes = {
    accept: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
    ]),
    acceptClassName: PropTypes.string,
    activeClassName: PropTypes.string,
    className: PropTypes.string,
    disabledClassName: PropTypes.string,
    errorMessage: PropTypes.node,
    footer: PropTypes.node,
    isDropZoneActive: PropTypes.bool.isRequired,
    maxSize: PropTypes.number,
    onDragEnter: PropTypes.func,
    onDragLeave: PropTypes.func,
    onDrop: PropTypes.func.isRequired,
    rejectClassName: PropTypes.string,
    style: PropTypes.object,
    title: PropTypes.node.isRequired,
    uploadButtonAriaLabel: PropTypes.string,
    uploadButtonText: PropTypes.node.isRequired,
    uploadInProgress: PropTypes.bool,
    uploadInProgressText: PropTypes.node,
  };

  static defaultProps = {
    className: '',
  };

  renderErrorMessage = () => {
    const { errorMessage, isDropZoneActive } = this.props;
    return errorMessage &&
    (
      <span
        className={css.errorMessage}
        hidden={isDropZoneActive}
      >
        <Icon icon="exclamation-circle">
          <span data-test-filter-file-error-msg>{errorMessage}</span>
        </Icon>
      </span>
    );
  };

  renderUploadFields = () => {
    const {
      isDropZoneActive,
      uploadButtonAriaLabel,
      uploadButtonText,
      uploadInProgress,
      uploadInProgressText
    } = this.props;

    return (
      <React.Fragment>
        <span
          className={`${css.uploadTitle} ${isDropZoneActive ? css.activeUploadTitle : ''}`}
          data-test-filter-file-upload-title
        >
          {uploadInProgress ? (
            <div>
              {uploadInProgressText}
              <Icon icon="spinner-ellipsis" width="10px" />
            </div>
          ) : this.props.title}
        </span>
        <Button
          aria-label={uploadButtonAriaLabel}
          buttonStyle="primary"
          data-test-filter-file-upload-button
          hidden={isDropZoneActive}
        >
          {uploadButtonText}
        </Button>
      </React.Fragment>
    );
  }

  renderFooter = () => {
    const { footer, isDropZoneActive } = this.props;
    return footer &&
    (
      <div
        className={css.footer}
        data-test-filter-file-footer
        hidden={isDropZoneActive}
      >
        {footer}
      </div>
    );
  }

  render() {
    const {
      accept,
      acceptClassName,
      activeClassName,
      className,
      disabledClassName,
      maxSize,
      onDragEnter,
      onDragLeave,
      onDrop,
      rejectClassName,
      style,
    } = this.props;

    return (
      <ReactDropzone
        accept={accept}
        acceptClassName={acceptClassName}
        activeClassName={activeClassName}
        disabledClassName={disabledClassName}
        disableClick
        maxSize={maxSize}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        rejectClassName={rejectClassName}
        style={style}
      >
        {({ getInputProps, getRootProps }) => (
          <div
            className={`${css.upload} ${className}`}
            data-test-filter-file-drop-zone
            {...getRootProps()}
          >
            <input {...getInputProps()} />
            {this.renderErrorMessage()}
            {this.renderUploadFields()}
            {this.renderFooter()}
          </div>
        )}
      </ReactDropzone>
    );
  }
}

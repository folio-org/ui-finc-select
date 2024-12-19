import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import FileUploader from './FileUploader';

const FileUploaderFieldView = ({
  error,
  isDropZoneActive,
  onDragEnter,
  onDragLeave,
  onDrop,
  uploadInProgress,
}) => {
  return (
    <FileUploader
      errorMessage={error}
      isDropZoneActive={isDropZoneActive}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      title={<FormattedMessage id="ui-finc-select.filter.file.dragDrop" />}
      uploadButtonText={<FormattedMessage id="ui-finc-select.filter.file.choose" />}
      uploadInProgress={uploadInProgress}
      uploadInProgressText={<FormattedMessage id="ui-finc-select.filter.file.upload" />}
    />
  );
};

FileUploaderFieldView.propTypes = {
  error: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  isDropZoneActive: PropTypes.bool,
  onDragEnter: PropTypes.func,
  onDragLeave: PropTypes.func,
  onDrop: PropTypes.func.isRequired,
  uploadInProgress: PropTypes.bool,
};

export default FileUploaderFieldView;

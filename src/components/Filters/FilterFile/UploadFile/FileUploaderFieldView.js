import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Col,
  KeyValue,
  Row,
} from '@folio/stripes/components';

import FileUploader from './FileUploader';

const FileUploaderFieldView = ({
  error,
  file,
  fileLabel,
  isDropZoneActive,
  onDragEnter,
  onDragLeave,
  onDrop,
  uploadInProgress,
  ...rest
}) => {
  const renderFileInfo = () => {
    if (!file) return null;

    return (
      <Row>
        <Col xs={6}>
          <KeyValue
            label={<FormattedMessage id="ui-finc-select.filter.file.name" />}
            value={fileLabel}
          />
        </Col>
      </Row>
    );
  };

  return (
    <FileUploader
      errorMessage={error}
      footer={renderFileInfo()}
      isDropZoneActive={isDropZoneActive}
      multiple={false}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      title={<FormattedMessage id="ui-finc-select.filter.file.dragDrop" />}
      uploadButtonText={<FormattedMessage id="ui-finc-select.filter.file.choose" />}
      uploadInProgress={uploadInProgress}
      uploadInProgressText={<FormattedMessage id="ui-finc-select.filter.file.upload" />}
      {...rest}
    />
  );
};

FileUploaderFieldView.propTypes = {
  error: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  file: PropTypes.shape({
    modified: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    fileId: PropTypes.string,
  }).isRequired,
  fileLabel: PropTypes.string,
  isDropZoneActive: PropTypes.bool,
  onDelete: PropTypes.func.isRequired,
  onDragEnter: PropTypes.func,
  onDragLeave: PropTypes.func,
  onDrop: PropTypes.func.isRequired,
  uploadInProgress: PropTypes.bool,
};

export default FileUploaderFieldView;

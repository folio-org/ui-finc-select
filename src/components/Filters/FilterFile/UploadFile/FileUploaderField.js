import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

import {
  withStripes,
  IntlConsumer,
} from '@folio/stripes/core';

import FileUploaderFieldView from './FileUploaderFieldView';

const FileUploaderField = ({
  fileLabel,
  input: { onChange, value },
  meta,
  onUploadFile,
}) => {
  const [error, setError] = useState(null);
  const [file, setFile] = useState({});
  const [isDropZoneActive, setIsDropZoneActive] = useState(false);
  const [uploadInProgress, setUploadInProgress] = useState(false);

  useEffect(() => {
    if (value && value.fileId) {
      // We've been passed an initial value for the field that is an object
      // with an ID. This means we're currently showing a previously-saved file.
      // So if this is different from the file we've saved to our internal state,
      // save it off so we can properly render the metadata.
      if (file && (file.fileId !== value.fileId)) {
        setFile(value);
      }
    }
  }, [value, file]);

  const processError = (resp, intl) => {
    const contentType = resp.headers ? resp.headers.get('Content-Type') : '';

    if (contentType.startsWith('application/json')) {
      throw new Error(`${resp.message} (${resp.error})`);
    } else {
      throw new Error(intl.formatMessage({ id: 'errors.uploadError' }));
    }
  };

  const handleDrop = (acceptedFiles, intl) => {
    if (acceptedFiles.length !== 1) return;

    let mounted = true;

    setError(undefined);
    setIsDropZoneActive(false);
    setUploadInProgress(true);

    onUploadFile(acceptedFiles[0])
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
        } else {
          processError(response, intl);
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

  const handleDelete = () => {
    onChange(null);
    setFile({});
  };

  return (
    /* TODO: Refactor this component to use `injectIntl` when Folio starts using react-intl 3.0 */
    <IntlConsumer>
      {intl => (
        <FileUploaderFieldView
          error={meta.error || error}
          file={value ? file : {}}
          fileLabel={fileLabel}
          isDropZoneActive={isDropZoneActive}
          onDelete={handleDelete}
          onDragEnter={() => setIsDropZoneActive(true)}
          onDragLeave={() => setIsDropZoneActive(false)}
          onDrop={(data) => handleDrop(data, intl)}
          uploadInProgress={uploadInProgress}
        />
      )}
    </IntlConsumer>
  );
};

FileUploaderField.propTypes = {
  fileLabel: PropTypes.string,
  input: PropTypes.shape({
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string,
  }).isRequired,
  meta: PropTypes.object,
  onUploadFile: PropTypes.func.isRequired,
};

export default withStripes(FileUploaderField);

import PropTypes from 'prop-types';
import { get } from 'lodash';
import { FormattedMessage } from 'react-intl';
import { saveAs } from 'file-saver';

import {
  MultiColumnList,
  Button,
} from '@folio/stripes/components';

import fetchWithDefaultOptions from '../../DisplayUtils/fetchWithDefaultOptions';

const FilterFileView = ({
  filter,
  stripes
}) => {
  const handleDownloadFile = (file) => {
    return fetchWithDefaultOptions(stripes.okapi, `/finc-select/files/${file.fileId}`)
      .then(response => response.blob())
      .then(blob => {
        saveAs(blob, file.label);
      })
      .catch((err) => {
        throw new Error('Error while downloading file. ' + err.message);
      });
  };

  const formatter = {
    label: (item) => <span data-test-doc-label>{item.label}</span>,
    criteria: (item) => <span data-test-doc-criteria>{item.criteria}</span>,
    fileId: (item) => (
      <div>
        <Button
          buttonStyle="danger"
          data-test-filter-button-download-file
          id={`download-file ${item.label}`}
          onClick={(e) => {
            handleDownloadFile(item);
            e.preventDefault();
          }}
          rel="noopener noreferrer"
          style={{ marginTop: '0.5rem', marginBottom: '0.5rem' }}
          target="_blank"
        >
          <FormattedMessage id="ui-finc-select.filter.file.download" />
        </Button>
      </div>
    ),
  };

  return (
    <MultiColumnList
      columnMapping={{
        label: <FormattedMessage id="ui-finc-select.filter.file.label" />,
        criteria: <FormattedMessage id="ui-finc-select.filter.file.criteria" />,
        fileId: ''
      }}
      contentData={get(filter, 'filterFiles', [])}
      formatter={formatter}
      interactive={false}
      isEmptyMessage={<FormattedMessage id="ui-finc-select.filter.file.empty" />}
      visibleColumns={['label', 'criteria', 'fileId']}
    />
  );
};

FilterFileView.propTypes = {
  filter: PropTypes.shape({
    docs: PropTypes.arrayOf(
      PropTypes.shape({
        lable: PropTypes.string.isRequired,
        criteria: PropTypes.string,
      }),
    ),
  }),
  stripes: PropTypes.shape({
    okapi: PropTypes.shape({
      tenant: PropTypes.string.isRequired,
      token: PropTypes.string.isRequired,
      url: PropTypes.string,
    }),
  }),
};

export default FilterFileView;

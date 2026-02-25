import { saveAs } from 'file-saver';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  MultiColumnList,
} from '@folio/stripes/components';

import fetchWithDefaultOptions from '../../DisplayUtils/fetchWithDefaultOptions';

const FilterFileView = ({
  filter,
  stripes,
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
    label: (item) => <span>{item.label}</span>,
    criteria: (item) => <span>{item.criteria}</span>,
    fileId: (item) => (
      <div>
        <Button
          buttonStyle="danger"
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
        fileId: '',
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
        criteria: PropTypes.string,
        lable: PropTypes.string.isRequired,
      })
    ),
  }),
  stripes: PropTypes.shape({
    okapi: PropTypes.shape({
      tenant: PropTypes.string,
      token: PropTypes.string,
      url: PropTypes.string,
    }),
  }),
};

export default FilterFileView;

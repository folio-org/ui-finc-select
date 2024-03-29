import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { saveAs } from 'file-saver';

import {
  MultiColumnList,
  Button,
} from '@folio/stripes/components';

import fetchWithDefaultOptions from '../../DisplayUtils/fetchWithDefaultOptions';

class FilterFileView extends React.Component {
  static propTypes = {
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

  handleDownloadFile = (file) => {
    const { stripes: { okapi } } = this.props;

    return fetchWithDefaultOptions(okapi, `/finc-select/files/${file.fileId}`)
      .then(response => response.blob())
      .then(blob => {
        saveAs(blob, file.label);
      })
      .catch((err) => {
        throw new Error('Error while downloading file. ' + err.message);
      });
  }

  render() {
    const { filter } = this.props;
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
              this.handleDownloadFile(item);
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
        contentData={_.get(filter, 'filterFiles', [])}
        formatter={formatter}
        interactive={false}
        isEmptyMessage={<FormattedMessage id="ui-finc-select.filter.file.empty" />}
        visibleColumns={['label', 'criteria', 'fileId']}
      />
    );
  }
}

export default FilterFileView;

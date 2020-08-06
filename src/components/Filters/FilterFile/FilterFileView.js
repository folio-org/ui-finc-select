import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  MultiColumnList,
  Button
} from '@folio/stripes/components';

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
      }),
    }),
  };

  handleDownloadFile = (file) => {
    const { stripes: { okapi } } = this.props;

    return fetch(`${okapi.url}/finc-select/files/${file.fileId}`, {
      headers: {
        'X-Okapi-Tenant': okapi.tenant,
        'X-Okapi-Token': okapi.token,
      },
    }).then(response => response.blob())
      // .then(text => {
      //   console.log(text);
      // });
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.label;
        document.body.appendChild(a);
        a.click();
        a.remove();
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

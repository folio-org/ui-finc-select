import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { FieldArray } from 'react-final-form-arrays';

import { Accordion } from '@folio/stripes/components';

import DocumentsFieldArray from './UploadFile/DocumentsFieldArray';
import fetchWithDefaultOptions from '../../DisplayUtils/fetchWithDefaultOptions';

class FilterFileForm extends React.Component {
  static propTypes = {
    onToggle: PropTypes.func,
    stripes: PropTypes.shape({
      okapi: PropTypes.shape({
        tenant: PropTypes.string.isRequired,
        token: PropTypes.string.isRequired,
        url: PropTypes.string,
      }).isRequired,
    }).isRequired,
  };

  handleUploadFile = (file) => {
    const { stripes: { okapi } } = this.props;

    return fetchWithDefaultOptions(okapi, '/finc-select/files', {
      method: 'POST',
      headers: { 'Content-Type': 'application/octet-stream' },
      body: file,
    });
  }

  render() {
    const { expanded, onToggle, accordionId } = this.props;

    return (
      <Accordion
        id={accordionId}
        label={<FormattedMessage id="ui-finc-select.filter.fileAccordion" />}
        onToggle={onToggle}
        open={expanded}
      >
        <FieldArray
          addDocBtnLabel={<FormattedMessage id="ui-finc-select.filter.file.addFile" />}
          component={DocumentsFieldArray}
          name="filterFiles"
          onUploadFile={this.handleUploadFile}
        />
      </Accordion>
    );
  }
}

FilterFileForm.propTypes = {
  accordionId: PropTypes.string.isRequired,
  expanded: PropTypes.bool,
  onToggle: PropTypes.func,
};
export default FilterFileForm;

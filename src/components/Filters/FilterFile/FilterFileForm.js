import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { FieldArray } from 'react-final-form-arrays';

import { Accordion } from '@folio/stripes/components';

import DocumentsFieldArray from './UploadFile/DocumentsFieldArray';
import fetchWithDefaultOptions from '../../DisplayUtils/fetchWithDefaultOptions';

const FilterFileForm = ({
  accordionId,
  expanded,
  onToggle,
  stripes,
}) => {
  const handleUploadFile = (file) => {
    return fetchWithDefaultOptions(stripes.okapi, '/finc-select/files', {
      method: 'POST',
      headers: { 'Content-Type': 'application/octet-stream' },
      body: file,
    });
  };

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
        onUploadFile={handleUploadFile}
      />
    </Accordion>
  );
};

FilterFileForm.propTypes = {
  accordionId: PropTypes.string.isRequired,
  expanded: PropTypes.bool,
  onToggle: PropTypes.func,
  stripes: PropTypes.shape({
    okapi: PropTypes.shape({
      tenant: PropTypes.string.isRequired,
      token: PropTypes.string.isRequired,
      url: PropTypes.string,
    }).isRequired,
  }).isRequired,
};

export default FilterFileForm;

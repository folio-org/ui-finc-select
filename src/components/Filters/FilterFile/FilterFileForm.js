import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { FieldArray } from 'react-final-form-arrays';

import { Accordion } from '@folio/stripes/components';
import { useStripes } from '@folio/stripes/core';

import DocumentsFieldArray from './UploadFile/DocumentsFieldArray';
import fetchWithDefaultOptions from '../../DisplayUtils/fetchWithDefaultOptions';

const FilterFileForm = ({
  accordionId,
  expanded,
  onToggle,
}) => {
  const { okapi } = useStripes();

  const handleUploadFile = (file) => {
    return fetchWithDefaultOptions(okapi, '/finc-select/files', {
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
      <FieldArray name="filterFiles">
        {({ fields }) => (
          <DocumentsFieldArray
            name="filterFiles"
            fields={fields}
            onUploadFile={handleUploadFile}
          />
        )}
      </FieldArray>
    </Accordion>
  );
};

FilterFileForm.propTypes = {
  accordionId: PropTypes.string.isRequired,
  expanded: PropTypes.bool,
  onToggle: PropTypes.func,
};

export default FilterFileForm;

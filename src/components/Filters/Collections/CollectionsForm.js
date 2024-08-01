import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { FieldArray } from 'react-final-form-arrays';

import { Accordion } from '@folio/stripes/components';
import { stripesShape } from '@folio/stripes-core';

import FindCollections from './FindCollections/FindCollections';

const CollectionsForm = ({
  accordionId,
  collectionIds,
  expanded,
  // filterData,
  filterId,
  form,
  // setCollection,
  onToggle,
  // stripes,
  ...props
}) => {
  return (
    <Accordion
      id={accordionId}
      label={<FormattedMessage id="ui-finc-select.filter.collectionAccordion" />}
      onToggle={onToggle}
      open={expanded}
    >
      <div>
        {/* Plugin has to be inside of Field, otherwise pristine is not working */}
        <FieldArray
          collectionIds={collectionIds}
          component={FindCollections}
          filterId={filterId}
          isEditable
          name="collectionIds"
          form={form}
          {...props}
        />
      </div>
    </Accordion>
  );
};

CollectionsForm.propTypes = {
  accordionId: PropTypes.string.isRequired,
  collectionIds: PropTypes.arrayOf(PropTypes.object),
  expanded: PropTypes.bool,
  filterData: PropTypes.shape({
    mdSources: PropTypes.arrayOf(PropTypes.object),
  }),
  filterId: PropTypes.string,
  form: PropTypes.shape({
    mutators: PropTypes.shape({
      setCollection: PropTypes.func,
    })
  }),
  onToggle: PropTypes.func,
  stripes: stripesShape.isRequired,
};

export default CollectionsForm;

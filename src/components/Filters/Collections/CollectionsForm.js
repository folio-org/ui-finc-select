import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { FieldArray } from 'react-final-form-arrays';

import { Accordion } from '@folio/stripes/components';

import FindCollections from './FindCollections/FindCollections';

const CollectionsForm = ({
  accordionId,
  collectionIds,
  expanded,
  filterId,
  form,
  onToggle,
}) => {
  const getSelectedCollections = (records) => {
    form?.mutators?.setCollection({}, records);
  };

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
          selectRecords={getSelectedCollections}
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
};

export default CollectionsForm;

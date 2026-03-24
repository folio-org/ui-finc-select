import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  AccordionSet,
  FilterAccordionHeader,
} from '@folio/stripes/components';
import { CheckboxFilter } from '@folio/stripes/smart-components';

import { buildFilterState } from '../../util/filterUtils';
import filterConfig from './filterConfigData';

const filterState = buildFilterState(filterConfig);

const FilterFilters = ({
  activeFilters = { type: [] },
  filterHandlers,
}) => {
  const renderCheckboxFilter = (key, props) => {
    const groupFilters = activeFilters[key] || [];

    return (
      <Accordion
        displayClearButton={groupFilters.length > 0}
        header={FilterAccordionHeader}
        id={`filter-accordion-${key}`}
        label={<FormattedMessage id={`ui-finc-select.filter.${key}`} />}
        onClearFilter={() => { filterHandlers.clearGroup(key); }}
        separator={false}
        {...props}
      >
        <CheckboxFilter
          dataOptions={filterState[key]}
          name={key}
          onChange={(group) => { filterHandlers.state({ ...activeFilters, [group.name]: group.values }); }}
          selectedValues={groupFilters}
        />
      </Accordion>
    );
  };

  return (
    <AccordionSet>
      {renderCheckboxFilter('type')}
    </AccordionSet>
  );
};

FilterFilters.propTypes = {
  activeFilters: PropTypes.object,
  filterHandlers: PropTypes.object,
};

export default FilterFilters;

import PropTypes from 'prop-types';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  AccordionSet,
  FilterAccordionHeader,
} from '@folio/stripes/components';
import { CheckboxFilter } from '@folio/stripes/smart-components';

import { useUpdatedFilters } from '../../hooks';
import filterConfig from './filterConfigData';

const FilterFilters = ({
  activeFilters = { type: [] },
  filterHandlers,
}) => {
  const [filterState, setFilterState] = useState({
    type: [],
  });

  useUpdatedFilters({
    dynamicKey: '',
    filterConfig,
    filterData: [],
    filterState,
    setFilterState,
  });

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

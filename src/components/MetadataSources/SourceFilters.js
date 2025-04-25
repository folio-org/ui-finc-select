import PropTypes from 'prop-types';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  AccordionSet,
  FilterAccordionHeader,
} from '@folio/stripes/components';
import { CheckboxFilter } from '@folio/stripes/smart-components';

import useUpdatedFilters from '../hooks/useUpdatedFilters';
import filterConfig from './filterConfigData';

const SourceFilters = ({
  activeFilters = {
    status: [],
    selected: [],
  },
  filterHandlers,
  ...props
}) => {
  const [filterState, setFilterState] = useState({
    status: [],
    selected: [],
  });

  useUpdatedFilters({
    dynamicKey: '',
    filterConfig,
    filterData: [],
    filterState,
    setFilterState,
  });

  const renderCheckboxFilter = (key) => {
    const groupFilters = activeFilters[key] || [];

    return (
      <Accordion
        displayClearButton={groupFilters.length > 0}
        header={FilterAccordionHeader}
        id={`filter-accordion-${key}`}
        label={<FormattedMessage id={`ui-finc-select.source.${key}`} />}
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
      {renderCheckboxFilter('status')}
      {renderCheckboxFilter('selected')}
    </AccordionSet>
  );
};

SourceFilters.propTypes = {
  activeFilters: PropTypes.object,
  filterHandlers: PropTypes.object,
};

export default SourceFilters;

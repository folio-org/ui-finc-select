import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { CheckboxFilterAccordion } from '@folio/stripes-leipzig-components';
import { AccordionSet } from '@folio/stripes/components';

import { buildFilterState } from '../../util/filterUtils';
import filterConfig from './filterConfigData';

const filterState = buildFilterState(filterConfig);

const FilterFilters = ({
  activeFilters = { type: [] },
  filterHandlers,
}) => (
  <AccordionSet>
    <CheckboxFilterAccordion
      activeFilters={activeFilters}
      dataOptions={filterState.type}
      filterHandlers={filterHandlers}
      filterKey="type"
      label={<FormattedMessage id="ui-finc-select.filter.type" />}
    />
  </AccordionSet>
);

FilterFilters.propTypes = {
  activeFilters: PropTypes.object,
  filterHandlers: PropTypes.object,
};

export default FilterFilters;

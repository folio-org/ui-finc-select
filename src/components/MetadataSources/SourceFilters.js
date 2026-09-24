import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { CheckboxFilterAccordion } from '@folio/stripes-leipzig-components';
import { AccordionSet } from '@folio/stripes/components';

import { buildFilterState } from '../../util/filterUtils';
import filterConfig from './filterConfigData';

const filterState = buildFilterState(filterConfig);

const SourceFilters = ({
  activeFilters = {
    status: [],
    selected: [],
  },
  filterHandlers,
  ...props
}) => {
  const renderCheckboxFilter = (key) => (
    <CheckboxFilterAccordion
      activeFilters={activeFilters}
      dataOptions={filterState[key]}
      filterHandlers={filterHandlers}
      filterKey={key}
      label={<FormattedMessage id={`ui-finc-select.source.${key}`} />}
      {...props}
    />
  );

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

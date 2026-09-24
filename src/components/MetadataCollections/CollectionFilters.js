import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { CheckboxFilterAccordion } from '@folio/stripes-leipzig-components';
import {
  Accordion,
  AccordionSet,
  FilterAccordionHeader,
  Selection,
} from '@folio/stripes/components';

import { buildFilterState } from '../../util/filterUtils';
import filterConfig from './filterConfigData';

// skip for mdSource filter as it is dynamic and handled separately
const filterState = buildFilterState(filterConfig.filter(f => f.name !== 'mdSource'));

const CollectionFilters = ({
  activeFilters = {
    selected: [],
    freeContent: [],
    permitted: [],
    mdSource: [],
  },
  filterHandlers,
  filterData,
  ...props
}) => {
  const renderCheckboxFilter = (key) => (
    <CheckboxFilterAccordion
      activeFilters={activeFilters}
      dataOptions={filterState[key]}
      filterHandlers={filterHandlers}
      filterKey={key}
      label={<FormattedMessage id={`ui-finc-select.collection.${key}`} />}
      {...props}
    />
  );

  const renderMetadataSourceFilter = () => {
    // use dynamic filter values from okapi
    const dataOptions = (filterData.mdSources || []).map(mdSource => ({
      value: mdSource.id,
      label: mdSource.label,
    }));

    const mdSourceFilters = activeFilters.mdSource || [];

    return (
      <Accordion
        displayClearButton={mdSourceFilters.length > 0}
        header={FilterAccordionHeader}
        id="filter-accordion-mdSource"
        label={<FormattedMessage id="ui-finc-select.collection.mdSource" />}
        onClearFilter={() => { filterHandlers.clearGroup('mdSource'); }}
        separator={false}
      >
        <Selection
          dataOptions={dataOptions}
          id="mdSource-filter"
          onChange={value => filterHandlers.state({ ...activeFilters, mdSource: [value] })}
          placeholder=" "
          value={mdSourceFilters[0] || ''}
        />
      </Accordion>
    );
  };

  return (
    <AccordionSet>
      {renderMetadataSourceFilter()}
      {renderCheckboxFilter('freeContent')}
      {renderCheckboxFilter('permitted')}
      {renderCheckboxFilter('selected')}
    </AccordionSet>
  );
};

CollectionFilters.propTypes = {
  activeFilters: PropTypes.object,
  filterData: PropTypes.object,
  filterHandlers: PropTypes.object,
};

export default CollectionFilters;

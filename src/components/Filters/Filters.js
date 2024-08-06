import PropTypes from 'prop-types';
import { get, noop, isEqual } from 'lodash';
import { useState } from 'react';
import {
  Link,
  withRouter,
} from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import {
  CollapseFilterPaneButton,
  ExpandFilterPaneButton,
  SearchAndSortQuery,
  SearchAndSortNoResultsMessage as NoResultsMessage,
} from '@folio/stripes/smart-components';
import {
  Button,
  Icon,
  MultiColumnList,
  NoValue,
  Pane,
  PaneHeader,
  PaneMenu,
  Paneset,
  SearchField,
} from '@folio/stripes/components';
import {
  AppIcon,
  IfPermission,
} from '@folio/stripes/core';

import urls from '../DisplayUtils/urls';
import FilterFilters from './FilterFilters';
import Navigation from '../Navigation/Navigation';

const defaultFilter = { state: { type: ['Whitelist', 'Blacklist'] }, string: 'type.Whitelist,type.Blacklist' };
const defaultSearchString = { query: '' };

const Filters = ({
  children,
  contentData = {},
  disableRecordCreation,
  filter,
  history,
  onNeedMoreData,
  onSelectRow,
  queryGetter,
  querySetter,
  searchField,
  searchString = '',
  selectedRecordId,
}) => {
  const [filterPaneIsVisible, setFilterPaneIsVisible] = useState(true);
  const [storedFilter, setStoredFilter] = useState(
    localStorage.getItem('fincSelectFilterFilters') ? JSON.parse(localStorage.getItem('fincSelectFilterFilters')) : defaultFilter
  );
  const [storedSearchString, setStoredSearchString] = useState(
    localStorage.getItem('fincSelectFilterSearchString') ? JSON.parse(localStorage.getItem('fincSelectFilterSearchString')) : defaultSearchString
  );

  const getDataLable = (fieldValue) => {
    if (fieldValue !== '') {
      return <FormattedMessage id={`ui-finc-select.dataOption.${fieldValue}`} />;
    } else {
      return <NoValue />;
    }
  };

  const resultsFormatter = {
    label: result => result.label,
    type: result => getDataLable(get(result, 'type', '')),
  };

  // generate url for record-details
  const rowURL = (id) => {
    return `${urls.filterView(id)}${searchString}`;
  };

  const rowFormatter = (row) => {
    const { rowClass, rowData, rowIndex, rowProps = {}, cells } = row;
    let RowComponent;

    if (onSelectRow) {
      RowComponent = 'div';
    } else {
      RowComponent = Link;
      rowProps.to = rowURL(rowData.id);
    }

    return (
      <RowComponent
        aria-rowindex={rowIndex + 2}
        className={rowClass}
        data-label={[rowData.name]}
        key={`row-${rowIndex}`}
        role="row"
        {...rowProps}
      >
        {cells}
      </RowComponent>
    );
  };

  // fade in/out of filter-pane
  const toggleFilterPane = () => {
    setFilterPaneIsVisible(curState => !curState);
  };

  // fade in / out the filter menu
  const renderResultsFirstMenu = (filters) => {
    const filterCount = filters.string !== '' ? filters.string.split(',').length : 0;
    if (filterPaneIsVisible) {
      return null;
    }

    return (
      <PaneMenu>
        <ExpandFilterPaneButton
          filterCount={filterCount}
          onClick={toggleFilterPane}
        />
      </PaneMenu>
    );
  };

  // counting records of result list
  const renderResultsPaneSubtitle = (results) => {
    if (results) {
      const count = results ? results.totalCount() : 0;
      return <FormattedMessage id="stripes-smart-components.searchResultsCountHeader" values={{ count }} />;
    }

    return <FormattedMessage id="stripes-smart-components.searchCriteria" />;
  };

  // button for creating a new record
  const renderResultsLastMenu = () => {
    if (disableRecordCreation) {
      return null;
    }

    return (
      <IfPermission perm="finc-select.filters.item.post">
        <PaneMenu>
          <FormattedMessage id="ui-finc-select.form.create">
            {ariaLabel => (
              <Button
                aria-label={ariaLabel}
                buttonStyle="primary"
                id="clickable-new-filter"
                marginBottom0
                to={`${urls.filterCreate()}${searchString}`}
              >
                <FormattedMessage id="stripes-smart-components.new" />
              </Button>
            )}
          </FormattedMessage>
        </PaneMenu>
      </IfPermission>
    );
  };

  const renderNavigation = (id) => (
    <Navigation id={id} />
  );

  const renderIsEmptyMessage = (query, source) => {
    if (!source) {
      return <FormattedMessage id="ui-finc-select.noSourceYet" />;
    }

    return (
      <div data-test-filters-no-results-message>
        <NoResultsMessage
          source={source}
          searchTerm={query.query || ''}
          filterPaneIsVisible
          toggleFilterPane={noop}
        />
      </div>
    );
  };

  const cacheFilter = (activeFilters, searchValue) => {
    localStorage.setItem('fincSelectFilterFilters', JSON.stringify(activeFilters));
    localStorage.setItem('fincSelectFilterSearchString', JSON.stringify(searchValue));
  };

  const resetAll = (getFilterHandlers, getSearchHandlers) => {
    localStorage.removeItem('fincSelectFilterFilters');
    localStorage.removeItem('fincSelectFilterSearchString');

    // reset the filter state to default filters
    getFilterHandlers.state(defaultFilter.state);

    // reset the search query
    getSearchHandlers.state(defaultSearchString);

    setStoredFilter(defaultFilter);
    setStoredSearchString(defaultSearchString);

    return (history.push(`${urls.filters()}?filters=${defaultFilter.string}`));
  };

  const handleClearSearch = (getSearchHandlers, onSubmitSearch, searchValue) => {
    localStorage.removeItem('fincSelectFilterSearchString');

    searchValue.query = '';

    getSearchHandlers.state({
      query: '',
    });

    return onSubmitSearch;
  };

  const handleChangeSearch = (e, getSearchHandlers) => {
    getSearchHandlers.state({
      query: e,
    });
  };

  const getDisableReset = (activeFilters, searchValue) => {
    if (isEqual(activeFilters.state, defaultFilter.state) && searchValue.query === defaultSearchString.query) {
      return true;
    } else {
      return false;
    }
  };

  const renderFilterPaneHeader = () => {
    return (
      <PaneHeader
        lastMenu={
          <PaneMenu>
            <CollapseFilterPaneButton
              onClick={toggleFilterPane}
            />
          </PaneMenu>
        }
        paneTitle={<FormattedMessage id="stripes-smart-components.searchAndFilter" />}
      />
    );
  };

  const renderResultsPaneHeader = (activeFilters, result) => {
    return (
      <PaneHeader
        appIcon={<AppIcon app="finc-select" />}
        firstMenu={renderResultsFirstMenu(activeFilters)}
        lastMenu={renderResultsLastMenu()}
        paneTitle={<FormattedMessage id="ui-finc-select.filters.title" />}
        paneSub={renderResultsPaneSubtitle(result)}
      />
    );
  };

  const count = filter ? filter.totalCount() : 0;
  const query = queryGetter() || {};
  const sortOrder = query.sort || '';

  return (
    <div data-test-filters data-testid="filters">
      <SearchAndSortQuery
        initialFilterState={storedFilter.state}
        initialSearchState={storedSearchString}
        initialSortState={{ sort: 'label' }}
        queryGetter={queryGetter}
        querySetter={querySetter}
      >
        {
          ({
            activeFilters,
            filterChanged,
            getFilterHandlers,
            getSearchHandlers,
            onSort,
            onSubmitSearch,
            searchChanged,
            searchValue,
          }) => {
            const disableReset = getDisableReset(activeFilters, searchValue);
            const disableSearch = () => (searchValue.query === defaultSearchString.query);
            if (filterChanged || searchChanged) {
              cacheFilter(activeFilters, searchValue);
            }

            return (
              <Paneset>
                {filterPaneIsVisible &&
                  <Pane
                    data-test-filter-pane-filter
                    defaultWidth="18%"
                    id="pane-filterfilter"
                    renderHeader={renderFilterPaneHeader}
                  >
                    <form onSubmit={onSubmitSearch}>
                      {renderNavigation('filter')}
                      <div>
                        <SearchField
                          ariaLabel="search"
                          autoFocus
                          id="filterSearchField"
                          inputRef={searchField}
                          name="query"
                          onChange={(e) => {
                            if (e.target.value) {
                              handleChangeSearch(e.target.value, getSearchHandlers());
                            } else {
                              handleClearSearch(getSearchHandlers(), onSubmitSearch(), searchValue);
                            }
                          }}
                          onClear={() => handleClearSearch(getSearchHandlers(), onSubmitSearch(), searchValue)}
                          value={searchValue.query}
                        />
                        <Button
                          buttonStyle="primary"
                          disabled={disableSearch()}
                          fullWidth
                          id="filterSubmitSearch"
                          type="submit"
                        >
                          <FormattedMessage id="stripes-smart-components.search" />
                        </Button>
                      </div>
                      <Button
                        buttonStyle="none"
                        disabled={disableReset}
                        id="clickable-reset-all"
                        onClick={() => resetAll(getFilterHandlers(), getSearchHandlers())}
                      >
                        <Icon icon="times-circle-solid">
                          <FormattedMessage id="stripes-smart-components.resetAll" />
                        </Icon>
                      </Button>
                      <FilterFilters
                        activeFilters={activeFilters.state}
                        filterHandlers={getFilterHandlers()}
                      />
                    </form>
                  </Pane>
                }
                <Pane
                  data-test-filter-pane-results
                  defaultWidth="fill"
                  id="pane-filterresults"
                  padContent={false}
                  style={{ minWidth: '42%' }}
                  renderHeader={() => renderResultsPaneHeader(activeFilters, filter)}
                >
                  <MultiColumnList
                    autosize
                    columnMapping={{
                      label: <FormattedMessage id="ui-finc-select.filter.label" />,
                      type: <FormattedMessage id="ui-finc-select.filter.type" />,
                    }}
                    contentData={contentData}
                    formatter={resultsFormatter}
                    id="list-filters"
                    isEmptyMessage={renderIsEmptyMessage(query, filter)}
                    isSelected={({ item }) => item.id === selectedRecordId}
                    onHeaderClick={onSort}
                    onNeedMoreData={onNeedMoreData}
                    onRowClick={onSelectRow}
                    rowFormatter={rowFormatter}
                    sortDirection={sortOrder.startsWith('-') ? 'descending' : 'ascending'}
                    sortOrder={sortOrder.replace(/^-/, '').replace(/,.*/, '')}
                    totalCount={count}
                    virtualize
                    visibleColumns={['label', 'type']}
                  />
                </Pane>
                {children}
              </Paneset>
            );
          }
        }
      </SearchAndSortQuery>
    </div>
  );
};

Filters.propTypes = {
  children: PropTypes.object,
  contentData: PropTypes.arrayOf(PropTypes.object),
  disableRecordCreation: PropTypes.bool,
  filter: PropTypes.object,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  onNeedMoreData: PropTypes.func,
  onSelectRow: PropTypes.func,
  queryGetter: PropTypes.func,
  querySetter: PropTypes.func,
  searchField: PropTypes.object,
  searchString: PropTypes.string,
  selectedRecordId: PropTypes.string,
};

export default withRouter(Filters);

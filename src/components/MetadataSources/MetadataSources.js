import PropTypes from 'prop-types';
import _ from 'lodash';
import { useState } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { injectIntl, FormattedMessage } from 'react-intl';

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
import { AppIcon } from '@folio/stripes/core';

import urls from '../DisplayUtils/urls';
import SourceFilters from './SourceFilters';
import Navigation from '../Navigation/Navigation';

const rawSearchableIndexes = [
  { label: 'all', value: '', makeQuery: term => `(label="${term}*" or description="${term}*" or sourceId="${term}*")` },
  { label: 'label', value: 'label', makeQuery: term => `(label="${term}*")` },
  { label: 'description', value: 'description', makeQuery: term => `(description="${term}*")` },
  { label: 'sourceId', value: 'sourceId', makeQuery: term => `(sourceId="${term}*")` },
];
let searchableIndexes;

const defaultFilter = { state: { status: ['active', 'implementation'] }, string: 'status.active,status.implementation' };
const defaultSearchString = { query: '' };
const defaultSearchIndex = '';

const MetadataSources = ({
  children,
  contentData = {},
  history,
  intl,
  onNeedMoreData,
  onSelectRow,
  queryGetter,
  querySetter,
  searchField,
  searchString = '',
  source,
  // add values for search-selectbox
  onChangeIndex,
  selectedRecordId,
}) => {
  const [filterPaneIsVisible, setFilterPaneIsVisible] = useState(true);
  const [storedFilter, setStoredFilter] = useState(localStorage.getItem('fincSelectSourceFilters') ? JSON.parse(localStorage.getItem('fincSelectSourceFilters')) : defaultFilter);
  const [storedSearchString, setStoredSearchString] = useState(localStorage.getItem('fincSelectSourceSearchString') ? JSON.parse(localStorage.getItem('fincSelectSourceSearchString')) : defaultSearchString);
  const [storedSearchIndex, setStoredSearchIndex] = useState(localStorage.getItem('fincSelectSourceSearchIndex') ? JSON.parse(localStorage.getItem('fincSelectSourceSearchIndex')) : defaultSearchIndex);

  const getDataLable = (fieldValue) => {
    if (fieldValue !== '') {
      return <FormattedMessage id={`ui-finc-select.dataOption.${fieldValue}`} />;
    } else {
      return <NoValue />;
    }
  };

  const resultsFormatter = {
    label: result => result.label,
    sourceId: result => result.sourceId,
    status: result => getDataLable(_.get(result, 'status', '')),
    lastProcessed: result => result.lastProcessed,
  };

  // generate url for record-details
  const rowURL = (id) => {
    return `${urls.sourceView(id)}${searchString}`;
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
  const renderResultsPaneSubtitle = (result) => {
    if (result) {
      const count = result ? result.totalCount() : 0;
      return <FormattedMessage id="stripes-smart-components.searchResultsCountHeader" values={{ count }} />;
    }

    return <FormattedMessage id="stripes-smart-components.searchCriteria" />;
  };

  const renderNavigation = (id) => (
    <Navigation id={id} />
  );

  const renderIsEmptyMessage = (query, result) => {
    if (!result) {
      return <FormattedMessage id="ui-finc-select.noSourceYet" />;
    }

    return (
      <div data-test-sources-no-results-message>
        <NoResultsMessage
          source={result}
          searchTerm={query.query || ''}
          filterPaneIsVisible
          toggleFilterPane={_.noop}
        />
      </div>
    );
  };

  const cacheFilter = (activeFilters, searchValue) => {
    localStorage.setItem('fincSelectSourceFilters', JSON.stringify(activeFilters));
    localStorage.setItem('fincSelectSourceSearchString', JSON.stringify(searchValue));
  };

  const resetAll = (getFilterHandlers, getSearchHandlers) => {
    localStorage.removeItem('fincSelectSourceFilters');
    localStorage.removeItem('fincSelectSourceSearchString');
    localStorage.removeItem('fincSelectSourceSearchIndex');

    // reset the filter state to default filters
    getFilterHandlers.state(defaultFilter.state);

    // reset the search query
    getSearchHandlers.state(defaultSearchString);

    setStoredFilter(defaultFilter);
    setStoredSearchString(defaultSearchString);
    setStoredSearchIndex(defaultSearchIndex);

    return (history.push(`${urls.sources()}?filters=${defaultFilter.string}`));
  };

  const handleClearSearch = (getSearchHandlers, onSubmitSearch, searchValue) => {
    localStorage.removeItem('fincSelectSourceSearchString');
    localStorage.removeItem('fincSelectSourceSearchIndex');

    setStoredSearchIndex(defaultSearchIndex);

    searchValue.query = '';

    getSearchHandlers.state({
      query: '',
      qindex: '',
    });

    return onSubmitSearch;
  };

  const handleChangeSearch = (e, getSearchHandlers) => {
    getSearchHandlers.state({
      query: e,
    });
  };

  const doChangeIndex = (index, getSearchHandlers, searchValue) => {
    localStorage.setItem('fincSelectSourceSearchIndex', JSON.stringify(index));
    setStoredSearchIndex(index);
    // call function in SourcesRoute.js:
    onChangeIndex(index);
    getSearchHandlers.state({
      query: searchValue.query,
      qindex: index,
    });
  };

  const getCombinedSearch = () => {
    if (storedSearchIndex.qindex !== '') {
      const combined = {
        query: storedSearchString.query,
        qindex: storedSearchIndex,
      };
      return combined;
    } else {
      return storedSearchString;
    }
  };

  const getDisableReset = (activeFilters, searchValue) => {
    return _.isEqual(activeFilters.state, defaultFilter.state) && searchValue.query === defaultSearchString.query;
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
        paneSub={renderResultsPaneSubtitle(result)}
        paneTitle={<FormattedMessage id="ui-finc-select.sources.title" />}
      />
    );
  };

  const count = source ? source.totalCount() : 0;
  const query = queryGetter() || {};
  const sortOrder = query.sort || '';

  if (!searchableIndexes) {
    searchableIndexes = rawSearchableIndexes.map(index => (
      { value: index.value, label: intl.formatMessage({ id: `ui-finc-select.source.search.${index.label}` }) }
    ));
  }

  return (
    <div data-test-sources data-testid="sources">
      <SearchAndSortQuery
        // NEED FILTER: {"status":["active","implementation","request"]}
        initialFilterState={storedFilter.state}
        initialSearchState={getCombinedSearch()}
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
                    defaultWidth="18%"
                    id="pane-sourcefilter"
                    renderHeader={renderFilterPaneHeader}
                  >
                    <form onSubmit={onSubmitSearch}>
                      {renderNavigation('source')}
                      <div>
                        <SearchField
                          ariaLabel="search"
                          autoFocus
                          id="sourceSearchField"
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
                          // add values for search-selectbox
                          onChangeIndex={(e) => { doChangeIndex(e.target.value, getSearchHandlers(), searchValue); }}
                          searchableIndexes={searchableIndexes}
                          selectedIndex={storedSearchIndex}
                        />
                        <Button
                          buttonStyle="primary"
                          disabled={disableSearch()}
                          fullWidth
                          id="sourceSubmitSearch"
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
                      <SourceFilters
                        activeFilters={activeFilters.state}
                        filterHandlers={getFilterHandlers()}
                      />
                    </form>
                  </Pane>
                }
                <Pane
                  data-test-source-pane-results
                  defaultWidth="fill"
                  id="pane-sourceresults"
                  padContent={false}
                  renderHeader={() => renderResultsPaneHeader(activeFilters, source)}
                >
                  <MultiColumnList
                    autosize
                    columnMapping={{
                      label: <FormattedMessage id="ui-finc-select.source.label" />,
                      sourceId: <FormattedMessage id="ui-finc-select.source.id" />,
                      status: <FormattedMessage id="ui-finc-select.source.status" />,
                      lastProcessed: <FormattedMessage id="ui-finc-select.source.lastProcessed" />,
                    }}
                    contentData={contentData}
                    formatter={resultsFormatter}
                    id="list-sources"
                    isEmptyMessage={renderIsEmptyMessage(query, source)}
                    isSelected={({ item }) => item.id === selectedRecordId}
                    onHeaderClick={onSort}
                    onNeedMoreData={onNeedMoreData}
                    onRowClick={onSelectRow}
                    rowFormatter={rowFormatter}
                    sortDirection={sortOrder.startsWith('-') ? 'descending' : 'ascending'}
                    sortOrder={sortOrder.replace(/^-/, '').replace(/,.*/, '')}
                    totalCount={count}
                    virtualize
                    visibleColumns={['label', 'sourceId', 'status', 'lastProcessed']}
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

MetadataSources.propTypes = {
  children: PropTypes.object,
  contentData: PropTypes.arrayOf(PropTypes.object),
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }),
  onNeedMoreData: PropTypes.func,
  onSelectRow: PropTypes.func,
  queryGetter: PropTypes.func,
  querySetter: PropTypes.func,
  searchField: PropTypes.object,
  searchString: PropTypes.string,
  source: PropTypes.object,
  // add values for search-selectbox
  onChangeIndex: PropTypes.func,
  selectedRecordId: PropTypes.string,
};

export default injectIntl(withRouter(MetadataSources));

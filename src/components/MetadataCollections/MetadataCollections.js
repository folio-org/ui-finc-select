import PropTypes from 'prop-types';
import { noop, get, isEqual } from 'lodash';
import { useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
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

import CollectionFilters from './CollectionFilters';
import urls from '../DisplayUtils/urls';
import Navigation from '../Navigation/Navigation';

const rawSearchableIndexes = [
  { label: 'all', value: '', makeQuery: term => `(label="${term}*" or description="${term}*" or collectionId="${term}*")` },
  { label: 'label', value: 'label', makeQuery: term => `(label="${term}*")` },
  { label: 'description', value: 'description', makeQuery: term => `(description="${term}*")` },
  { label: 'collectionId', value: 'collectionId', makeQuery: term => `(collectionId="${term}*")` },
];
let searchableIndexes;

const defaultFilter = { state: { permitted: ['yes'], selected: ['yes'] }, string: 'permitted.yes,selected.yes' };
const defaultSearchString = { query: '' };

const MetadataCollections = ({
  children,
  collection,
  contentData = {},
  filterData = {},
  intl,
  onNeedMoreData,
  onSelectRow,
  queryGetter,
  querySetter,
  searchField,
  searchString = '',
  selectedRecordId,
  // add values for search-selectbox
  onChangeIndex,
}) => {
  const [filterPaneIsVisible, setFilterPaneIsVisible] = useState(true);

  const getDataLable = (fieldValue) => {
    if (fieldValue !== '') {
      return <FormattedMessage id={`ui-finc-select.dataOption.${fieldValue}`} />;
    } else {
      return <NoValue />;
    }
  };

  const resultsFormatter = {
    label: result => result.label,
    mdSource: result => get(result, 'mdSource.name', <NoValue />),
    permitted: result => getDataLable(get(result, 'permitted', '')),
    selected: result => getDataLable(get(result, 'selected', '')),
    freeContent: result => getDataLable(get(result, 'freeContent', '')),
  };

  // generate url for record-details
  const rowURL = (id) => {
    return `${urls.collectionView(id)}${searchString}`;
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
  const renderResultsPaneSubtitle = (col) => {
    if (col) {
      const count = col ? col.totalCount() : 0;
      return <FormattedMessage id="stripes-smart-components.searchResultsCountHeader" values={{ count }} />;
    }

    return <FormattedMessage id="stripes-smart-components.searchCriteria" />;
  };

  const renderNavigation = (id) => (
    <Navigation id={id} />
  );

  const renderIsEmptyMessage = (query, source) => {
    if (!source) {
      return <FormattedMessage id="ui-finc-select.noSourceYet" />;
    }

    return (
      <div data-test-collections-no-results-message>
        <NoResultsMessage
          source={source}
          searchTerm={query.query || ''}
          filterPaneIsVisible
          toggleFilterPane={noop}
        />
      </div>
    );
  };

  const storeSearchString = () => {
    localStorage.setItem('finc-select-collections-search-string', searchString);
  };

  const resetAll = (getFilterHandlers, getSearchHandlers) => {
    // reset the filter state to default filters
    getFilterHandlers.state(defaultFilter.state);

    // reset the search query
    getSearchHandlers.state(defaultSearchString);
  };

  const handleClearSearch = (getSearchHandlers, onSubmitSearch, searchValue) => {
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
    // call function in CollectionsRoute.js:
    onChangeIndex(index);
    getSearchHandlers.state({
      query: searchValue.query,
      qindex: index,
    });
  };

  const getDisableReset = (activeFilters, searchValue) => {
    return isEqual(activeFilters.state, defaultFilter.state) && searchValue.query === defaultSearchString.query;
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

  const renderResultsPaneHeader = (activeFilters, col) => {
    return (
      <PaneHeader
        appIcon={<AppIcon app="finc-select" />}
        firstMenu={renderResultsFirstMenu(activeFilters)}
        paneTitle={<FormattedMessage id="ui-finc-select.collections.title" />}
        paneSub={renderResultsPaneSubtitle(col)}
      />
    );
  };

  const count = collection ? collection.totalCount() : 0;
  const query = queryGetter() || {};
  const sortOrder = query.sort || '';

  if (!searchableIndexes) {
    searchableIndexes = rawSearchableIndexes.map(index => (
      { value: index.value, label: intl.formatMessage({ id: `ui-finc-select.collection.search.${index.label}` }) }
    ));
  }

  return (
    <div data-test-collections data-testid="collections">
      <SearchAndSortQuery
        initialFilterState={searchString === '' ? defaultFilter.state : {}}
        initialSortState={{ sort: 'label' }}
        queryGetter={queryGetter}
        querySetter={querySetter}
        setQueryOnMount
        searchParamsMapping={{
          query: (q) => ({ query: q }),
          qindex: (q) => ({ qindex: q }),
        }}
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
              storeSearchString();
            }

            return (
              <Paneset>
                {filterPaneIsVisible &&
                  <Pane
                    data-test-collection-pane-filter
                    defaultWidth="18%"
                    id="pane-collectionfilter"
                    renderHeader={renderFilterPaneHeader}
                  >
                    <form onSubmit={onSubmitSearch}>
                      {renderNavigation('collection')}
                      <div>
                        <SearchField
                          ariaLabel="search"
                          autoFocus
                          id="collectionSearchField"
                          inputRef={searchField}
                          name="query"
                          indexName="qindex"
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
                          selectedIndex={searchValue.qindex}
                        />
                        <Button
                          buttonStyle="primary"
                          disabled={disableSearch()}
                          fullWidth
                          id="collectionSubmitSearch"
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
                      <CollectionFilters
                        activeFilters={activeFilters.state}
                        filterData={filterData}
                        filterHandlers={getFilterHandlers()}
                      />
                    </form>
                  </Pane>
                }
                <Pane
                  data-test-collection-pane-results
                  defaultWidth="fill"
                  id="pane-collectionresults"
                  padContent={false}
                  renderHeader={() => renderResultsPaneHeader(activeFilters, collection)}
                >
                  <MultiColumnList
                    autosize
                    columnMapping={{
                      label: <FormattedMessage id="ui-finc-select.collection.label" />,
                      mdSource: <FormattedMessage id="ui-finc-select.collection.mdSource" />,
                      permitted: <FormattedMessage id="ui-finc-select.collection.permitted" />,
                      selected: <FormattedMessage id="ui-finc-select.collection.selected" />,
                      freeContent: <FormattedMessage id="ui-finc-select.collection.freeContent" />,
                    }}
                    contentData={contentData}
                    formatter={resultsFormatter}
                    id="list-collections"
                    isEmptyMessage={renderIsEmptyMessage(query, collection)}
                    isSelected={({ item }) => item.id === selectedRecordId}
                    onHeaderClick={onSort}
                    onNeedMoreData={onNeedMoreData}
                    onRowClick={onSelectRow}
                    rowFormatter={rowFormatter}
                    sortDirection={sortOrder.startsWith('-') ? 'descending' : 'ascending'}
                    sortOrder={sortOrder.replace(/^-/, '').replace(/,.*/, '')}
                    totalCount={count}
                    virtualize
                    visibleColumns={['label', 'mdSource', 'permitted', 'freeContent']}
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

MetadataCollections.propTypes = {
  children: PropTypes.object,
  collection: PropTypes.object,
  contentData: PropTypes.arrayOf(PropTypes.object),
  filterData: PropTypes.shape({
    mdSources: PropTypes.arrayOf(PropTypes.object),
  }),
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }),
  onNeedMoreData: PropTypes.func,
  onSelectRow: PropTypes.func,
  queryGetter: PropTypes.func,
  querySetter: PropTypes.func,
  searchString: PropTypes.string,
  selectedRecordId: PropTypes.string,
  searchField: PropTypes.object,
  // add values for search-selectbox
  onChangeIndex: PropTypes.func,
};

export default injectIntl(withRouter(MetadataCollections));

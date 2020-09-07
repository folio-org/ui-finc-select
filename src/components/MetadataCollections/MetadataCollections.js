import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import {
  Link,
  withRouter,
} from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import {
  CollapseFilterPaneButton,
  ExpandFilterPaneButton,
  SearchAndSortQuery,
} from '@folio/stripes/smart-components';
import {
  Button,
  Icon,
  MultiColumnList,
  NoValue,
  Pane,
  PaneMenu,
  Paneset,
  SearchField,
} from '@folio/stripes/components';
import { AppIcon } from '@folio/stripes/core';

import CollectionFilters from './CollectionFilters';
import urls from '../DisplayUtils/urls';
import Navigation from '../Navigation/Navigation';
import freeContentOptions from '../DataOptions/freeContent';
import usagePermittedOptions from '../DataOptions/usagePermitted';

const searchableIndexes = [
  { label: 'All', value: '', makeQuery: term => `(label="${term}*" or description="${term}*" or collectionId="${term}*")` },
  { label: 'Collection Name', value: 'label', makeQuery: term => `(label="${term}*")` },
  { label: 'Description', value: 'description', makeQuery: term => `(description="${term}*")` },
  { label: 'Collection ID', value: 'collectionId', makeQuery: term => `(collectionId="${term}*")` },
];
const defaultFilter = { state: { permitted: ['yes'], selected: ['yes'] }, string: 'permitted.yes,selected.yes' };
const defaultSearchString = { query: '' };
const defaultSearchIndex = '';

class MetadataCollections extends React.Component {
  static propTypes = {
    children: PropTypes.object,
    collection: PropTypes.object,
    contentData: PropTypes.arrayOf(PropTypes.object),
    disableRecordCreation: PropTypes.bool,
    filterData: PropTypes.shape({
      mdSources: PropTypes.array,
    }),
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    onNeedMoreData: PropTypes.func,
    onSelectRow: PropTypes.func,
    packageInfo: PropTypes.shape({ // values pulled from the provider's package.json config object
      initialFilters: PropTypes.string, // default filters
      moduleName: PropTypes.string, // machine-readable, for HTML ids and translation keys
      stripes: PropTypes.shape({
        route: PropTypes.string, // base route; used to construct URLs
      }).isRequired,
    }),
    queryGetter: PropTypes.func,
    querySetter: PropTypes.func,
    searchString: PropTypes.string,
    selectedRecordId: PropTypes.string,
    // add values for search-selectbox
    onChangeIndex: PropTypes.func,
    selectedIndex: PropTypes.object,
    filterHandlers: PropTypes.object,
    activeFilters: PropTypes.object,
  };

  static defaultProps = {
    contentData: {},
    filterData: {},
    searchString: '',
  }

  constructor(props, context) {
    super(props, context);

    this.state = {
      filterPaneIsVisible: true,
      storedFilter: localStorage.getItem('fincSelectCollectionFilters') ? JSON.parse(localStorage.getItem('fincSelectCollectionFilters')) : defaultFilter,
      storedSearchString: localStorage.getItem('fincSelectCollectionSearchString') ? JSON.parse(localStorage.getItem('fincSelectCollectionSearchString')) : defaultSearchString,
      storedSearchIndex: localStorage.getItem('fincSelectCollectionSearchIndex') ? JSON.parse(localStorage.getItem('fincSelectCollectionSearchIndex')) : defaultSearchIndex,
    };
  }

  getFreeContentLabel(freeContentValue) {
    const dataWithFreeContentValue = freeContentOptions.find(
      (e) => e.value === freeContentValue
    );
    const freeContentLabel = _.get(dataWithFreeContentValue, 'label', <NoValue />);

    return freeContentLabel;
  }

  getUsagePermittedLabel(usagePermittedValue) {
    const dataWithUsagePermittedValue = usagePermittedOptions.find(
      (e) => e.value === usagePermittedValue
    );
    const usagePermittedLabel = _.get(dataWithUsagePermittedValue, 'label', <NoValue />);

    return usagePermittedLabel;
  }

  resultsFormatter = {
    label: collection => collection.label,
    mdSource: collection => _.get(collection, 'mdSource.name', <NoValue />),
    permitted: collection => this.getUsagePermittedLabel(collection.permitted),
    selected: collection => collection.selected,
    freeContent: collection => this.getFreeContentLabel(collection.freeContent),
  };

  rowFormatter = (row) => {
    const { rowClass, rowData, rowIndex, rowProps = {}, cells } = row;
    let RowComponent;

    if (this.props.onSelectRow) {
      RowComponent = 'div';
    } else {
      RowComponent = Link;
      rowProps.to = this.rowURL(rowData.id);
    }

    return (
      <RowComponent
        aria-rowindex={rowIndex + 2}
        className={rowClass}
        data-label={[
          rowData.name,
        ]}
        key={`row-${rowIndex}`}
        role="row"
        {...rowProps}
      >
        {cells}
      </RowComponent>
    );
  }

    // generate url for record-details
    rowURL = (id) => {
      return `${urls.collectionView(id)}${this.props.searchString}`;
    }

    // fade in/out of filter-pane
    toggleFilterPane = () => {
      this.setState(curState => ({
        filterPaneIsVisible: !curState.filterPaneIsVisible,
      }));
    }

  // fade in / out the filter menu
  renderResultsFirstMenu = (filters) => {
    const { filterPaneIsVisible } = this.state;
    const filterCount = filters.string !== '' ? filters.string.split(',').length : 0;
    if (filterPaneIsVisible) {
      return null;
    }

    return (
      <PaneMenu>
        <ExpandFilterPaneButton
          filterCount={filterCount}
          onClick={this.toggleFilterPane}
        />
      </PaneMenu>
    );
  }

  // counting records of result list
  renderResultsPaneSubtitle = (collection) => {
    if (collection) {
      const count = collection ? collection.totalCount() : 0;
      return <FormattedMessage id="stripes-smart-components.searchResultsCountHeader" values={{ count }} />;
    }

    return <FormattedMessage id="stripes-smart-components.searchCriteria" />;
  }

  renderNavigation = (id) => (
    <Navigation
      id={id}
    />
  );

  cacheFilter(activeFilters, searchValue) {
    localStorage.setItem('fincSelectCollectionFilters', JSON.stringify(activeFilters));
    localStorage.setItem('fincSelectCollectionSearchString', JSON.stringify(searchValue));
  }

  resetAll(getFilterHandlers, getSearchHandlers) {
    localStorage.removeItem('fincSelectCollectionFilters');
    localStorage.removeItem('fincSelectCollectionSearchString');
    localStorage.removeItem('fincSelectCollectionSearchIndex');

    // reset the filter state to default filters
    getFilterHandlers.state(defaultFilter.state);

    // reset the search query
    getSearchHandlers.state(defaultSearchString);

    this.setState({
      storedFilter: defaultFilter,
      storedSearchString: defaultSearchString,
      storedSearchIndex: defaultSearchIndex,
    });

    return (this.props.history.push(`${urls.collections()}?filters=${defaultFilter.string}`));
  }

  handleClearSearch(getSearchHandlers, onSubmitSearch, searchValue) {
    localStorage.removeItem('fincSelectCollectionSearchString');
    localStorage.removeItem('fincSelectCollectionSearchIndex');

    this.setState({ storedSearchIndex: defaultSearchIndex });

    searchValue.query = '';

    getSearchHandlers.state({
      query: '',
      qindex: '',
    });

    return onSubmitSearch;
  }

  handleChangeSearch(e, getSearchHandlers) {
    getSearchHandlers.state({
      query: e,
    });
  }

  onChangeIndex(index, getSearchHandlers, searchValue) {
    localStorage.setItem('fincSelectCollectionSearchIndex', JSON.stringify(index));
    this.setState({ storedSearchIndex: index });
    // call function in CollectionsRoute.js:
    this.props.onChangeIndex(index);
    getSearchHandlers.state({
      query: searchValue.query,
      qindex: index,
    });
  }

  getCombinedSearch = () => {
    if (this.state.storedSearchIndex.qindex !== '') {
      const combined = {
        query: this.state.storedSearchString.query,
        qindex: this.state.storedSearchIndex,
      };
      return combined;
    } else {
      return this.state.storedSearchString;
    }
  }

  getDisableReset(activeFilters, searchValue) {
    if (_.isEqual(activeFilters.state, defaultFilter.state) && searchValue.query === defaultSearchString.query) {
      return true;
    } else {
      return false;
    }
  }

  render() {
    const { queryGetter, querySetter, onNeedMoreData, onSelectRow, selectedRecordId, collection, filterData } = this.props;
    const count = collection ? collection.totalCount() : 0;
    const query = queryGetter() || {};
    const sortOrder = query.sort || '';

    return (
      <div data-test-collections>
        <SearchAndSortQuery
          initialFilterState={this.state.storedFilter.state}
          initialSearchState={this.getCombinedSearch()}
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
              const disableReset = this.getDisableReset(activeFilters, searchValue);
              const disableSearch = () => (searchValue.query === defaultSearchString.query);
              if (filterChanged || searchChanged) {
                this.cacheFilter(activeFilters, searchValue);
              }

              return (
                <Paneset>
                  {this.state.filterPaneIsVisible &&
                    <Pane
                      data-test-collection-pane-filter
                      defaultWidth="18%"
                      id="pane-collectionfilter"
                      lastMenu={
                        <PaneMenu>
                          <CollapseFilterPaneButton
                            onClick={this.toggleFilterPane}
                          />
                        </PaneMenu>
                      }
                      paneTitle={<FormattedMessage id="stripes-smart-components.searchAndFilter" />}
                    >
                      <form onSubmit={onSubmitSearch}>
                        {this.renderNavigation('collection')}
                        <div>
                          <FormattedMessage id="ui-finc-select.searchInputLabel">
                            {ariaLabel => (
                              <SearchField
                                ariaLabel={ariaLabel}
                                autoFocus
                                id="collectionSearchField"
                                inputRef={this.searchField}
                                name="query"
                                onChange={(e) => {
                                  if (e.target.value) {
                                    this.handleChangeSearch(e.target.value, getSearchHandlers());
                                  } else {
                                    this.handleClearSearch(getSearchHandlers(), onSubmitSearch(), searchValue);
                                  }
                                }}
                                onClear={() => this.handleClearSearch(getSearchHandlers(), onSubmitSearch(), searchValue)}
                                value={searchValue.query}
                                // add values for search-selectbox
                                onChangeIndex={(e) => { this.onChangeIndex(e.target.value, getSearchHandlers(), searchValue); }}
                                searchableIndexes={searchableIndexes}
                                searchableIndexesPlaceholder={null}
                                selectedIndex={this.state.storedSearchIndex}
                              />
                            )}
                          </FormattedMessage>
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
                          onClick={() => this.resetAll(getFilterHandlers(), getSearchHandlers())}
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
                    appIcon={<AppIcon app="finc-select" />}
                    data-test-collection-pane-results
                    defaultWidth="fill"
                    firstMenu={this.renderResultsFirstMenu(activeFilters)}
                    id="pane-collectionresults"
                    padContent={false}
                    paneTitle={<FormattedMessage id="ui-finc-select.collections.title" />}
                    paneSub={this.renderResultsPaneSubtitle(collection)}
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
                      contentData={this.props.contentData}
                      formatter={this.resultsFormatter}
                      id="list-collections"
                      isEmptyMessage="no results"
                      isSelected={({ item }) => item.id === selectedRecordId}
                      onHeaderClick={onSort}
                      onNeedMoreData={onNeedMoreData}
                      onRowClick={onSelectRow}
                      rowFormatter={this.rowFormatter}
                      sortDirection={
                        sortOrder.startsWith('-') ? 'descending' : 'ascending'
                      }
                      sortOrder={sortOrder.replace(/^-/, '').replace(/,.*/, '')}
                      totalCount={count}
                      virtualize
                      visibleColumns={['label', 'mdSource', 'permitted', 'freeContent']}
                    />
                  </Pane>
                  {this.props.children}
                </Paneset>
              );
            }
          }
        </SearchAndSortQuery>
      </div>
    );
  }
}

export default withRouter(MetadataCollections);

import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import {
  Link,
  withRouter,
} from 'react-router-dom';
import {
  FormattedMessage,
  injectIntl,
} from 'react-intl';

import {
  SearchAndSortQuery,
  SearchAndSortSearchButton as FilterPaneToggle,
} from '@folio/stripes/smart-components';
import {
  Button,
  Icon,
  MultiColumnList,
  Pane,
  PaneMenu,
  Paneset,
  SearchField,
} from '@folio/stripes/components';
import {
  AppIcon,
  IfPermission
} from '@folio/stripes/core';

import urls from '../DisplayUtils/urls';
import FilterFilters from './FilterFilters';
import Navigation from '../Navigation/Navigation';

const defaultFilter = { state: { type: ['Whitelist', 'Blacklist'] }, string: 'type.Whitelist,type.Blacklist' };
const defaultSearchString = { query: '' };

class Filters extends React.Component {
  static propTypes = {
    children: PropTypes.object,
    contentData: PropTypes.arrayOf(PropTypes.object),
    disableRecordCreation: PropTypes.bool,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    intl: PropTypes.object,
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
    filter: PropTypes.object,
    selectedRecordId: PropTypes.string,
  };

  static defaultProps = {
    contentData: {},
    searchString: '',
  }

  constructor(props) {
    super(props);

    this.state = {
      filterPaneIsVisible: true,
      storedFilter: localStorage.getItem('fincSelectFilterFilters') ? JSON.parse(localStorage.getItem('fincSelectFilterFilters')) : defaultFilter,
      storedSearchString: localStorage.getItem('fincSelectFilterSearchString') ? JSON.parse(localStorage.getItem('fincSelectFilterSearchString')) : defaultSearchString,
    };
  }

  resultsFormatter = {
    label: filter => filter.label,
    type: filter => filter.type,
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
    return `${urls.filterView(id)}${this.props.searchString}`;
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
    const hideOrShowMessageId = filterPaneIsVisible ?
      'stripes-smart-components.hideSearchPane' : 'stripes-smart-components.showSearchPane';

    return (
      <PaneMenu>
        <FormattedMessage id="stripes-smart-components.numberOfFilters" values={{ count: filterCount }}>
          {appliedFiltersMessage => (
            <FormattedMessage id={hideOrShowMessageId}>
              {hideOrShowMessage => (
                <FilterPaneToggle
                  aria-label={`${hideOrShowMessage}...${appliedFiltersMessage}`}
                  onClick={this.toggleFilterPane}
                  visible={filterPaneIsVisible}
                />
              )}
            </FormattedMessage>
          )}
        </FormattedMessage>
      </PaneMenu>
    );
  }

  // counting records of result list
  renderResultsPaneSubtitle = (filter) => {
    if (filter) {
      const count = filter ? filter.totalCount() : 0;
      return <FormattedMessage id="stripes-smart-components.searchResultsCountHeader" values={{ count }} />;
    }

    return <FormattedMessage id="stripes-smart-components.searchCriteria" />;
  }

  // button for creating a new record
  renderResultsLastMenu() {
    if (this.props.disableRecordCreation) {
      return null;
    }

    return (
      <IfPermission perm="finc-select.filters.item.post">
        <PaneMenu>
          <FormattedMessage id="ui-finc-select.filter.form.createFilter">
            {ariaLabel => (
              <Button
                aria-label={ariaLabel}
                buttonStyle="primary"
                id="clickable-new-filter"
                marginBottom0
                to={`${urls.filterCreate()}${this.props.searchString}`}
              >
                <FormattedMessage id="stripes-smart-components.new" />
              </Button>
            )}
          </FormattedMessage>
        </PaneMenu>
      </IfPermission>
    );
  }

  renderNavigation = (id) => (
    <Navigation
      id={id}
    />
  );

  cacheFilter(activeFilters, searchValue) {
    localStorage.setItem('fincSelectFilterFilters', JSON.stringify(activeFilters));
    localStorage.setItem('fincSelectFilterSearchString', JSON.stringify(searchValue));
  }

  resetAll(getFilterHandlers, getSearchHandlers) {
    localStorage.removeItem('fincSelectFilterFilters');
    localStorage.removeItem('fincSelectFilterSearchString');

    // reset the filter state to default filters
    getFilterHandlers.state(defaultFilter.state);

    // reset the search query
    getSearchHandlers.state(defaultSearchString);

    this.setState({
      storedFilter: defaultFilter,
      storedSearchString: defaultSearchString,
    });

    return (this.props.history.push(`${urls.filters()}?filters=${defaultFilter.string}`));
  }

  handleClearSearch(getSearchHandlers, onSubmitSearch, searchValue) {
    localStorage.removeItem('fincSelectFilterSearchString');

    searchValue.query = '';

    getSearchHandlers.state({
      query: '',
    });

    return onSubmitSearch;
  }

  handleChangeSearch(e, getSearchHandlers) {
    getSearchHandlers.state({
      query: e,
    });
  }

  getDisableReset(activeFilters, searchValue) {
    if (_.isEqual(activeFilters.state, defaultFilter.state) && searchValue.query === defaultSearchString.query) {
      return true;
    } else {
      return false;
    }
  }

  render() {
    const { intl, queryGetter, querySetter, onNeedMoreData, onSelectRow, selectedRecordId, filter } = this.props;
    const count = filter ? filter.totalCount() : 0;
    const query = queryGetter() || {};
    const sortOrder = query.sort || '';

    return (
      <div data-test-filters>
        <SearchAndSortQuery
          initialFilterState={this.state.storedFilter.state}
          initialSearchState={this.state.storedSearchString}
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
                      data-test-filter-pane-filter
                      defaultWidth="18%"
                      id="pane-filterfilter"
                      onClose={this.toggleFilterPane}
                      paneTitle={<FormattedMessage id="stripes-smart-components.searchAndFilter" />}
                    >
                      <form onSubmit={onSubmitSearch}>
                        {this.renderNavigation('filter')}
                        <div>
                          <FormattedMessage id="ui-finc-select.filter.searchInputLabel">
                            {ariaLabel => (
                              <SearchField
                                ariaLabel={ariaLabel}
                                autoFocus
                                id="filterSearchField"
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
                              />
                            )}
                          </FormattedMessage>
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
                          onClick={() => this.resetAll(getFilterHandlers(), getSearchHandlers())}
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
                    appIcon={<AppIcon app="finc-select" />}
                    data-test-filter-pane-results
                    defaultWidth="fill"
                    firstMenu={this.renderResultsFirstMenu(activeFilters)}
                    id="pane-filterresults"
                    lastMenu={this.renderResultsLastMenu()}
                    padContent={false}
                    paneTitle={<FormattedMessage id="ui-finc-select.filters.title" />}
                    paneSub={this.renderResultsPaneSubtitle(filter)}
                    style={{ minWidth: '42%' }}
                  >
                    <MultiColumnList
                      autosize
                      columnMapping={{
                        label: intl.formatMessage({ id: 'ui-finc-select.filter.label' }),
                        type: intl.formatMessage({ id: 'ui-finc-select.filter.type' }),
                      }}
                      contentData={this.props.contentData}
                      formatter={this.resultsFormatter}
                      id="list-filters"
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
                      visibleColumns={['label', 'type']}
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

export default withRouter(injectIntl(Filters));

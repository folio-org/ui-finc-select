import PropTypes from 'prop-types';
import {
  get,
  isEqual,
} from 'lodash';
import { useState } from 'react';
import { withRouter } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import { SearchAndSortQuery } from '@folio/stripes/smart-components';
import {
  Button,
  Icon,
  MultiColumnList,
  Pane,
  Paneset,
  SearchField,
} from '@folio/stripes/components';

import {
  createRowFormatter,
  createRowURL,
  getDataLabel,
  renderFilterPaneHeader,
  renderIsEmptyMessage,
  renderNavigation,
  renderResultsPaneHeader,
} from '../DisplayUtils/renderListUtils';
import urls from '../DisplayUtils/urls';
import FilterFilters from './FilterFilters';

const defaultFilter = { type: ['Whitelist', 'Blacklist'] };
const defaultSearch = { query: '' };
const defaultSort = { sort: 'label' };

const Filters = ({
  children,
  contentData = {},
  disableRecordCreation,
  filter,
  onNeedMoreData,
  onSelectRow,
  queryGetter,
  querySetter,
  searchField,
  searchString = '',
  selectedRecordId,
}) => {
  const [filterPaneIsVisible, setFilterPaneIsVisible] = useState(true);

  const resultsFormatter = {
    label: result => result.label,
    type: result => getDataLabel(get(result, 'type', '')),
  };

  // fade in/out of filter-pane
  const toggleFilterPane = () => {
    setFilterPaneIsVisible(curState => !curState);
  };

  const storeSearchString = () => {
    localStorage.setItem('finc-select-filters-search-string', searchString);
  };

  const rowURL = createRowURL(urls.filterView, searchString);
  const rowFormatter = createRowFormatter(rowURL, onSelectRow);
  const count = filter ? filter.totalCount() : 0;
  const query = queryGetter() || {};
  const sortOrder = query.sort || '';

  return (
    <SearchAndSortQuery
      initialFilterState={defaultFilter}
      initialSearchState={defaultSearch}
      initialSortState={defaultSort}
      queryGetter={queryGetter}
      querySetter={querySetter}
      setQueryOnMount
    >
      {
        ({
          activeFilters,
          getFilterHandlers,
          getSearchHandlers,
          onSort,
          onSubmitSearch,
          resetAll,
          searchValue,
        }) => {
          const filterChanged = !isEqual(activeFilters.state, defaultFilter);
          const searchChanged = searchValue.query && !isEqual(searchValue, defaultSearch);

          storeSearchString();

          return (
            <Paneset>
              {filterPaneIsVisible &&
                <Pane
                  defaultWidth="18%"
                  id="pane-filter-filter"
                  renderHeader={() => renderFilterPaneHeader({ toggleFilterPane })}
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
                            getSearchHandlers().query(e);
                          } else {
                            getSearchHandlers().reset();
                          }
                        }}
                        onClear={getSearchHandlers().reset}
                        value={searchValue.query}
                      />
                      <Button
                        buttonStyle="primary"
                        disabled={!searchChanged}
                        fullWidth
                        id="filterSubmitSearch"
                        type="submit"
                      >
                        <FormattedMessage id="stripes-smart-components.search" />
                      </Button>
                    </div>
                    <Button
                      buttonStyle="none"
                      disabled={!(filterChanged || searchChanged)}
                      id="clickable-reset-all"
                      onClick={resetAll}
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
                defaultWidth="fill"
                id="pane-filter-results"
                padContent={false}
                style={{ minWidth: '42%' }}
                renderHeader={() => renderResultsPaneHeader({
                  activeFilters,
                  createUrl: `${urls.filterCreate()}${searchString}`,
                  disableRecordCreation,
                  filterPaneIsVisible,
                  paneTitleId: 'ui-finc-select.filters.title',
                  permission: 'ui-finc-select.create',
                  result: filter,
                  toggleFilterPane,
                })}
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
                  isEmptyMessage={renderIsEmptyMessage(query, filter, filterPaneIsVisible)}
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
  );
};

Filters.propTypes = {
  children: PropTypes.object,
  contentData: PropTypes.arrayOf(PropTypes.object),
  disableRecordCreation: PropTypes.bool,
  filter: PropTypes.object,
  onNeedMoreData: PropTypes.func,
  onSelectRow: PropTypes.func,
  queryGetter: PropTypes.func,
  querySetter: PropTypes.func,
  searchField: PropTypes.object,
  searchString: PropTypes.string,
  selectedRecordId: PropTypes.string,
};

export default withRouter(Filters);

import PropTypes from 'prop-types';
import {
  get,
  isEqual,
} from 'lodash';
import { useState } from 'react';
import { withRouter } from 'react-router-dom';
import { injectIntl, FormattedMessage } from 'react-intl';

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
import SourceFilters from './SourceFilters';

const rawSearchableIndexes = [
  { label: 'all', value: '', makeQuery: term => `(label="${term}*" or description="${term}*" or sourceId="${term}*")` },
  { label: 'label', value: 'label', makeQuery: term => `(label="${term}*")` },
  { label: 'description', value: 'description', makeQuery: term => `(description="${term}*")` },
  { label: 'sourceId', value: 'sourceId', makeQuery: term => `(sourceId="${term}*")` },
];
let searchableIndexes;

const defaultFilter = { status: ['active', 'implementation'] };
const defaultSearch = { query: '', qindex: '' };
const defaultSort = { sort: 'label' };

const MetadataSources = ({
  children,
  contentData = {},
  // prevent rendering create button
  disableRecordCreation = true,
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

  const resultsFormatter = {
    label: result => result.label,
    sourceId: result => result.sourceId,
    status: result => getDataLabel(get(result, 'status', '')),
    lastProcessed: result => result.lastProcessed,
  };

  // fade in/out of filter-pane
  const toggleFilterPane = () => {
    setFilterPaneIsVisible(curState => !curState);
  };

  const storeSearchString = () => {
    localStorage.setItem('finc-select-sources-search-string', searchString);
  };

  const rowURL = createRowURL(urls.sourceView, searchString);
  const rowFormatter = createRowFormatter(rowURL, onSelectRow);
  const count = source ? source.totalCount() : 0;
  const query = queryGetter() || {};
  const sortOrder = query.sort || '';

  if (!searchableIndexes) {
    searchableIndexes = rawSearchableIndexes.map(index => (
      { value: index.value, label: intl.formatMessage({ id: `ui-finc-select.source.search.${index.label}` }) }
    ));
  }

  return (
    <SearchAndSortQuery
      initialFilterState={defaultFilter}
      initialSearchState={defaultSearch}
      initialSortState={defaultSort}
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
          getFilterHandlers,
          getSearchHandlers,
          onSort,
          onSubmitSearch,
          resetAll,
          searchValue,
        }) => {
          const doChangeIndex = (e) => {
            onChangeIndex(e.target.value);
            getSearchHandlers().query(e);
          };

          const filterChanged = !isEqual(activeFilters.state, defaultFilter);
          const searchChanged = searchValue.query && !isEqual(searchValue, defaultSearch);

          storeSearchString();

          return (
            <Paneset>
              {filterPaneIsVisible &&
                <Pane
                  defaultWidth="18%"
                  id="pane-source-filter"
                  renderHeader={() => renderFilterPaneHeader({ toggleFilterPane })}
                >
                  <form onSubmit={onSubmitSearch}>
                    {renderNavigation('source')}
                    <div>
                      <SearchField
                        ariaLabel="search"
                        autoFocus
                        id="sourceSearchField"
                        indexName="qindex"
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
                        // add values for search-selectbox
                        onChangeIndex={doChangeIndex}
                        searchableIndexes={searchableIndexes}
                        selectedIndex={searchValue.qindex}
                      />
                      <Button
                        buttonStyle="primary"
                        disabled={!searchChanged}
                        fullWidth
                        id="sourceSubmitSearch"
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
                    <SourceFilters
                      activeFilters={activeFilters.state}
                      filterHandlers={getFilterHandlers()}
                    />
                  </form>
                </Pane>
              }
              <Pane
                defaultWidth="fill"
                id="pane-source-results"
                padContent={false}
                renderHeader={() => renderResultsPaneHeader({
                  activeFilters,
                  disableRecordCreation,
                  filterPaneIsVisible,
                  paneTitleId: 'ui-finc-select.sources.title',
                  result: source,
                  toggleFilterPane,
                })}
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
                  isEmptyMessage={renderIsEmptyMessage(query, source, filterPaneIsVisible)}
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
  );
};

MetadataSources.propTypes = {
  children: PropTypes.object,
  contentData: PropTypes.arrayOf(PropTypes.object),
  disableRecordCreation: PropTypes.bool,
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

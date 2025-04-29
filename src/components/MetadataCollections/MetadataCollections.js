import PropTypes from 'prop-types';
import {
  get,
  isEqual,
} from 'lodash';
import { useState } from 'react';
import { withRouter } from 'react-router-dom';
import {
  injectIntl,
  FormattedMessage,
} from 'react-intl';

import { SearchAndSortQuery } from '@folio/stripes/smart-components';
import {
  Button,
  Icon,
  MultiColumnList,
  NoValue,
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
import CollectionFilters from './CollectionFilters';
import urls from '../DisplayUtils/urls';

const rawSearchableIndexes = [
  { label: 'all', value: '', makeQuery: term => `(label="${term}*" or description="${term}*" or collectionId="${term}*")` },
  { label: 'label', value: 'label', makeQuery: term => `(label="${term}*")` },
  { label: 'description', value: 'description', makeQuery: term => `(description="${term}*")` },
  { label: 'collectionId', value: 'collectionId', makeQuery: term => `(collectionId="${term}*")` },
];
let searchableIndexes;

const defaultFilter = { permitted: ['yes'], selected: ['yes'] };
const defaultSearch = { query: '', qindex: '' };
const defaultSort = { sort: 'label' };

const MetadataCollections = ({
  children,
  collection,
  contentData = {},
  // prevent rendering create button
  disableRecordCreation = true,
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

  const resultsFormatter = {
    label: result => result.label,
    mdSource: result => get(result, 'mdSource.name', <NoValue />),
    permitted: result => getDataLabel(get(result, 'permitted', '')),
    selected: result => getDataLabel(get(result, 'selected', '')),
    freeContent: result => getDataLabel(get(result, 'freeContent', '')),
  };

  // fade in/out of filter-pane
  const toggleFilterPane = () => {
    setFilterPaneIsVisible(curState => !curState);
  };

  const storeSearchString = () => {
    localStorage.setItem('finc-select-collections-search-string', searchString);
  };

  const rowURL = createRowURL(urls.collectionView, searchString);
  const rowFormatter = createRowFormatter(rowURL, onSelectRow);
  const count = collection ? collection.totalCount() : 0;
  const query = queryGetter() || {};
  const sortOrder = query.sort || '';

  if (!searchableIndexes) {
    searchableIndexes = rawSearchableIndexes.map(index => (
      { value: index.value, label: intl.formatMessage({ id: `ui-finc-select.collection.search.${index.label}` }) }
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
                  id="pane-collection-filter"
                  renderHeader={() => renderFilterPaneHeader({ toggleFilterPane })}
                >
                  <form onSubmit={onSubmitSearch}>
                    {renderNavigation('collection')}
                    <div>
                      <SearchField
                        ariaLabel="search"
                        autoFocus
                        id="collectionSearchField"
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
                        onChangeIndex={doChangeIndex}
                        searchableIndexes={searchableIndexes}
                        selectedIndex={searchValue.qindex}
                      />
                      <Button
                        buttonStyle="primary"
                        disabled={!searchChanged}
                        fullWidth
                        id="collectionSubmitSearch"
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
                    <CollectionFilters
                      activeFilters={activeFilters.state}
                      filterData={filterData}
                      filterHandlers={getFilterHandlers()}
                    />
                  </form>
                </Pane>
              }
              <Pane
                defaultWidth="fill"
                id="pane-collection-results"
                padContent={false}
                renderHeader={() => renderResultsPaneHeader({
                  activeFilters,
                  disableRecordCreation,
                  filterPaneIsVisible,
                  paneTitleId: 'ui-finc-select.collections.title',
                  result: collection,
                  toggleFilterPane,
                })}
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
                  isEmptyMessage={renderIsEmptyMessage(query, collection, filterPaneIsVisible)}
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
  );
};

MetadataCollections.propTypes = {
  children: PropTypes.object,
  collection: PropTypes.object,
  contentData: PropTypes.arrayOf(PropTypes.object),
  disableRecordCreation: PropTypes.bool,
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

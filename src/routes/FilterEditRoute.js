import PropTypes from 'prop-types';
import { get, omit } from 'lodash';
import { FormattedMessage } from 'react-intl';

import { stripesConnect } from '@folio/stripes/core';

import FilterForm from '../components/Filters/FilterForm';
import urls from '../components/DisplayUtils/urls';
import saveCollectionIds from './utilities/saveCollectionIds';

const FilterEditRoute = ({
  history,
  location,
  match,
  mutator,
  resources,
  stripes,
}) => {
  const hasPerms = stripes.hasPerm('finc-select.filters.item.put');
  const collectionIds = get(resources, 'collectionsIds.records', []);

  const getInitialValues = () => {
    const initialValues = get(resources, 'filters.records', []).find(i => i.id === match.params.id);

    return initialValues;
  };

  const handleClose = () => {
    history.push(`${urls.filterView(match.params.id)}${location.search}`);
  };

  const handleSubmit = (filter) => {
    const collectionIdsForSave = filter.collectionIds;
    // remove collectionIds for saving filter
    const filterForSave = omit(filter, ['collectionIds']);

    mutator.filters
      .PUT(filterForSave)
      .then(({ id }) => {
        if (collectionIdsForSave) {
          saveCollectionIds(id, collectionIdsForSave, stripes.okapi);
        }
        history.push(`${urls.filterView(id)}${location.search}`);
      });
  };

  const deleteFilter = (filter) => {
    mutator.filters.DELETE({ filter }).then(() => {
      history.push(`${urls.filters()}${location.search}`);
    });
  };

  const fetchIsPending = () => {
    return Object.values(resources)
      .filter(resource => resource)
      .some(resource => resource.isPending);
  };

  if (!hasPerms) return <div><FormattedMessage id="ui-finc-select.noPermission" /></div>;
  if (fetchIsPending()) return 'loading';

  return (
    <FilterForm
      collectionIds={collectionIds}
      contentData={resources}
      filterData={{ mdSources: get(resources, 'mdSources.records', []) }}
      handlers={{ onClose: handleClose }}
      initialValues={getInitialValues()}
      isLoading={fetchIsPending()}
      onDelete={deleteFilter}
      onSubmit={handleSubmit}
      stripes={stripes}
    />
  );
};

FilterEditRoute.manifest = Object.freeze({
  filters: {
    type: 'okapi',
    path: 'finc-select/filters/:{id}',
    shouldRefresh: () => false,
  },
  collectionsIds: {
    type: 'okapi',
    path: 'finc-select/filters/:{id}/collections',
  },
  mdSources: {
    type: 'okapi',
    records: 'tinyMetadataSources',
    path: 'finc-config/tiny-metadata-sources',
    resourceShouldRefresh: true
  },
});

FilterEditRoute.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  location: PropTypes.shape({
    search: PropTypes.string.isRequired,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  mutator: PropTypes.shape({
    filters: PropTypes.shape({
      PUT: PropTypes.func.isRequired,
      DELETE: PropTypes.func.isRequired,
    }).isRequired,
    collectionsIds: PropTypes.shape({
    }).isRequired,
  }).isRequired,
  resources: PropTypes.shape({
    filter: PropTypes.object,
    collectionsIds: PropTypes.object,
  }).isRequired,
  stripes: PropTypes.shape({
    hasPerm: PropTypes.func.isRequired,
    okapi: PropTypes.object.isRequired,
  }).isRequired,
};

export default stripesConnect(FilterEditRoute);

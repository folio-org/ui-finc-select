import PropTypes from 'prop-types';
import { omit } from 'lodash';
import { FormattedMessage } from 'react-intl';

import { stripesConnect } from '@folio/stripes/core';

import FilterForm from '../components/Filters/FilterForm';
import urls from '../components/DisplayUtils/urls';
import saveCollectionIds from './utilities/saveCollectionIds';

const FilterCreateRoute = ({
  history,
  location,
  mutator,
  resources,
  stripes,
}) => {
  const hasPerms = stripes.hasPerm('finc-select.filters.item.post');
  const collectionIds = [];

  const handleClose = () => {
    history.push(`${urls.filters()}${location.search}`);
  };

  const handleSubmit = (filter) => {
    const collectionIdsForSave = filter.collectionIds;
    const filterForSave = omit(filter, ['collectionIds']);

    // THIS IS WHERE THE FUCKING PROBLEM IS: filter object has no collectionIds
    mutator.filters
      .POST(filterForSave)
      .then(({ id }) => {
        saveCollectionIds(id, collectionIdsForSave, stripes.okapi);
        history.push(`${urls.filterView(id)}${location.search}`);
      });
  };

  if (!hasPerms) return <div><FormattedMessage id="ui-finc-select.noPermission" /></div>;

  return (
    <FilterForm
      contentData={resources}
      collectionIds={collectionIds}
      handlers={{ onClose: handleClose }}
      onSubmit={handleSubmit}
      stripes={stripes}
    />
  );
};

FilterCreateRoute.manifest = Object.freeze({
  filters: {
    type: 'okapi',
    path: 'finc-select/filters',
    fetch: false,
    shouldRefresh: () => false,
  },
  collectionsIds: {
    type: 'okapi',
    path: 'finc-select/filters/:{id}/collections',
  },
});

FilterCreateRoute.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  location: PropTypes.shape({
    search: PropTypes.string.isRequired,
  }).isRequired,
  mutator: PropTypes.shape({
    filters: PropTypes.shape({
      POST: PropTypes.func.isRequired,
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

export default stripesConnect(FilterCreateRoute);

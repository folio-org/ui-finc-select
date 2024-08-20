import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { get } from 'lodash';

import { stripesConnect } from '@folio/stripes/core';

import urls from '../components/DisplayUtils/urls';
import FilterView from '../components/Filters/FilterView';

const FilterViewRoute = ({
  history,
  location,
  match,
  resources,
  stripes,
}) => {
  const collectionIds = get(resources, 'collectionsIds.records', []);

  const handleClose = () => {
    history.push(`${urls.filters()}${location.search}`);
  };

  const handleEdit = () => {
    history.push(`${urls.filterEdit(match.params.id)}${location.search}`);
  };

  return (
    <FilterView
      canEdit={stripes.hasPerm('finc-select.filters.item.put')}
      collectionIds={collectionIds}
      handlers={{
        onClose: handleClose,
        onEdit: handleEdit,
      }}
      isLoading={get(resources, 'filter.isPending', true)}
      record={get(resources, 'filter.records', []).find(i => i.id === match.params.id)}
      stripes={stripes}
    />
  );
};

FilterViewRoute.manifest = Object.freeze({
  filter: {
    type: 'okapi',
    path: 'finc-select/filters/:{id}',
  },
  collectionsIds: {
    type: 'okapi',
    path: 'finc-select/filters/:{id}/collections',
  },
  query: {},
});

FilterViewRoute.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
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

export default stripesConnect(FilterViewRoute);

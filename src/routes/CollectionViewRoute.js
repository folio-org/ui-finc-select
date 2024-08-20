import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { get } from 'lodash';

import { stripesConnect } from '@folio/stripes/core';

import urls from '../components/DisplayUtils/urls';
import MetadataCollectionView from '../components/MetadataCollections/MetadataCollectionView';

const CollectionViewRoute = ({
  history,
  location,
  match,
  resources,
  stripes,
}) => {
  const handleClose = () => {
    history.push(`${urls.collections()}${location.search}`);
  };

  return (
    <MetadataCollectionView
      handlers={{ onClose: handleClose }}
      isLoading={get(resources, 'collection.isPending', true)}
      record={get(resources, 'collection.records', []).find(i => i.id === match.params.id)}
      stripes={stripes}
    />
  );
};

CollectionViewRoute.manifest = Object.freeze({
  collection: {
    type: 'okapi',
    path: 'finc-select/metadata-collections/:{id}',
  },
  query: {},
});

CollectionViewRoute.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  resources: PropTypes.shape({
    collection: PropTypes.object,
  }).isRequired,
  stripes: PropTypes.shape({
    hasPerm: PropTypes.func.isRequired,
    okapi: PropTypes.object.isRequired,
    connect: PropTypes.func.isRequired,
  }).isRequired,
};

export default stripesConnect(CollectionViewRoute);

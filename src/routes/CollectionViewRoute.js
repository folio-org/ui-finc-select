import PropTypes from 'prop-types';
import { useQuery } from 'react-query';
import ReactRouterPropTypes from 'react-router-prop-types';

import {
  useOkapiKy,
  useStripes,
} from '@folio/stripes/core';

import { COLLECTION_API } from '../util/constants';
import urls from '../components/DisplayUtils/urls';
import MetadataCollectionView from '../components/MetadataCollections/MetadataCollectionView';

const CollectionViewRoute = ({
  history,
  location,
  match: { params: { id: collectionId } },
}) => {
  const stripes = useStripes();

  const useCollection = () => {
    const ky = useOkapiKy();

    const { isLoading, data: collection = {} } = useQuery(
      [COLLECTION_API, collectionId],
      () => ky.get(`${COLLECTION_API}/${collectionId}`).json(),
      // The query will not execute until the id exists
      { enabled: Boolean(collectionId) }
    );

    return ({
      isLoading,
      collection,
    });
  };

  const { collection, isLoading: isCollectionLoading } = useCollection();

  const handleClose = () => {
    history.push(`${urls.collections()}${location.search}`);
  };

  return (
    <MetadataCollectionView
      handlers={{ onClose: handleClose }}
      isLoading={isCollectionLoading}
      record={collection}
      stripes={stripes}
    />
  );
};

CollectionViewRoute.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default CollectionViewRoute;

import PropTypes from 'prop-types';
import { useQuery } from 'react-query';
import ReactRouterPropTypes from 'react-router-prop-types';

import { useOkapiKyQuery } from '@folio/stripes-leipzig-components';
import {
  useOkapiKy,
  useStripes,
} from '@folio/stripes/core';

import {
  API_COLLECTIONS_BY_FILTER_ID,
  API_FILTERS,
  QK_COLLECTIONS,
  QK_FILTERS,
} from '../util/constants';
import urls from '../components/DisplayUtils/urls';
import FilterView from '../components/Filters/FilterView';

const FilterViewRoute = ({
  history,
  location,
  match: { params: { id: filterId } },
}) => {
  const stripes = useStripes();
  const hasPerms = stripes.hasPerm('ui-finc-select.edit');

  const { data: filter = {}, isLoading: isFilterLoading } = useOkapiKyQuery({
    queryKey: [QK_FILTERS, filterId],
    id: filterId,
    api: API_FILTERS,
    options: { enabled: Boolean(filterId) }
  });

  const useCollections = () => {
    const ky = useOkapiKy();

    const { isLoading, data = {}, error } = useQuery(
      [QK_COLLECTIONS, filterId],
      () => ky.get(API_COLLECTIONS_BY_FILTER_ID(filterId)).json(),
      // The query will not execute until the id exists
      { enabled: Boolean(filterId) }
    );

    if (error && error.response?.status === 404) {
      return { isLoading, collectionIds: [] };
    }

    const formattedData = data?.collectionIds ? [data] : [];

    return ({
      isLoading,
      collectionIds: formattedData,
    });
  };

  const { collectionIds, isLoading: isCollectionIdsLoading } = useCollections();

  const handleClose = () => {
    history.push(`${urls.filters()}${location.search}`);
  };

  const handleEdit = () => {
    history.push(`${urls.filterEdit(filterId)}${location.search}`);
  };

  return (
    <FilterView
      canEdit={hasPerms}
      collectionIds={isCollectionIdsLoading ? [] : collectionIds}
      handlers={{
        onClose: handleClose,
        onEdit: handleEdit,
      }}
      isLoading={isFilterLoading}
      record={filter}
      stripes={stripes}
    />
  );
};

FilterViewRoute.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default FilterViewRoute;

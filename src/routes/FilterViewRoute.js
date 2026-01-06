import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';

import { useOkapiKyQuery } from '@folio/stripes-leipzig-components';
import { useStripes } from '@folio/stripes/core';

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

  const { collectionIds, isLoading: isCollectionIdsLoading } = useOkapiKyQuery({
    queryKey: [QK_COLLECTIONS, filterId],
    api: API_COLLECTIONS_BY_FILTER_ID(filterId),
    options: { enabled: Boolean(filterId) }
  });

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

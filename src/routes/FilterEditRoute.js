import { omit } from 'lodash';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import ReactRouterPropTypes from 'react-router-prop-types';

import { useStripes } from '@folio/stripes/core';
import {
  useOkapiKyMutation,
  useOkapiKyQuery,
} from '@folio/stripes-leipzig-components';

import {
  API_COLLECTIONS_BY_FILTER_ID,
  API_FILTERS,
  API_TINY_SOURCES,
  QK_COLLECTIONS,
  QK_FILTERS,
  QK_TINY_SOURCES,
} from '../util/constants';
import urls from '../components/DisplayUtils/urls';
import FilterForm from '../components/Filters/FilterForm';
import saveCollectionIds from './utilities/saveCollectionIds';

const FilterEditRoute = ({
  history,
  location,
  match: { params: { id: filterId } },
}) => {
  const stripes = useStripes();
  const hasPerms = stripes.hasPerm('ui-finc-select.edit');

  const { data: filter = {}, isLoading: isFilterLoading } = useOkapiKyQuery({
    queryKey: [QK_FILTERS, filterId],
    api: API_FILTERS,
    id: filterId,
    options: { enabled: Boolean(filterId) }
  });

  const { data: collectionsRaw = {}, isError: isCollectionsError, isLoading: isCollectionsLoading } = useOkapiKyQuery({
    queryKey: [QK_COLLECTIONS, filterId],
    api: API_COLLECTIONS_BY_FILTER_ID(filterId),
    options: {
      enabled: Boolean(filterId),
    }
  });

  const { data: mdSources = { tinyMetadataSources: [] }, isLoading: isMdSourcesLoading } = useOkapiKyQuery({
    queryKey: [QK_TINY_SOURCES],
    api: API_TINY_SOURCES,
  });

  const isLoading = isFilterLoading || isCollectionsLoading || isMdSourcesLoading;

  const formattedCollections = !isCollectionsError && collectionsRaw?.collectionIds
    ? [collectionsRaw]
    : [];

  const getInitialValues = () => ({
    ...filter,
    collectionIds: collectionsRaw?.collectionIds || [],
  });

  const handleClose = () => {
    history.push(`${urls.filterView(filterId)}${location.search}`);
  };

  const { useUpdate, useDelete } = useOkapiKyMutation({
    mutationKey: [QK_FILTERS, filterId],
    id: filterId,
    api: API_FILTERS,
  });

  const { mutateAsync: putFilter } = useUpdate();
  const { mutateAsync: deleteFilter } = useDelete();

  const handleDelete = async () => {
    await deleteFilter();
    history.push(`${urls.filters()}${location.search}`);
  };

  const handleSubmit = async (formValues) => {
    const collectionIdsForSave = formValues.collectionIds;
    const filterForSave = omit(formValues, ['collectionIds']);

    await putFilter(filterForSave);

    if (collectionIdsForSave) {
      await saveCollectionIds(filterId, collectionIdsForSave, stripes.okapi);
    }

    history.push(`${urls.filterView(filterId)}${location.search}`);
  };

  if (!hasPerms) {
    return <div><FormattedMessage id="ui-finc-select.noPermission" /></div>;
  }

  return (
    <FilterForm
      initialValues={getInitialValues()}
      collectionIds={formattedCollections}
      filterData={{ mdSources: mdSources.tinyMetadataSources }}
      handlers={{ onClose: handleClose }}
      isLoading={isLoading}
      onDelete={handleDelete}
      onSubmit={handleSubmit}
      stripes={stripes}
    />
  );
};

FilterEditRoute.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default FilterEditRoute;

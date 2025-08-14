import { omit } from 'lodash';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { useMutation, useQuery } from 'react-query';
import ReactRouterPropTypes from 'react-router-prop-types';

import {
  useOkapiKy,
  useStripes,
} from '@folio/stripes/core';

import {
  COLLECTIONS_BY_FILTER_ID_API,
  FILTERS_API,
  TINY_SOURCES_API,
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
  const ky = useOkapiKy();
  const hasPerms = stripes.hasPerm('ui-finc-select.edit');

  const { data: filter = {}, isLoading: isFilterLoading } = useQuery(
    [FILTERS_API, filterId],
    () => ky.get(`${FILTERS_API}/${filterId}`).json(),
    { enabled: Boolean(filterId) }
  );

  const { data: collectionsRaw = {}, isLoading: isCollectionsLoading } = useQuery(
    ['collections', filterId],
    () => ky.get(COLLECTIONS_BY_FILTER_ID_API(filterId)).json().catch(() => ({ collectionIds: [] })),
    // The query will not execute until the id exists
    { enabled: Boolean(filterId) }
  );

  const { data: mdSources = { tinyMetadataSources: [] }, isLoading: isMdSourcesLoading } = useQuery(
    ['mdSources'],
    () => ky.get(TINY_SOURCES_API).json()
  );

  const isLoading = isFilterLoading || isCollectionsLoading || isMdSourcesLoading;

  const formattedCollections = collectionsRaw?.collectionIds
    ? [collectionsRaw]
    : [];

  const getInitialValues = () => ({
    ...filter,
    collectionIds: collectionsRaw?.collectionIds || [],
  });

  const handleClose = () => {
    history.push(`${urls.filterView(filterId)}${location.search}`);
  };

  const handleDelete = async () => {
    await ky.delete(`${FILTERS_API}/${filterId}`);
    history.push(`${urls.filters()}${location.search}`);
  };

  const { mutateAsync: updateFilter } = useMutation(
    ['updateFilter', filterId],
    (payload) => ky.put(`${FILTERS_API}/${filterId}`, { json: payload })
  );

  const handleSubmit = async (formValues) => {
    const collectionIdsForSave = formValues.collectionIds;
    const filterForSave = omit(formValues, ['collectionIds']);

    await updateFilter(filterForSave);

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

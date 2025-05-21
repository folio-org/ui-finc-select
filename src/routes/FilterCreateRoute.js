import { omit } from 'lodash';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { useMutation, useQuery } from 'react-query';

import {
  useOkapiKy,
  useStripes,
} from '@folio/stripes/core';

import {
  FILTERS_API,
  TINY_SOURCES_API,
} from '../util/constants';
import urls from '../components/DisplayUtils/urls';
import FilterForm from '../components/Filters/FilterForm';
import saveCollectionIds from './utilities/saveCollectionIds';

const FilterCreateRoute = ({ history, location }) => {
  const stripes = useStripes();
  const ky = useOkapiKy();

  const hasPerms = stripes.hasPerm('finc-select.filters.item.post');

  const { data: mdSources = { tinyMetadataSources: [] } } = useQuery(
    ['mdSources'],
    () => ky.get(TINY_SOURCES_API).json()
  );

  const { mutateAsync: createFilter } = useMutation(
    ['createFilter'],
    (payload) => ky.post(FILTERS_API, { json: payload }).json()
  );

  const handleClose = () => {
    history.push(`${urls.filters()}${location.search}`);
  };

  const handleSubmit = async (formValues) => {
    const collectionIdsForSave = formValues.collectionIds;
    const filterForSave = omit(formValues, ['collectionIds']);

    const { id } = await createFilter(filterForSave);

    if (collectionIdsForSave?.length) {
      await saveCollectionIds(id, collectionIdsForSave, stripes.okapi);
    }

    history.push(`${urls.filterView(id)}${location.search}`);
  };

  if (!hasPerms) {
    return <div><FormattedMessage id="ui-finc-select.noPermission" /></div>;
  }

  return (
    <FilterForm
      initialValues={{ collectionIds: [] }}
      collectionIds={[]}
      filterData={{ mdSources: mdSources.tinyMetadataSources }}
      handlers={{ onClose: handleClose }}
      onSubmit={handleSubmit}
      stripes={stripes}
    />
  );
};

FilterCreateRoute.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  location: PropTypes.shape({
    search: PropTypes.string.isRequired,
  }).isRequired,
};

export default FilterCreateRoute;

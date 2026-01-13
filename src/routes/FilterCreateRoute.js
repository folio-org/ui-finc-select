import { omit } from 'lodash';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { useStripes } from '@folio/stripes/core';
import {
  useOkapiKyMutation,
  useOkapiKyQuery,
} from '@folio/stripes-leipzig-components';

import {
  API_FILTERS,
  QK_FILTERS,
  API_TINY_SOURCES,
  QK_TINY_SOURCES,
} from '../util/constants';
import urls from '../components/DisplayUtils/urls';
import FilterForm from '../components/Filters/FilterForm';
import saveCollectionIds from './utilities/saveCollectionIds';

const FilterCreateRoute = ({ history, location }) => {
  const stripes = useStripes();
  const hasPerms = stripes.hasPerm('ui-finc-select.create');

  const { data: mdSources = { tinyMetadataSources: [] } } = useOkapiKyQuery({
    queryKey: [QK_TINY_SOURCES],
    api: API_TINY_SOURCES,
  });

  const { useCreate } = useOkapiKyMutation({
    mutationKey: [QK_FILTERS],
    api: API_FILTERS,
  });

  const { mutateAsync: createFilter } = useCreate();

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

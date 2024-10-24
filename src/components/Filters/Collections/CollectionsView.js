import PropTypes from 'prop-types';
import { get } from 'lodash';

import ViewCollections from './FindCollections/ViewCollections';

const CollectionsView = ({
  collectionIds,
  filter,
}) => {
  const filterId = get(filter, 'id', '-');

  return (
    <ViewCollections
      collectionIds={collectionIds}
      filterId={filterId}
      isEditable={false}
      name="collectionIds"
    />
  );
};

CollectionsView.propTypes = {
  collectionIds: PropTypes.arrayOf(PropTypes.object),
  filter: PropTypes.object,
};

export default CollectionsView;

import { get } from 'lodash';
import PropTypes from 'prop-types';

import FindCollections from './FindCollections/FindCollections';

const CollectionsView = ({
  collectionIds,
  filter,
}) => {
  const filterId = get(filter, 'id', '-');

  return (
    <FindCollections
      collectionIds={collectionIds}
      filterId={filterId}
      isEditable={false}
    />
  );
};

CollectionsView.propTypes = {
  collectionIds: PropTypes.arrayOf(PropTypes.object),
  filter: PropTypes.object,
};

export default CollectionsView;

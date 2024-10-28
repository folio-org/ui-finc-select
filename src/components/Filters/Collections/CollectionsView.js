import PropTypes from 'prop-types';
import { get } from 'lodash';

import Collections from './FindCollections/Collections';

const CollectionsView = ({
  collectionIds,
  filter,
}) => {
  const filterId = get(filter, 'id', '-');

  return (
    <Collections
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

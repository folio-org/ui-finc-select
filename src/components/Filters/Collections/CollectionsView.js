import PropTypes from 'prop-types';
import { get } from 'lodash';

import ViewCollections from './FindCollections/ViewCollections';

const CollectionsView = ({
  collectionIds,
  filter,
  ...props
}) => {
  const filterId = get(filter, 'id', '-');

  return (
    <>
      <div>
        <ViewCollections
          collectionIds={collectionIds}
          filterId={filterId}
          isEditable={false}
          name="collectionIds"
          {...props}
        />
      </div>
    </>
  );
};

CollectionsView.propTypes = {
  collectionIds: PropTypes.arrayOf(PropTypes.object),
  filter: PropTypes.object,
};

export default CollectionsView;

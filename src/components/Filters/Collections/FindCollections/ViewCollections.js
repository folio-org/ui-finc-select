import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Pluggable } from '@folio/stripes/core';

const ViewCollections = ({
  collectionIds,
  filterId,
  isEditable,
}) => {
  return (
    <Pluggable
      aria-haspopup="true"
      collectionIds={collectionIds}
      dataKey="collection"
      // plugin needs filterId for assigned filter
      filterId={filterId}
      id="clickable-find-collection"
      isEditable={isEditable}
      searchButtonStyle="default"
      searchLabel={<FormattedMessage id="ui-finc-select.plugin.buttonLabel.collection.view" />}
      type="find-finc-metadata-collection"
    >
      <div style={{ background: 'red' }}><FormattedMessage id="ui-finc-select.plugin.notFound" /></div>
    </Pluggable>
  );
};

ViewCollections.propTypes = {
  collectionIds: PropTypes.arrayOf(PropTypes.object),
  filterId: PropTypes.string,
  isEditable: PropTypes.bool,
};

export default ViewCollections;

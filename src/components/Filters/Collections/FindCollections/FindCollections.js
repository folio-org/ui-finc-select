import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Pluggable } from '@folio/stripes/core';

const FindCollections = ({
  collectionIds,
  filterId,
  isEditable,
  selectRecords,
}) => {
  const searchLabel = isEditable ? <FormattedMessage id="ui-finc-select.plugin.buttonLabel.collection.add" /> : <FormattedMessage id="ui-finc-select.plugin.buttonLabel.collection.view" />;

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
      searchLabel={searchLabel}
      selectRecords={selectRecords}
      type="find-finc-metadata-collection"
    >
      <div style={{ background: 'red' }}><FormattedMessage id="ui-finc-select.plugin.notFound" /></div>
    </Pluggable>
  );
};

FindCollections.propTypes = {
  collectionIds: PropTypes.arrayOf(PropTypes.object),
  filterId: PropTypes.string,
  isEditable: PropTypes.bool,
  selectRecords: PropTypes.func,
};

export default FindCollections;

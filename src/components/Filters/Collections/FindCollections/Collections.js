import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Pluggable } from '@folio/stripes/core';

const Collections = ({
  collectionIds,
  filterId,
  form,
  isEditable,
}) => {
  const getSelectedCollections = (records) => {
    form?.mutators?.setCollection({}, records);
  };

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
      selectRecordsModal={isEditable ? getSelectedCollections : undefined}
      type="find-finc-metadata-collection"
    >
      <div style={{ background: 'red' }}><FormattedMessage id="ui-finc-select.plugin.notFound" /></div>
    </Pluggable>
  );
};

Collections.propTypes = {
  collectionIds: PropTypes.arrayOf(PropTypes.object),
  filterId: PropTypes.string,
  form: PropTypes.shape({
    mutators: PropTypes.shape({
      setCollection: PropTypes.func,
    }),
  }),
  isEditable: PropTypes.bool,
};

export default Collections;

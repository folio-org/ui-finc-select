import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Pluggable } from '@folio/stripes/core';

const FindCollections = ({
  collectionIds,
  filterId,
  form,
  isEditable,
}) => {
  const getSelectedCollections = (records) => {
    form.mutators.setCollection({}, records);
  };

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
      searchLabel={<FormattedMessage id="ui-finc-select.plugin.buttonLabel.collection.add" />}
      selectRecordsModal={getSelectedCollections}
      type="find-finc-metadata-collection"
    >
      <div style={{ background: 'red' }}><FormattedMessage id="ui-finc-select.plugin.notFound" /></div>
    </Pluggable>
  );
};

FindCollections.propTypes = {
  collectionIds: PropTypes.arrayOf(PropTypes.object),
  filterId: PropTypes.string,
  form: PropTypes.shape({
    mutators: PropTypes.shape({
      setCollection: PropTypes.func,
    }).isRequired,
  }),
  isEditable: PropTypes.bool,
};

export default FindCollections;

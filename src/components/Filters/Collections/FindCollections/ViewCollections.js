import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { useState } from 'react';

import { Col, Row } from '@folio/stripes/components';
import { Pluggable } from '@folio/stripes/core';

const ViewCollections = ({
  initCollectionIds,
  filterId,
  form,
  intialCollection,
  isEditable,
  ...props
}) => {
  const [collectionIds, setCollectionIds] = useState(() => { // eslint-disable-line no-unused-vars
    const c = intialCollection || {};
    return { c };
  });

  const selectCollection = (c) => {
    form.mutators.setCollection([c]);

    setCollectionIds({ c });
  };

  const disableRecordCreation = true;
  const buttonProps = { 'marginBottom0': true };
  const pluggable =
    <Pluggable
      aria-haspopup="true"
      buttonProps={buttonProps}
      collectionIds={initCollectionIds}
      dataKey="collection"
      disableRecordCreation={disableRecordCreation}
      filterId={filterId}
      id="clickable-find-collection"
      isEditable={isEditable}
      marginTop0
      onCloseModal={(modalProps) => {
        modalProps.parentMutator.query.update({
          query: '',
          filters: '',
          sort: 'name',
        });
      }}
      searchButtonStyle="default"
      searchLabel={<FormattedMessage id="ui-finc-select.plugin.buttonLabel.collection.view" />}
      selectCollection={selectCollection}
      type="find-finc-metadata-collection"
      visibleColumns={['label']}
      {...props}
    >
      <div style={{ background: 'red' }}><FormattedMessage id="ui-finc-select.plugin.notFound" /></div>
    </Pluggable>;

  return (
    <>
      <Row>
        <Col xs={6}>
          { pluggable }
        </Col>
      </Row>
    </>
  );
};

ViewCollections.propTypes = {
  collectionIds: PropTypes.arrayOf(PropTypes.object),
  filterId: PropTypes.string,
  form: PropTypes.shape({
    mutators: PropTypes.shape({
      setCollection: PropTypes.func,
    }),
  }),
  intialCollection: PropTypes.object,
  initCollectionIds: PropTypes.arrayOf(PropTypes.object),
  isEditable: PropTypes.bool,
};

export default ViewCollections;

import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Col, Row } from '@folio/stripes/components';
import { Pluggable } from '@folio/stripes/core';

const FindCollections = ({
  collectionIds,
  filterId,
  form,
  isEditable,
  ...props
}) => {
  const getSelectedCollections = (records) => {
    form.mutators.setCollection({}, records);
  };

  const disableRecordCreation = true;
  const buttonProps = { 'marginBottom0': true };

  const pluggable =
    <Pluggable
      aria-haspopup="true"
      buttonProps={buttonProps}
      collectionIds={collectionIds}
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
      searchLabel={<FormattedMessage id="ui-finc-select.plugin.buttonLabel.collection.add" />}
      selectRecordsModal={getSelectedCollections}
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

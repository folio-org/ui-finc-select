import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Col,
  Row,
} from '@folio/stripes/components';
import { Pluggable } from '@folio/stripes/core';

class FindCollections extends React.Component {
  getSelectedCollections = (records) => {
    this.props.form.mutators.setCollection({}, records);
  }

  render() {
    const disableRecordCreation = true;
    const buttonProps = { 'marginBottom0': true };

    const pluggable =
      <Pluggable
        aria-haspopup="true"
        buttonProps={buttonProps}
        collectionIds={this.props.collectionIds}
        columnMapping={this.columnMapping}
        dataKey="collection"
        disableRecordCreation={disableRecordCreation}
        filterId={this.props.filterId}
        id="clickable-find-collection"
        isEditable={this.props.isEditable}
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
        selectCollection={this.selectCollection}
        selectRecordsModal={this.getSelectedCollections}
        type="find-finc-metadata-collection"
        visibleColumns={['label']}
        {...this.props}
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
  }
}

FindCollections.propTypes = {
  collectionIds: PropTypes.arrayOf(PropTypes.object),
  filterId: PropTypes.string,
  form: PropTypes.shape({
    mutators: PropTypes.shape({
      setCollection: PropTypes.func,
    }).isRequired,
  }),
  getSelectedCollections: PropTypes.func,
  isEditable: PropTypes.bool,
};

export default FindCollections;

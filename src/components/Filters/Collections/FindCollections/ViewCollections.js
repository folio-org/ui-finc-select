import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Col,
  Row,
} from '@folio/stripes/components';
import { Pluggable } from '@folio/stripes/core';

class ViewCollections extends React.Component {
  constructor(props) {
    super(props);

    const c = props.intialCollection || {};

    this.inputCollections = c;
  }

  selectCollection = (c) => {
    this.props.form.mutators.setCollection([c]);

    this.setState(() => {
      return { collectionIds: { c } };
    });
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
        searchLabel={<FormattedMessage id="ui-finc-select.plugin.buttonLabel.collection.view" />}
        selectCollection={this.selectCollection}
        type="find-finc-metadata-collection"
        visibleColumns={['label']}
        {...this.props}
      >
        <div style={{ background: 'red' }}><FormattedMessage id="ui-finc-select.plugin.notFound" /></div>
      </Pluggable>;

    return (
      <React.Fragment>
        <Row>
          <Col xs={6}>
            { pluggable }
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}

ViewCollections.propTypes = {
  collectionIds: PropTypes.arrayOf(PropTypes.object),
  filterId: PropTypes.string,
  form: PropTypes.shape({
    mutators: PropTypes.shape({
      setCollection: PropTypes.func,
    }),
  }),
  intialCollection: PropTypes.object,
  isEditable: PropTypes.bool,
};

export default ViewCollections;

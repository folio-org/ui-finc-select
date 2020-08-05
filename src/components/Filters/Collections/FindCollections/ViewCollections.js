import React from 'react';
import PropTypes from 'prop-types';

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
    this.props.form.mutators.setCollection([
      c
    ]);

    this.setState(() => {
      return { collectionIds: {
        c
      } };
    });
  }

  render() {
    const disableRecordCreation = true;
    const buttonProps = { 'marginBottom0': true };
    const pluggable =
      <Pluggable
        aria-haspopup="true"
        buttonProps={buttonProps}
        columnMapping={this.columnMapping}
        dataKey="collection"
        disableRecordCreation={disableRecordCreation}
        id="clickable-find-collection"
        marginTop0
        onCloseModal={(modalProps) => {
          modalProps.parentMutator.query.update({
            query: '',
            filters: '',
            sort: 'name',
          });
        }}
        searchButtonStyle="default"
        searchLabel="View metadata collection"
        selectCollection={this.selectCollection}
        type="find-finc-metadata-collection"
        visibleColumns={['label']}
        filterId={this.props.filterId}
        collectionIds={this.props.collectionIds}
        isEditable={this.props.isEditable}
        {...this.props}
      >
        <div style={{ background: 'red' }}>Plugin not found</div>
      </Pluggable>;

    return (
      <React.Fragment>
        <Row>
          <Col xs={6}>
            { pluggable }
          </Col>
          {/* Field has to be removed for Show Collections */}
          {/* <Field
            ariaLabel="Add metadata collection"
            component={TextField}
            fullWidth
            id="addfilter_collection"
            name="collectionIds"
            placeholder="Please add a metadata collection"
            readOnly
          /> */}
        </Row>
      </React.Fragment>
    );
  }
}

ViewCollections.propTypes = {
  filterId: PropTypes.string,
  collectionIds: PropTypes.arrayOf(PropTypes.object),
  isEditable: PropTypes.bool,
  intialCollectionId: PropTypes.string,
  intialCollection: PropTypes.object,
  stripes: PropTypes.object,
  form: PropTypes.shape({
    mutators: PropTypes.shape({
      setCollection: PropTypes.func,
    }),
  }),
};

export default ViewCollections;

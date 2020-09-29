import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  Col,
  Modal,
  Row,
} from '@folio/stripes/components';

class SelectAllCollections extends React.Component {
  static manifest = Object.freeze({
    selectAll: {
      type: 'okapi',
      fetch: false,
      accumulate: 'true',
      PUT: {
        path: 'finc-select/metadata-sources/!{sourceId}/collections/select-all'
      }
    }
  });

  static propTypes = {
    mutator: PropTypes.shape({
      selectAll: PropTypes.object,
    }),
    sourceId: PropTypes.string.isRequired,
    stripes: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.okapiUrl = props.stripes.okapi.url;
    this.httpHeaders = Object.assign({}, {
      'X-Okapi-Tenant': props.stripes.okapi.tenant,
      'X-Okapi-Token': props.stripes.store.getState().okapi.token,
      'Content-Type': 'application/json'
    });

    this.state = {
      showInfoModal: false,
      modalText: ''
    };
  }

  selectAllCollections = (sourceId) => {
    const selectTrue = { select: true };
    const selectJson = JSON.stringify(selectTrue);

    fetch(`${this.okapiUrl}/finc-select/metadata-sources/${sourceId}/collections/select-all`,
      {
        headers: this.httpHeaders,
        method: 'PUT',
        body: selectJson
      })
      .then((response) => {
        if (response.status >= 400) {
          // show error
          this.setState(
            {
              showInfoModal: true,
              modalText: <FormattedMessage id="ui-finc-select.source.modal.selectAllCollections.error" />
            }
          );
        } else {
          // show success
          this.setState(
            {
              showInfoModal: true,
              modalText: <FormattedMessage id="ui-finc-select.source.modal.selectAllCollections.success" />
            }
          );
        }
      });
  }

  handleClose = () => {
    this.setState({ showInfoModal: false });
  }

  render() {
    const { sourceId } = this.props;

    return (
      <div>
        <Row>
          <Col xs={6}>
            <Button
              buttonStyle="primary"
              id="selectAllCollections"
              onClick={() => this.selectAllCollections(sourceId)}
            >
              <FormattedMessage id="ui-finc-select.source.button.selectAllCollections" />
            </Button>
          </Col>
        </Row>
        <Modal
          label="Select All Collections"
          open={this.state.showInfoModal}
        >
          <div>
            { this.state.modalText }
          </div>
          <Button onClick={this.handleClose}>
            OK
          </Button>
        </Modal>
      </div>
    );
  }
}

export default SelectAllCollections;

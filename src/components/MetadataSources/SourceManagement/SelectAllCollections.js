import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  Col,
  Modal,
  Row,
} from '@folio/stripes/components';

import fetchWithDefaultOptions from '../../DisplayUtils/fetchWithDefaultOptions';

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
    sourceId: PropTypes.string.isRequired,
    stripes: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.state = {
      showInfoModal: false,
      modalText: ''
    };
  }

  selectAllCollections = (sourceId) => {
    const selectTrue = { select: true };
    const selectJson = JSON.stringify(selectTrue);

    fetchWithDefaultOptions(this.props.stripes.okapi, `/finc-select/metadata-sources/${sourceId}/collections/select-all`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
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
    const { sourceId, stripes } = this.props;
    const hasSelectAllCollectionsPerms = stripes.hasPerm('finc-select.metadata-sources.item.select-all');

    return (
      <div>
        <Row>
          <Col xs={6}>
            <Button
              buttonStyle="primary"
              disabled={!hasSelectAllCollectionsPerms}
              id="selectAllCollections"
              onClick={() => this.selectAllCollections(sourceId)}
            >
              <FormattedMessage id="ui-finc-select.source.button.selectAllCollections" />
            </Button>
          </Col>
        </Row>
        <Modal
          label={<FormattedMessage id="ui-finc-select.source.button.selectAllCollections" />}
          open={this.state.showInfoModal}
        >
          <div>
            { this.state.modalText }
          </div>
          <Button onClick={this.handleClose}>
            <FormattedMessage id="ui-finc-select.button.ok" />
          </Button>
        </Modal>
      </div>
    );
  }
}

export default SelectAllCollections;

import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Col,
  Button,
  KeyValue,
  Modal,
} from '@folio/stripes/components';

class SelectUnselect extends React.Component {
  static propTypes = {
    collectionId: PropTypes.string,
    permitted: PropTypes.string,
    selectedInitial: PropTypes.string,
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
      modalText: '',
      selected: props.selectedInitial,
      selectedLabel: this.getSelectedButtonLable(props.selectedInitial)
    };
  }

  // get initial-selected-value as a property
  // but need the selected-value also as a state for futher working and changing its value
  componentDidMount() {
    const { selectedInitial } = this.props;

    this.setState(
      {
        selected: selectedInitial
      }
    );
  }

  // if clicking on another collection, check, if selectedInitial will be up to date
  componentDidUpdate(prevProps) {
    if (this.props.collectionId !== prevProps.collectionId) {
      this.fetchSelected(this.props.selectedInitial);
      this.isUsagePermitted(this.props.permitted);
    }
  }

  fetchSelected = (selected) => {
    const selectedButtonLable = this.getSelectedButtonLable(selected);

    // change state for selected-values, if neccessary
    this.setState(
      {
        // shortcut for selected: selected,
        selected,
        selectedLabel: selectedButtonLable
      }
    );
  }

  isUsagePermitted(permitted) {
    if (permitted === 'no') {
      return true;
    } else {
      return false;
    }
  }

  // get button label from the saved yes or no value
  getSelectedButtonLable(selected) {
    if (selected === 'no') {
      return 'Select';
    } else {
      return 'Unselect';
    }
  }

  // translate yes or no value into inverse boolean for json
  inversJsonBoolean(selected) {
    if (selected === 'no') {
      return { select: true };
    } else {
      return { select: false };
    }
  }

  selectUnselect = (collectionId, selected) => {
    const selectedJson = JSON.stringify(this.inversJsonBoolean(selected));

    let inverseSelected = '';

    if (selected === 'no') { inverseSelected = 'yes'; } else { inverseSelected = 'no'; }
    const invertSelectedButtonLable = this.getSelectedButtonLable(inverseSelected);

    fetch(`${this.okapiUrl}/finc-select/metadata-collections/${collectionId}/select`,
      {
        headers: this.httpHeaders,
        method: 'PUT',
        body: selectedJson
      })
      .then((response) => {
        if (response.status >= 400) {
          // show 400 error
          this.setState(
            {
              showInfoModal: true,
              modalText: 'Error 4xx: Selecting this metadata collection is not permitted'
            }
          );
        } else if (response.status < 400 && response.status >= 300) {
          // show 300 error
          this.setState(
            {
              showInfoModal: true,
              modalText: 'Error 3xx'
            }
          );
        } else if (response.status < 300 && response.status >= 200) {
          // show success
          this.setState(
            {
              selected: inverseSelected,
              selectedLabel: invertSelectedButtonLable
            }
          );
        }
      });
  }

  handleClose = () => {
    this.setState({ showInfoModal: false });
  }

  render() {
    const { collectionId, permitted } = this.props;

    return (
      <React.Fragment>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-finc-select.collection.selected" />}
            value={_.upperFirst(this.state.selected)}
          />
        </Col>
        <Col xs={3}>
          <Button
            buttonStyle="primary"
            disabled={this.isUsagePermitted(permitted)}
            id="unselect"
            onClick={() => this.selectUnselect(collectionId, this.state.selected)}
          >
            {this.state.selectedLabel}
          </Button>
        </Col>
        <Modal
          label="Select/Unselect Collection"
          open={this.state.showInfoModal}
        >
          <div>
            { this.state.modalText }
          </div>
          <Button onClick={this.handleClose}>
            OK
          </Button>
        </Modal>
      </React.Fragment>
    );
  }
}
export default SelectUnselect;

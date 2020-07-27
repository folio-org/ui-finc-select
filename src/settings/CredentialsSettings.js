import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';

import CredentialsSettingsForm from './CredentialsSettingsForm';

class CredentialsSettings extends React.Component {
  static propTypes = {
    resources: PropTypes.object,
    mutator: PropTypes.shape({
      ezbCredentials: PropTypes.shape({
        POST: PropTypes.func.isRequired,
      }).isRequired,
    }).isRequired,
  };

  static manifest = Object.freeze({
    ezbCredentials: {
      type: 'okapi',
      path: 'finc-select/ezb-credentials',
      throwErrors: false,
    },
  });

  constructor(props) {
    super(props);

    this.styles = {
      credentialsFormWrapper: {
        width: '100%',
      },
    };
  }

  getInitialValues = () => {
    const initialValues = _.get(this.props.resources, 'ezbCredentials.records[0]');

    return initialValues;
  }

  handleSubmit = (values) => {
    const { mutator } = this.props;

    mutator.ezbCredentials
      .PUT(values);
  }

  render() {
    return (
      <div
        data-test-settings-ezb-credentials
        style={this.styles.credentialsFormWrapper}
      >
        <CredentialsSettingsForm
          initialValues={this.getInitialValues()}
          onSubmit={this.handleSubmit}
        />
      </div>
    );
  }
}

export default CredentialsSettings;

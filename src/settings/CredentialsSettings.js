import PropTypes from 'prop-types';
import { get } from 'lodash';

import CredentialsSettingsForm from './CredentialsSettingsForm';

const CredentialsSettings = ({
  resources,
  mutator,
}) => {
  const styles = {
    credentialsFormWrapper: {
      width: '100%',
    },
  };

  const getInitialValues = () => {
    const initialValues = get(resources, 'ezbCredentials.records[0]');

    return initialValues;
  };

  const handleSubmit = (values) => {
    mutator.ezbCredentials
      .PUT(values);
  };

  return (
    <div
      data-test-settings-ezb-credentials
      style={styles.credentialsFormWrapper}
    >
      <CredentialsSettingsForm
        initialValues={getInitialValues()}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

CredentialsSettings.propTypes = {
  resources: PropTypes.object,
  mutator: PropTypes.shape({
    ezbCredentials: PropTypes.shape({
      POST: PropTypes.func.isRequired,
      PUT: PropTypes.func.isRequired,
    }).isRequired,
  }).isRequired,
};

CredentialsSettings.manifest = Object.freeze({
  ezbCredentials: {
    type: 'okapi',
    path: 'finc-select/ezb-credentials',
    throwErrors: false,
  },
});

export default CredentialsSettings;

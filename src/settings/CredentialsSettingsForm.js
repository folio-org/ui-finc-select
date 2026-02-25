import { get } from 'lodash';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Field } from 'redux-form';

import {
  Button,
  Col,
  KeyValue,
  NoValue,
  Pane,
  PaneFooter,
  PaneHeader,
  Paneset,
  Row,
  TextField,
} from '@folio/stripes/components';
import stripesForm from '@folio/stripes/form';

import BasicStyle from '../components/BasicStyle.css';
import Required from '../components/DisplayUtils/Validate';

const CredentialsSettingsForm = ({
  handleSubmit,
  initialValues,
  invalid,
  pristine,
  submitting,
}) => {
  const [passwordMasked, setPasswordMasked] = useState(true);

  const styles = {
    toggleMaskButtonWrapper: {
      marginTop: '20px',
      marginLeft: '1rem',
    },
  };

  const getPaneFooter = () => {
    const disabled = pristine || submitting || invalid;

    const endButton = (
      <Button
        buttonStyle="primary"
        data-test-ezbcredentials-form-submit-button
        disabled={disabled}
        id="clickable-save-ezbcredentials"
        marginBottom0
        onClick={handleSubmit}
        type="submit"
      >
        <FormattedMessage id="ui-finc-select.settings.ezbCredentials.save" />
      </Button>
    );

    return <PaneFooter renderEnd={endButton} />;
  };

  const togglePasswordMask = () => {
    setPasswordMasked(currState => !currState);
  };

  const renderPaneHeader = () => {
    return (
      <PaneHeader
        paneTitle={<FormattedMessage id="ui-finc-select.settings.ezbCredentials.label" />}
      />
    );
  };

  const passwordType = passwordMasked ? 'password' : 'text';
  const footer = getPaneFooter();
  const passwordToggleLabelId = `ui-finc-select.settings.changePassword.${passwordMasked ? 'show' : 'hide'}Password`;

  return (
    <form
      className={BasicStyle.styleForFormRoot}
      data-test-ezb-credentials-form-page
      id="ezb-credentials"
    >
      <Paneset isRoot>
        <Pane
          defaultWidth="100%"
          footer={footer}
          renderHeader={renderPaneHeader}
        >
          <Row>
            <Col xs={6}>
              <Field
                component={TextField}
                fullWidth
                id="add_ezbcredentials_user"
                label={<FormattedMessage id="ui-finc-select.settings.ezbCredentials.user" />}
                name="user"
                required
                validate={Required}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={6}>
              <Field
                component={TextField}
                fullWidth
                id="add_ezbcredentials_password"
                label={<FormattedMessage id="ui-finc-select.settings.ezbCredentials.password" />}
                name="password"
                required
                type={passwordType}
                validate={Required}
              />
            </Col>
            <Col>
              <div style={styles.toggleMaskButtonWrapper}>
                <Button
                  buttonStyle="link"
                  onClick={togglePasswordMask}
                  type="button"
                >
                  <FormattedMessage id={passwordToggleLabelId} />
                </Button>
              </div>
            </Col>
          </Row>
          <Row>
            <Col xs={6}>
              <Field
                component={TextField}
                fullWidth
                id="add_ezbcredentials_libId"
                label={<FormattedMessage id="ui-finc-select.settings.ezbCredentials.libId" />}
                name="libId"
                required
                validate={Required}
              />
            </Col>
          </Row>
          <Row style={{ marginLeft: '0.1em' }}>
            <KeyValue
              label={<FormattedMessage id="ui-finc-select.settings.ezbCredentials.isil" />}
              value={get(initialValues, 'isil', <NoValue />)}
            />
          </Row>
        </Pane>
      </Paneset>
    </form>
  );
};

CredentialsSettingsForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.object,
  invalid: PropTypes.bool,
  pristine: PropTypes.bool,
  submitting: PropTypes.bool,
};

export default stripesForm({
  form: 'ezbCredentialsForm',
  // set navigationCheck true for confirming changes
  navigationCheck: true,
  // the form will reinitialize every time the initialValues prop changes
  enableReinitialize: true,
})(CredentialsSettingsForm);

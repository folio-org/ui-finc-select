import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Field } from 'redux-form';

import {
  Button,
  Col,
  KeyValue,
  Pane,
  PaneFooter,
  Paneset,
  Row,
  TextField,
} from '@folio/stripes/components';
import stripesForm from '@folio/stripes/form';

import { Required } from '../components/DisplayUtils/Validate';
import BasicStyle from '../components/BasicStyle.css';

class CredentialsSettingsForm extends React.Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    initialValues: PropTypes.object,
    invalid: PropTypes.bool,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
  };

  constructor(props) {
    super(props);

    this.state = {
      passwordMasked: true,
    };

    this.styles = {
      toggleMaskButtonWrapper: {
        marginTop: '20px',
        marginLeft: '1rem',
      },
    };
  }

  getPaneFooter() {
    const {
      handleSubmit,
      invalid,
      pristine,
      submitting
    } = this.props;

    const disabled = pristine || submitting || invalid;

    const endButton = (
      <Button
        data-test-ezbcredentials-form-submit-button
        marginBottom0
        id="clickable-save-ezbcredentials"
        buttonStyle="primary"
        type="submit"
        onClick={handleSubmit}
        disabled={disabled}
      >
        <FormattedMessage id="ui-finc-select.settings.ezbCredentials.save" />
      </Button>
    );

    return <PaneFooter renderEnd={endButton} />;
  }

  togglePasswordMask = () => {
    this.setState(({ passwordMasked }) => ({
      passwordMasked: !passwordMasked,
    }));
  };

  render() {
    const { passwordMasked } = this.state;
    const passwordType = passwordMasked ? 'password' : 'text';
    const { initialValues } = this.props;
    const footer = this.getPaneFooter();
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
            paneTitle="EZB credentials"
          >
            <Row>
              <Col xs={6}>
                <Field
                  component={TextField}
                  fullWidth
                  id="add_ezbcredentials_user"
                  label={
                    <FormattedMessage id="ui-finc-select.settings.ezbCredentials.user">
                      {(msg) => msg + ' *'}
                    </FormattedMessage>}
                  name="user"
                  placeholder="Enter a user"
                  validate={Required}
                />
              </Col>
            </Row>
            <Row>
              <Col xs={6}>
                <Field
                  component={TextField}
                  type={passwordType}
                  fullWidth
                  id="add_ezbcredentials_password"
                  label={
                    <FormattedMessage id="ui-finc-select.settings.ezbCredentials.password">
                      {(msg) => msg + ' *'}
                    </FormattedMessage>}
                  name="password"
                  placeholder="Enter a password"
                  validate={Required}
                />
              </Col>
              <Col>
                <div style={this.styles.toggleMaskButtonWrapper}>
                  <Button
                    type="button"
                    buttonStyle="link"
                    onClick={this.togglePasswordMask}
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
                  label={
                    <FormattedMessage id="ui-finc-select.settings.ezbCredentials.libId">
                      {(msg) => msg + ' *'}
                    </FormattedMessage>}
                  name="libId"
                  placeholder="Enter a libId"
                  validate={Required}
                />
              </Col>
            </Row>
            <Row style={{ marginLeft: '0.1em' }}>
              <KeyValue
                label={<FormattedMessage id="ui-finc-select.settings.ezbCredentials.isil" />}
                value={_.get(initialValues, 'isil', '-')}
              />
            </Row>
          </Pane>
        </Paneset>
      </form>
    );
  }
}

export default stripesForm({
  form: 'ezbCredentialsForm',
  // set navigationCheck true for confirming changes
  navigationCheck: true,
  // the form will reinitialize every time the initialValues prop changes
  enableReinitialize: true,
})(CredentialsSettingsForm);

import React from 'react';
import { FormattedMessage } from 'react-intl';

import { Settings } from '@folio/stripes/smart-components';

import CredentialsSettings from './CredentialsSettings';

class FincConfigSettings extends React.Component {
  pages = [
    {
      component: CredentialsSettings,
      label: <FormattedMessage id="ui-finc-select.settings.ezbCredentials.label" />,
      route: 'ezb-credentials',
    }
  ];

  render() {
    return (
      <Settings
        data-test-settings-finc-select
        pages={this.pages}
        paneTitle={<FormattedMessage id="ui-finc-select.meta.title" />}
        {...this.props}
      />
    );
  }
}

export default FincConfigSettings;

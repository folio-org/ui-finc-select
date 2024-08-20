import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Settings } from '@folio/stripes/smart-components';

import CredentialsSettings from './CredentialsSettings';

const FincConfigSettings = ({ match, ...props }) => {
  const pages = [
    {
      component: CredentialsSettings,
      label: <FormattedMessage id="ui-finc-select.settings.ezbCredentials.label" />,
      route: 'ezb-credentials',
    }
  ];

  return (
    <Settings
      data-test-settings-finc-select
      pages={pages}
      paneTitle={<FormattedMessage id="ui-finc-select.meta.title" />}
      match={match}
      {...props}
    />
  );
};

FincConfigSettings.propTypes = {
  match: PropTypes.object.isRequired,
};

export default FincConfigSettings;

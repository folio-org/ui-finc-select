import { FormattedMessage } from 'react-intl';

import { Loading, MessageBanner } from '@folio/stripes/components';
import {
  useOkapiKyMutation,
  useOkapiKyQuery,
} from '@folio/stripes-leipzig-components';

import {
  API_EZB_CREDENTIALS,
  QK_EZB_CREDENTIALS,
} from '../util/constants';
import CredentialsSettingsForm from './CredentialsSettingsForm';

const CredentialsSettings = () => {
  const { data: credentials = {}, isError, isLoading, refetch } = useOkapiKyQuery({
    queryKey: [QK_EZB_CREDENTIALS],
    api: API_EZB_CREDENTIALS,
  });

  const { useUpdate } = useOkapiKyMutation({
    mutationKey: [QK_EZB_CREDENTIALS],
    api: API_EZB_CREDENTIALS,
    onSuccess: () => {
      refetch();
    }
  });

  const { mutateAsync: updateCredentials } = useUpdate();

  const handleSubmit = (values) => {
    updateCredentials(values);
  };

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return (
      <MessageBanner type="error">
        <FormattedMessage id="ui-finc-select.settings.ezbCredentials.error" />
      </MessageBanner>
    );
  }

  return (
    <div style={{ width: '100%' }}>
      <CredentialsSettingsForm
        initialValues={credentials}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default CredentialsSettings;

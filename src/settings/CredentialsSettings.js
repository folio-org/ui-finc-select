import { useQuery, useMutation } from 'react-query';
import { FormattedMessage } from 'react-intl';

import { useOkapiKy } from '@folio/stripes/core';
import { Loading, MessageBanner } from '@folio/stripes/components';

import { API_EZB_CREDENTIALS } from '../util/constants';
import CredentialsSettingsForm from './CredentialsSettingsForm';

const CredentialsSettings = () => {
  const ky = useOkapiKy();

  const { data: credentials, error, isLoading, refetch } = useQuery({
    queryKey: ['ezbCredentials'],
    queryFn: async () => {
      const res = await ky.get(API_EZB_CREDENTIALS).json();
      return res ?? {};
    }
  });

  const { mutate: updateCredentials } = useMutation({
    mutationFn: async (values) => {
      return ky.put(API_EZB_CREDENTIALS, { json: values });
    },
    onSuccess: () => {
      refetch();
    }
  });

  const handleSubmit = (values) => {
    updateCredentials(values);
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
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

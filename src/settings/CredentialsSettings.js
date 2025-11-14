import { useQuery, useMutation } from 'react-query';
import { FormattedMessage } from 'react-intl';

import { useOkapiKy } from '@folio/stripes/core';
import { Icon, Layout } from '@folio/stripes/components';

import { EZB_CREDENTIALS_API } from '../util/constants';
import CredentialsSettingsForm from './CredentialsSettingsForm';

const CredentialsSettings = () => {
  const ky = useOkapiKy();

  const { data: credentials, error, isLoading, refetch } = useQuery({
    queryKey: ['ezbCredentials'],
    queryFn: async () => {
      const res = await ky.get(EZB_CREDENTIALS_API).json();
      return res ?? {};
    }
  });

  const { mutate: updateCredentials } = useMutation({
    mutationFn: async (values) => {
      return ky.put(EZB_CREDENTIALS_API, { json: values });
    },
    onSuccess: () => {
      refetch();
    }
  });

  const handleSubmit = (values) => {
    updateCredentials(values);
  };

  if (isLoading) {
    return (
      <Layout className="marginTop1">
        <Icon icon="spinner-ellipsis" width="10px" />
      </Layout>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '1rem' }}>
        <p>
          <FormattedMessage id="ui-finc-select.settings.ezbCredentials.error" />
        </p>
      </div>
    );
  }

  return (
    <div style={{ width: '100%' }}>
      {credentials && (
        <CredentialsSettingsForm
          initialValues={credentials}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

export default CredentialsSettings;

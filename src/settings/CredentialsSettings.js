import { useQuery, useMutation } from 'react-query';
import { useOkapiKy } from '@folio/stripes/core';

import CredentialsSettingsForm from './CredentialsSettingsForm';

const CredentialsSettings = () => {
  const ky = useOkapiKy();

  const { data: credentials } = useQuery({
    queryKey: ['ezbCredentials'],
    queryFn: async () => {
      const res = await ky.get('finc-select/ezb-credentials').json();
      return res?.[0];
    }
  });

  const { mutate: updateCredentials } = useMutation({
    mutationFn: async (values) => {
      return ky.put('finc-select/ezb-credentials', { json: values });
    }
  });

  const handleSubmit = (values) => {
    updateCredentials(values);
  };

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

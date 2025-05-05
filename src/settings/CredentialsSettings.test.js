import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MemoryRouter } from 'react-router-dom';

import { render, screen, waitFor } from '@folio/jest-config-stripes/testing-library/react';

import CredentialsSettings from './CredentialsSettings';

jest.mock('./CredentialsSettingsForm', () => () => <div>CredentialsSettingsForm</div>);

const renderComponent = () => {
  const queryClient = new QueryClient();
  render(
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>
        <CredentialsSettings />
      </QueryClientProvider>
    </MemoryRouter>
  );
};

describe('CredentialsSettings', () => {
  test('rendering CredentialsSettingsForm component', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('CredentialsSettingsForm')).toBeInTheDocument();
    });
  });
});

import { QueryClient, QueryClientProvider } from 'react-query';
import { MemoryRouter } from 'react-router-dom';

import { render, screen, waitFor } from '@folio/jest-config-stripes/testing-library/react';

import CredentialsSettings from './CredentialsSettings';

jest.mock('./CredentialsSettingsForm', () => () => <div>CredentialsSettingsForm</div>);

jest.mock('react-query', () => {
  const actual = jest.requireActual('react-query');
  return {
    ...actual,
    useQuery: () => ({
      data: { user: 'test', password: 'test', libId: '123' },
      refetch: jest.fn(),
    }),
    useMutation: () => ({
      mutate: jest.fn(),
    }),
  };
});

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

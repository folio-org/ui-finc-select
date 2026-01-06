import { QueryClient, QueryClientProvider } from 'react-query';
import { MemoryRouter } from 'react-router-dom';

import { render, screen, waitFor } from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKyQuery } from '@folio/stripes-leipzig-components';

import CredentialsSettings from './CredentialsSettings';

jest.mock('./CredentialsSettingsForm', () => () => <div>CredentialsSettingsForm</div>);

jest.mock('@folio/stripes-leipzig-components', () => ({
  ...jest.requireActual('@folio/stripes-leipzig-components'),
  useOkapiKyQuery: jest.fn(),
}));

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
  beforeEach(() => {
    useOkapiKyQuery.mockReset();
  });

  test('renders loading state', () => {
    useOkapiKyQuery.mockReturnValue({
      data: undefined,
      isError: false,
      isLoading: true,
      refetch: jest.fn(),
    });

    renderComponent();

    expect(document.querySelector('.spinner')).toBeInTheDocument();
  });

  test('renders error state', () => {
    useOkapiKyQuery.mockReturnValue({
      data: undefined,
      isError: true,
      isLoading: false,
      refetch: jest.fn(),
    });

    renderComponent();

    expect(screen.getByText('ui-finc-select.settings.ezbCredentials.error')).toBeInTheDocument();
  });

  test('renders form when credentials are defined', async () => {
    useOkapiKyQuery.mockReturnValue({
      data: {},
      isError: false,
      isLoading: false,
      refetch: jest.fn(),
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('CredentialsSettingsForm')).toBeInTheDocument();
    });
  });

  test('renders form when ky.get().json() returns null', async () => {
    useOkapiKyQuery.mockReturnValue({
      data: null,
      isError: false,
      isLoading: false,
      refetch: jest.fn(),
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('CredentialsSettingsForm')).toBeInTheDocument();
    });
  });
});

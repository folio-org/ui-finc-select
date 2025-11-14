import { QueryClient, QueryClientProvider } from 'react-query';
import { MemoryRouter } from 'react-router-dom';

import { render, screen, waitFor } from '@folio/jest-config-stripes/testing-library/react';

import CredentialsSettings from './CredentialsSettings';

jest.mock('./CredentialsSettingsForm', () => () => <div>CredentialsSettingsForm</div>);

const mockUseQuery = jest.fn();

jest.mock('react-query', () => {
  const actual = jest.requireActual('react-query');
  return {
    ...actual,
    useQuery: (...args) => mockUseQuery(...args),
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
  test('renders loading state', () => {
    mockUseQuery.mockReturnValue({
      data: undefined,
      error: null,
      isLoading: true,
    });

    renderComponent();

    expect(screen.getByText('Icon')).toBeInTheDocument();
  });

  test('renders error state', () => {
    mockUseQuery.mockReturnValue({
      data: undefined,
      error: { message: 'Network error' },
      isLoading: false,
    });

    renderComponent();

    expect(screen.getByText('ui-finc-select.settings.ezbCredentials.error')).toBeInTheDocument();
  });

  test('renders form when credentials are defined', async () => {
    mockUseQuery.mockReturnValue({
      data: {},
      error: null,
      isLoading: false,
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('CredentialsSettingsForm')).toBeInTheDocument();
    });
  });
});

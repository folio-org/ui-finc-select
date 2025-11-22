import { QueryClient, QueryClientProvider } from 'react-query';
import { MemoryRouter } from 'react-router-dom';

import { render, screen, waitFor } from '@folio/jest-config-stripes/testing-library/react';

import CredentialsSettings from './CredentialsSettings';

jest.mock('./CredentialsSettingsForm', () => () => <div>CredentialsSettingsForm</div>);

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  Loading: () => <div>Loading</div>,
}));

const mockUseQuery = jest.fn();
const mockKyGet = jest.fn();

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

jest.mock('@folio/stripes/core', () => ({
  useOkapiKy: () => ({
    get: mockKyGet,
    put: jest.fn(),
  }),
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
    mockUseQuery.mockReset();
    mockKyGet.mockReset();
  });

  test('renders loading state', () => {
    mockUseQuery.mockReturnValue({
      data: undefined,
      error: null,
      isLoading: true,
    });

    renderComponent();

    expect(screen.getByText('Loading')).toBeInTheDocument();
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

  test('renders form when ky.get().json() returns null', async () => {
    // Use actual useQuery implementation
    const { useQuery: actualUseQuery } = jest.requireActual('react-query');
    mockUseQuery.mockImplementation(actualUseQuery);

    // Mock ky.get().json() to return null
    mockKyGet.mockReturnValue({
      json: jest.fn().mockResolvedValue(null),
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('CredentialsSettingsForm')).toBeInTheDocument();
    });
  });
});

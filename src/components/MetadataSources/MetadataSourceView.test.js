import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import { MemoryRouter } from 'react-router-dom';

import { screen, waitFor } from '@folio/jest-config-stripes/testing-library/react';
import { StripesContext } from '@folio/stripes/core';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import renderWithIntlConfiguration from '../../../test/jest/helpers/renderWithIntlConfiguration';
import SOURCE from '../../../test/fixtures/metadatasource';
import MetadataSourceView from './MetadataSourceView';

const mockPut = jest.fn();
const mockGet = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ name: 'Test organization', id: 'uuid-1234' }),
  }));

jest.mock('@folio/stripes/core', () => {
  const original = jest.requireActual('@folio/stripes/core');
  return {
    ...original,
    useOkapiKy: () => ({
      put: mockPut,
      get: mockGet,
    }),
  };
});

const handlers = {
  onClose: jest.fn,
  onEdit: jest.fn,
};

const queryClient = new QueryClient();
const okapiState = { okapi: { token: {} } };

const stripes = {
  okapi: {
    tenant: 'diku',
    token: 'someToken',
    url: 'https://folio-testing-okapi.dev.folio.org',
  },
  store: { getState: () => okapiState },
  hasPerm: () => jest.fn(),
};

const renderMetadataSourceView = (record = SOURCE) => renderWithIntlConfiguration(
  <QueryClientProvider client={queryClient}>
    <MemoryRouter>
      <StripesContext.Provider value={stripes}>
        <MetadataSourceView
          canEdit
          handlers={handlers}
          isLoading={false}
          record={record}
          stripes={stripes}
        />
      </StripesContext.Provider>
    </MemoryRouter>
  </QueryClientProvider>
);

jest.unmock('react-intl');

describe('MetadataSourceView', () => {
  beforeEach(() => {
    stripes.hasPerm = () => true;
    renderMetadataSourceView(SOURCE);
  });

  it('accordions should be present', () => {
    expect(document.querySelector('#managementAccordion')).toBeInTheDocument();
    expect(document.querySelector('#technicalAccordion')).toBeInTheDocument();
  });

  it('should display name', () => {
    expect(screen.getByLabelText('Cambridge University Press Journals')).toBeInTheDocument();
  });

  it('should display description', () => {
    expect(screen.getByText(
      'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore.'
    )).toBeInTheDocument();
  });

  it('should display status', () => {
    expect(screen.getByText('Implementation')).toBeInTheDocument();
  });

  it('should display organization', async () => {
    await waitFor(() => {
      expect(screen.getByText('Test organization')).toBeInTheDocument();
    });
  });

  it('should display indexing level', () => {
    expect(screen.getByText('bibliographic')).toBeInTheDocument();
  });

  it('should display general notes', () => {
    expect(screen.getByText('Test licensing note')).toBeInTheDocument();
  });

  it('should display buttons', () => {
    expect(screen.getByText('Show selected collections')).toBeInTheDocument();
    expect(screen.getByText('Select all collections')).toBeInTheDocument();
    expect(screen.getByText('Show all collections')).toBeInTheDocument();
  });

  describe('Select all collections', () => {
    it('should be enabled button', () => {
      const selectAllCollectionsButton = screen.getByRole('button', { name: 'Select all collections' });
      expect(selectAllCollectionsButton).toBeEnabled();
    });

    it('should show success modal on failed collection selection', async () => {
      const selectAllCollectionsButton = screen.getByRole('button', { name: 'Select all collections' });
      mockPut.mockRejectedValueOnce(new Error('Mocked error'));

      userEvent.click(selectAllCollectionsButton);

      await waitFor(() => {
        expect(screen.getByText('The process could not start.')).toBeInTheDocument();
      });
    });

    it('should show success modal on successful collection selection', async () => {
      const selectAllCollectionsButton = screen.getByRole('button', { name: 'Select all collections' });
      mockPut.mockResolvedValueOnce();

      userEvent.click(selectAllCollectionsButton);

      await waitFor(() => {
        expect(
          screen.getByText('The process has been started. It can take some time, until all ISILs will be added to the selected by field.')
        ).toBeInTheDocument();
      });
    });
  });
});

describe('rendering MetadataSourceView without selectAll permission', () => {
  beforeEach(() => {
    stripes.hasPerm = () => false;
    renderMetadataSourceView(SOURCE);
  });

  it('should disable button', () => {
    const sourcesButton = screen.getByRole('button', { name: 'Select all collections' });
    expect(sourcesButton).toBeDisabled();
  });
});

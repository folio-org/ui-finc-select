import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import { MemoryRouter } from 'react-router-dom';

import { screen } from '@folio/jest-config-stripes/testing-library/react';
import { StripesContext } from '@folio/stripes/core';

import renderWithIntlConfiguration from '../../../test/jest/helpers/renderWithIntlConfiguration';
import SOURCE from '../../../test/fixtures/metadatasource';
import MetadataSourceView from './MetadataSourceView';

const handlers = {
  onClose: jest.fn,
  onEdit: jest.fn,
};

const queryClient = new QueryClient();
const okapiState = { okapi: { token: {} } };

const stripes = {
  // we need to set okapi token here
  okapi: {
    tenant: 'diku',
    token: 'someToken',
    url: 'https://folio-testing-okapi.dev.folio.org',
  },
  // we need to set store here
  store: { getState: () => { return okapiState; } },
  hasPerm: () => jest.fn(),
};

const renderMetadataSourceView = (record = SOURCE) => (
  renderWithIntlConfiguration(
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
  )
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
    expect(screen.getByText('Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore.')).toBeInTheDocument();
  });

  it('should display status', () => {
    expect(screen.getByText('Implementation')).toBeInTheDocument();
  });

  it('should display organization', () => {
    expect(screen.getByText('Test organization')).toBeInTheDocument();
  });

  it('should display indexing level', () => {
    expect(screen.getByText('bibliographic')).toBeInTheDocument();
  });

  it('should display general notes', () => {
    expect(screen.getByText('Test licensing note')).toBeInTheDocument();
  });

  test('should display buttons', async () => {
    expect(screen.getByText('Show selected collections')).toBeInTheDocument();
    expect(screen.getByText('Select all collections')).toBeInTheDocument();
    expect(screen.getByText('Show all collections')).toBeInTheDocument();
  });

  it('should not disable button', () => {
    const sourcesButton = screen.getByRole('button', { name: 'Select all collections' });
    expect(sourcesButton).not.toBeDisabled();
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

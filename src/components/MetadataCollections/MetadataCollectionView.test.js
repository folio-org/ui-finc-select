import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { StripesContext } from '@folio/stripes/core';

import withIntlConfiguration from '../../../test/jest/helpers/withIntlConfiguration';
import COLLECTION from '../../../test/fixtures/metadatacollection';
import MetadataCollectionView from './MetadataCollectionView';

const handlers = {
  onClose: jest.fn,
  onEdit: jest.fn,
};

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
};

const renderMetadateCollectionView = (record = COLLECTION) => (
  render(withIntlConfiguration(
    <MemoryRouter>
      <StripesContext.Provider value={stripes}>
        <MetadataCollectionView
          canEdit
          handlers={handlers}
          isLoading={false}
          record={record}
          stripes={stripes}
        />
      </StripesContext.Provider>
    </MemoryRouter>
  ))
);

jest.unmock('react-intl');

describe('MetadataCollectionView', () => {
  beforeEach(() => {
    renderMetadateCollectionView(COLLECTION);
  });

  test('accordions should be present', async () => {
    expect(document.querySelector('#contentAccordion')).toBeInTheDocument();
    expect(document.querySelector('#technicalAccordion')).toBeInTheDocument();
  });

  it('should display name', () => {
    expect(screen.getByLabelText('21st Century Political Science Association')).toBeInTheDocument();
  });

  it('should display metadata source', () => {
    expect(screen.getByText('Early Music Online')).toBeInTheDocument();
  });

  it('should display description', () => {
    expect(screen.getByText('This is a test metadata collection 2')).toBeInTheDocument();
  });

  it('should display ID', () => {
    expect(screen.getByText('psa-459')).toBeInTheDocument();
  });
});

import { MemoryRouter } from 'react-router-dom';

import { screen } from '@folio/jest-config-stripes/testing-library/react';
import { StripesContext } from '@folio/stripes/core';

import renderWithIntlConfiguration from '../../../test/jest/helpers/renderWithIntlConfiguration';
import FILTER from '../../../test/fixtures/filter';
import FilterView from './FilterView';

const handlers = {
  onClose: jest.fn,
  onEdit: jest.fn,
};

const stripes = {
  // we need to set okapi token here
  okapi: {
    tenant: 'diku',
    token: 'someToken',
    url: 'https://folio-testing-okapi.dev.folio.org',
  },
};

const renderFilterView = (record = FILTER) => (
  renderWithIntlConfiguration(
    <MemoryRouter>
      <StripesContext.Provider value={stripes}>
        <FilterView
          canEdit
          handlers={handlers}
          isLoading={false}
          record={record}
          stripes={stripes}
        />
      </StripesContext.Provider>
    </MemoryRouter>
  )
);

jest.unmock('react-intl');

describe('FilterView', () => {
  beforeEach(() => {
    renderFilterView(FILTER);
  });

  it('accordions should be present', () => {
    expect(document.querySelector('#fileAccordion')).toBeInTheDocument();
    expect(document.querySelector('#collectionAccordion')).toBeInTheDocument();
  });

  it('should display name', () => {
    expect(screen.getByLabelText('Holdings 1')).toBeInTheDocument();
  });

  it('should display type', () => {
    expect(screen.getByText('Whitelist')).toBeInTheDocument();
  });
});

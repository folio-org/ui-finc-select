import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { screen } from '@testing-library/react';
import { StripesContext } from '@folio/stripes/core';

import '../../../test/jest/__mock__';
import translationsProperties from '../../../test/jest/helpers/translationsProperties';
import renderWithIntl from '../../../test/jest/helpers';
import FILTER from '../../../test/fixtures/filter';
import FilterView from './FilterView';
import stripes from '../../../test/jest/__mock__/stripesCore.mock';

const handlers = {
  onClose: jest.fn,
  onEdit: jest.fn,
};

const renderFilterView = (fakeStripes = stripes, record = FILTER) => (
  renderWithIntl(
    <MemoryRouter>
      <StripesContext.Provider value={fakeStripes}>
        <FilterView
          canEdit
          handlers={handlers}
          isLoading={false}
          record={record}
          stripes={fakeStripes}
        />
      </StripesContext.Provider>
    </MemoryRouter>,
    translationsProperties
  )
);

describe('FilterView', () => {
  beforeEach(() => {
    renderFilterView(stripes, FILTER);
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

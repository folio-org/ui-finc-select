import { MemoryRouter } from 'react-router-dom';

import { StripesContext, useStripes } from '@folio/stripes/core';
import { screen, within } from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import withIntlConfiguration from '../../../test/jest/helpers/withIntlConfiguration';
import filters from '../../../test/fixtures/filters';
import filter from '../../../test/fixtures/filter';
import Filters from './Filters';

jest.mock('react-virtualized-auto-sizer', () => ({ children }) => children({ width: 1920, height: 1080 }));

let renderWithIntlResult = {};
const sourcePending = { source: { pending: jest.fn(() => true), totalCount: jest.fn(() => 0), loaded: jest.fn(() => false) } };
const sourceLoaded = { source: { pending: jest.fn(() => false), totalCount: jest.fn(() => 1), loaded: jest.fn(() => true) } };

const renderFilters = (stripes, props, data, rerender) => (
  withIntlConfiguration(
    <MemoryRouter>
      <StripesContext.Provider value={stripes}>
        <Filters
          contentData={data}
          onNeedMoreData={jest.fn()}
          queryGetter={jest.fn()}
          querySetter={jest.fn()}
          searchString="type.Whitelist,type.Blacklist"
          selectedRecordId=""
          visibleColumns={['label', 'type']}
          {...props}
        />
      </StripesContext.Provider>
    </MemoryRouter>,
    rerender
  )
);

jest.unmock('react-intl');

describe('Filters SASQ View', () => {
  let stripes;

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    stripes = useStripes();
  });

  describe('check if elements are available', () => {
    beforeEach(() => {
      renderFilters(stripes);
    });

    it('should be visible all search and filter elements', () => {
      expect(screen.getByRole('heading', { name: 'Search & filter' })).toBeInTheDocument();
      const filterPane = document.querySelector('#pane-filter-filter');
      expect(filterPane).toBeInTheDocument();

      expect(within(filterPane).getByText('Type')).toBeInTheDocument();
    });

    it('should be visible the results with all columns', () => {
      const resultPane = document.querySelector('#pane-filter-results');
      expect(resultPane).toBeInTheDocument();
      expect(within(resultPane).getByRole('heading', { name: 'Filters' })).toBeInTheDocument();
      expect(within(resultPane).getByText('Name')).toBeInTheDocument();
      expect(within(resultPane).getByText('Type')).toBeInTheDocument();
    });
  });

  describe('enter a search sting', () => {
    it('should enable buttons and reload the results', async () => {
      renderWithIntlResult = renderFilters(stripes, sourcePending, filters);

      const resetAllButton = document.querySelector('#clickable-reset-all');
      expect(resetAllButton).toBeInTheDocument();
      expect(resetAllButton).toBeDisabled();

      const searchButton = screen.getByRole('button', { name: 'Search' });
      expect(searchButton).toBeInTheDocument();
      expect(searchButton).toBeDisabled();

      const searchFieldInput = document.querySelector('#filterSearchField');
      await userEvent.type(searchFieldInput, 'Holdings 1');

      expect(resetAllButton).toBeEnabled();
      expect(searchButton).toBeEnabled();

      await userEvent.click(searchButton);

      renderFilters(
        stripes,
        sourceLoaded,
        [filter],
        renderWithIntlResult.rerender
      );

      expect(document.querySelectorAll('#list-filters .mclRowContainer > [role=row]').length).toEqual(1);
      expect(screen.getByText('Holdings 1')).toBeInTheDocument();
    });
  });

  describe('change a filter', () => {
    it('should enable buttons and reload the results', async () => {
      renderWithIntlResult = renderFilters(stripes, sourcePending, filters);

      const resetAllButton = document.querySelector('#clickable-reset-all');
      expect(resetAllButton).toBeInTheDocument();
      expect(resetAllButton).toBeDisabled();

      const typeFilter = document.querySelector('#filter-accordion-type');
      expect(typeFilter).toBeInTheDocument();
      const typeInput = within(typeFilter).getByText('Whitelist');
      expect(typeInput).toBeInTheDocument();
      await userEvent.click(typeInput);

      expect(resetAllButton).toBeEnabled();

      renderFilters(
        stripes,
        sourceLoaded,
        [filter],
        renderWithIntlResult.rerender
      );

      expect(document.querySelectorAll('#list-filters .mclRowContainer > [role=row]').length).toEqual(1);
    });
  });
});

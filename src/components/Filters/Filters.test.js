import { MemoryRouter } from 'react-router-dom';

import {
  screen,
  within,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import {
  StripesContext,
  useStripes,
} from '@folio/stripes/core';

import filters from '../../../test/fixtures/filters';
import renderWithIntlConfiguration from '../../../test/jest/helpers/renderWithIntlConfiguration';
import Filters from './Filters';

jest.mock('react-virtualized-auto-sizer', () => ({ children }) => children({ width: 1920, height: 1080 }));

const renderFilters = (stripes, data) => (
  renderWithIntlConfiguration(
    <MemoryRouter>
      <StripesContext.Provider value={stripes}>
        <Filters
          contentData={data}
          onNeedMoreData={jest.fn()}
          queryGetter={jest.fn()}
          querySetter={jest.fn()}
          searchString="type.Whitelist,type.Blacklist"
          selectedRecordId=""
        />
      </StripesContext.Provider>
    </MemoryRouter>
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
      renderFilters(stripes, filters);
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
    it('should enable reset all and search buttons', async () => {
      renderFilters(stripes, filters);

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
    });
  });

  describe('change a filter', () => {
    it('should enable reset all button', async () => {
      renderFilters(stripes, filters);

      const resetAllButton = document.querySelector('#clickable-reset-all');
      expect(resetAllButton).toBeInTheDocument();
      expect(resetAllButton).toBeDisabled();

      const typeFilter = document.querySelector('#filter-accordion-type');
      expect(typeFilter).toBeInTheDocument();
      const typeInput = within(typeFilter).getByText('Whitelist');
      expect(typeInput).toBeInTheDocument();
      await userEvent.click(typeInput);

      expect(resetAllButton).toBeEnabled();
    });
  });

  describe('render SASQ without results', () => {
    it('should be visible no results text', () => {
      renderFilters(stripes, []);

      const resultPane = document.querySelector('#pane-filter-results');
      expect(resultPane).toBeInTheDocument();
      expect(within(resultPane).getByText('No source yet')).toBeInTheDocument();
    });
  });
});

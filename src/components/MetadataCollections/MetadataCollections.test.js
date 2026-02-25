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

import metadatacollections from '../../../test/fixtures/metadatacollections';
import mdSources from '../../../test/fixtures/tinyMetadataSources';
import renderWithIntlConfiguration from '../../../test/jest/helpers/renderWithIntlConfiguration';
import MetadataCollections from './MetadataCollections';

jest.mock('react-virtualized-auto-sizer', () => ({ children }) => children({ width: 1920, height: 1080 }));

const tinySources = { mdSources };

const renderMetadataCollections = (stripes, data) => renderWithIntlConfiguration(
  <MemoryRouter>
    <StripesContext.Provider value={stripes}>
      <MetadataCollections
        contentData={data}
        filterData={tinySources}
        onNeedMoreData={jest.fn()}
        queryGetter={jest.fn()}
        querySetter={jest.fn()}
        searchString="permitted.yes,selected.yes"
        selectedRecordId=""
      />
    </StripesContext.Provider>
  </MemoryRouter>
);

jest.unmock('react-intl');

describe('Collections SASQ', () => {
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
      renderMetadataCollections(stripes, metadatacollections);
    });

    it('should be visible all search and filter elements', async () => {
      expect(screen.getByRole('heading', { name: 'Search & filter' })).toBeInTheDocument();
      const filterPane = document.querySelector('#pane-collection-filter');
      expect(filterPane).toBeInTheDocument();

      expect(within(filterPane).getByText('All')).toBeInTheDocument();
      expect(within(filterPane).getByText('Name')).toBeInTheDocument();
      expect(within(filterPane).getByText('Description')).toBeInTheDocument();
      expect(within(filterPane).getByText('ID')).toBeInTheDocument();

      expect(within(filterPane).getByText('Metadata source')).toBeInTheDocument();
      expect(within(filterPane).getByText('Free content')).toBeInTheDocument();
      expect(within(filterPane).getByText('Usage permitted')).toBeInTheDocument();
    });

    it('should be visible the results with all columns', () => {
      const resultPane = document.querySelector('#pane-collection-results');
      expect(resultPane).toBeInTheDocument();
      expect(within(resultPane).getByRole('heading', { name: 'Metadata collections' })).toBeInTheDocument();
      expect(within(resultPane).getByText('Name')).toBeInTheDocument();
      expect(within(resultPane).getByText('Metadata source')).toBeInTheDocument();
      expect(within(resultPane).getByText('Usage permitted')).toBeInTheDocument();
      expect(within(resultPane).getByText('Free content')).toBeInTheDocument();
    });
  });

  describe('enter a search sting', () => {
    it('should enable reset all and search buttons', async () => {
      renderMetadataCollections(stripes, metadatacollections);

      const resetAllButton = document.querySelector('#clickable-reset-all');
      expect(resetAllButton).toBeInTheDocument();
      expect(resetAllButton).toBeDisabled();

      const searchButton = screen.getByRole('button', { name: 'Search' });
      expect(searchButton).toBeInTheDocument();
      expect(searchButton).toBeDisabled();

      const searchFieldInput = document.querySelector('#collectionSearchField');
      await userEvent.type(searchFieldInput, 'Political');

      expect(resetAllButton).toBeEnabled();
      expect(searchButton).toBeEnabled();
    });
  });

  describe('change a filter', () => {
    it('should enable reset all button', async () => {
      renderMetadataCollections(stripes, metadatacollections);

      const resetAllButton = document.querySelector('#clickable-reset-all');
      expect(resetAllButton).toBeInTheDocument();
      expect(resetAllButton).toBeDisabled();

      const freeContentFilter = document.querySelector('#filter-accordion-freeContent');
      expect(freeContentFilter).toBeInTheDocument();
      const freeContentInputNo = within(freeContentFilter).getByText('No');
      expect(freeContentInputNo).toBeInTheDocument();
      await userEvent.click(freeContentInputNo);

      expect(resetAllButton).toBeEnabled();
    });
  });

  describe('render SASQ without results', () => {
    it('should be visible no results text', () => {
      renderMetadataCollections(stripes, []);

      const resultPane = document.querySelector('#pane-collection-results');
      expect(resultPane).toBeInTheDocument();
      expect(within(resultPane).getByText('No source yet')).toBeInTheDocument();
    });
  });
});

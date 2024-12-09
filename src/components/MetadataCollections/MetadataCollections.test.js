import { MemoryRouter } from 'react-router-dom';

import { StripesContext, useStripes } from '@folio/stripes/core';
import { screen, within } from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import withIntlConfiguration from '../../../test/jest/helpers/withIntlConfiguration';
import metadatacollections from '../../../test/fixtures/metadatacollections';
import metadatacollection from '../../../test/fixtures/metadatacollection';
import mdSources from '../../../test/fixtures/tinyMetadataSources';
import MetadataCollections from './MetadataCollections';

jest.mock('react-virtualized-auto-sizer', () => ({ children }) => children({ width: 1920, height: 1080 }));

const tinySources = { mdSources };

let renderWithIntlResult = {};
const sourcePending = { source: { pending: jest.fn(() => true), totalCount: jest.fn(() => 0), loaded: jest.fn(() => false) } };
const sourceLoaded = { source: { pending: jest.fn(() => false), totalCount: jest.fn(() => 1), loaded: jest.fn(() => true) } };

const renderMetadataCollections = (stripes, props, data, rerender) => withIntlConfiguration(
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
        visibleColumns={['label', 'mdSource', 'permitted', 'freeContent']}
        {...props}
      />
    </StripesContext.Provider>
  </MemoryRouter>,
  rerender
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
      renderMetadataCollections(stripes);
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
    it('should enable buttons and reload the results', async () => {
      renderWithIntlResult = renderMetadataCollections(stripes, sourcePending, metadatacollections);

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

      await userEvent.click(searchButton);

      renderMetadataCollections(
        stripes,
        sourceLoaded,
        [metadatacollection],
        renderWithIntlResult.rerender
      );

      expect(document.querySelectorAll('#list-collections .mclRowContainer > [role=row]').length).toEqual(1);
      expect(screen.getByText('21st Century Political Science Association')).toBeInTheDocument();
    });
  });

  describe('change a filter', () => {
    it('should enable buttons and reload the results', async () => {
      renderWithIntlResult = renderMetadataCollections(stripes, sourcePending, metadatacollections);

      const resetAllButton = document.querySelector('#clickable-reset-all');
      expect(resetAllButton).toBeInTheDocument();
      expect(resetAllButton).toBeDisabled();

      const freeContentFilter = document.querySelector('#filter-accordion-freeContent');
      expect(freeContentFilter).toBeInTheDocument();
      const freeContentInputNo = within(freeContentFilter).getByText('No');
      expect(freeContentInputNo).toBeInTheDocument();
      await userEvent.click(freeContentInputNo);

      expect(resetAllButton).toBeEnabled();

      renderMetadataCollections(
        stripes,
        sourceLoaded,
        [metadatacollection],
        renderWithIntlResult.rerender
      );

      expect(document.querySelectorAll('#list-collections .mclRowContainer > [role=row]').length).toEqual(1);
    });
  });
});

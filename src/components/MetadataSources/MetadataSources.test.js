import { MemoryRouter } from 'react-router-dom';

import { StripesContext, useStripes } from '@folio/stripes/core';
import { screen, within } from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import withIntlConfiguration from '../../../test/jest/helpers/withIntlConfiguration';
import metadatasources from '../../../test/fixtures/metadatasources';
import MetadataSources from './MetadataSources';

jest.mock('react-virtualized-auto-sizer', () => ({ children }) => children({ width: 1920, height: 1080 }));

let renderWithIntlResult = {};
const sourcePending = { source: { pending: jest.fn(() => true), totalCount: jest.fn(() => 0), loaded: jest.fn(() => false) } };
const sourceLoaded = { source: { pending: jest.fn(() => false), totalCount: jest.fn(() => 1), loaded: jest.fn(() => true) } };

const filterData = { contacts: [
  {
    'externalId': 'fcfaca0b-12e7-467e-b503-d44a44d60a62',
    'name': 'Doe, John',
  },
  {
    'externalId': '01771c0a-a890-4488-b5e9-366aa697bd93',
    'name': 'Doe, Jane',
  }
] };

const renderMetadataSources = (stripes, props, data, rerender) => withIntlConfiguration(
  <MemoryRouter>
    <StripesContext.Provider value={stripes}>
      <MetadataSources
        contentData={data}
        filterData={filterData}
        onNeedMoreData={jest.fn()}
        queryGetter={jest.fn()}
        querySetter={jest.fn()}
        searchString="status.active,status.implementation"
        selectedRecordId=""
        visibleColumns={['label', 'sourceId', 'status', 'lastProcessed']}
        {...props}
      />
    </StripesContext.Provider>
  </MemoryRouter>,
  rerender
);

jest.unmock('react-intl');

describe('Sources SASQ View', () => {
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
      renderMetadataSources(stripes, sourcePending, metadatasources);
    });

    it('should be visible all search and filter elements', () => {
      expect(screen.getByRole('heading', { name: 'Search & filter' })).toBeInTheDocument();
      const filterPane = document.querySelector('#pane-source-filter');
      expect(filterPane).toBeInTheDocument();

      const qindex = document.querySelector('#sourceSearchField-qindex');
      expect(within(qindex).getByText('All')).toBeInTheDocument();
      expect(within(qindex).getByText('Name')).toBeInTheDocument();
      expect(within(qindex).getByText('Description')).toBeInTheDocument();
      expect(within(qindex).getByText('ID')).toBeInTheDocument();

      expect(within(filterPane).getByText('Implementation status')).toBeInTheDocument();
      expect(within(filterPane).getByText('Selected')).toBeInTheDocument();
    });

    it('should be visible the results with all columns', () => {
      const resultPane = document.querySelector('#pane-source-results');
      expect(resultPane).toBeInTheDocument();
      expect(within(resultPane).getByRole('heading', { name: 'Metadata sources' })).toBeInTheDocument();
      expect(within(resultPane).getByText('Name')).toBeInTheDocument();
      expect(within(resultPane).getByText('ID')).toBeInTheDocument();
      expect(within(resultPane).getByText('Implementation status')).toBeInTheDocument();
      expect(within(resultPane).getByText('Last processed')).toBeInTheDocument();
    });
  });

  describe('enter a search sting', () => {
    it('should enable buttons and reload the results', async () => {
      renderWithIntlResult = renderMetadataSources(stripes, sourcePending, metadatasources);

      const resetAllButton = document.querySelector('#clickable-reset-all');
      expect(resetAllButton).toBeInTheDocument();
      expect(resetAllButton).toBeDisabled();

      const searchButton = screen.getByRole('button', { name: 'Search' });
      expect(searchButton).toBeInTheDocument();
      expect(searchButton).toBeDisabled();

      const searchFieldInput = document.querySelector('#sourceSearchField');
      await userEvent.type(searchFieldInput, 'Cambridge');

      expect(resetAllButton).toBeEnabled();
      expect(searchButton).toBeEnabled();

      await userEvent.click(searchButton);

      renderMetadataSources(
        stripes,
        sourceLoaded,
        metadatasources,
        renderWithIntlResult.rerender
      );

      expect(document.querySelectorAll('#list-sources .mclRowContainer > [role=row]').length).toEqual(1);
      expect(screen.getByText('Cambridge University Press Journals')).toBeInTheDocument();
    });
  });

  describe('change a filter', () => {
    it('should enable buttons and reload the results', async () => {
      renderWithIntlResult = renderMetadataSources(stripes, sourcePending, metadatasources);

      const resetAllButton = document.querySelector('#clickable-reset-all');
      expect(resetAllButton).toBeInTheDocument();
      expect(resetAllButton).toBeDisabled();

      const statusFilter = document.querySelector('#filter-accordion-status');
      expect(statusFilter).toBeInTheDocument();
      const statusInput = within(statusFilter).getByText('Implementation');
      expect(statusInput).toBeInTheDocument();
      await userEvent.click(statusInput);

      expect(resetAllButton).toBeEnabled();

      renderMetadataSources(
        stripes,
        sourceLoaded,
        metadatasources,
        renderWithIntlResult.rerender
      );

      expect(document.querySelectorAll('#list-sources .mclRowContainer > [role=row]').length).toEqual(1);
    });
  });

  describe('render SASQ without results', () => {
    it('should be visible no results text', () => {
      renderMetadataSources(stripes, {}, []);

      const resultPane = document.querySelector('#pane-source-results');
      expect(resultPane).toBeInTheDocument();
      expect(within(resultPane).getByText('No source yet')).toBeInTheDocument();
    });
  });
});

import {
  screen,
  within,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import mdSources from '../../../test/fixtures/tinyMetadataSources';
import renderWithIntlConfiguration from '../../../test/jest/helpers/renderWithIntlConfiguration';
import CollectionFilters from './CollectionFilters';

jest.unmock('react-intl');

const activeFilters = {
  selected: [],
  freeContent: ['yes'],
  permitted: [],
  mdSource: [],
};

const filterHandlers = {
  clearGroup: jest.fn(),
  state: jest.fn(),
};

const renderCollectionFilters = (props = {}) => renderWithIntlConfiguration(
  <CollectionFilters
    activeFilters={activeFilters}
    filterData={{ mdSources }}
    filterHandlers={filterHandlers}
    {...props}
  />
);

describe('CollectionFilters', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('filter accordions', () => {
    it('should render all filter accordions', () => {
      renderCollectionFilters();

      expect(screen.getByText('Metadata source')).toBeInTheDocument();
      expect(screen.getByText('Free content')).toBeInTheDocument();
      expect(screen.getByText('Usage permitted')).toBeInTheDocument();
      expect(screen.getByText('Selected')).toBeInTheDocument();
    });

    it('should pass additional props to the checkbox filter accordions', () => {
      renderCollectionFilters({ closedByDefault: true });

      expect(screen.getByRole('button', { name: 'Free content filter list' }))
        .toHaveAttribute('aria-expanded', 'false');
      expect(screen.getByRole('button', { name: 'Usage permitted filter list' }))
        .toHaveAttribute('aria-expanded', 'false');
      expect(screen.getByRole('button', { name: 'Selected filter list' }))
        .toHaveAttribute('aria-expanded', 'false');
    });
  });

  describe('checkbox filters', () => {
    it('should show the selected values of a filter group', () => {
      renderCollectionFilters();

      const accordion = screen.getByRole('region', { name: 'Free content filter list' });
      expect(within(accordion).getByRole('checkbox', { name: 'Yes' })).toBeChecked();
      expect(within(accordion).getByRole('checkbox', { name: 'No' })).not.toBeChecked();
    });

    it('should update the filter state when a checkbox is clicked', async () => {
      renderCollectionFilters();

      const accordion = screen.getByRole('region', { name: 'Usage permitted filter list' });
      await userEvent.click(within(accordion).getByRole('checkbox', { name: 'No' }));

      expect(filterHandlers.state).toHaveBeenCalledWith({ ...activeFilters, permitted: ['no'] });
    });

    it('should clear a filter group with the clear button', async () => {
      renderCollectionFilters();

      await userEvent.click(screen.getByRole('button', { name: /Clear selected Free content filters/ }));

      expect(filterHandlers.clearGroup).toHaveBeenCalledWith('freeContent');
    });

    it('should show no clear button for a filter group without selected values', () => {
      renderCollectionFilters();

      expect(screen.queryByRole('button', { name: /Clear selected Usage permitted filters/ })).not.toBeInTheDocument();
    });
  });
});

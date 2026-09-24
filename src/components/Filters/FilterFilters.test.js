import {
  screen,
  within,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import renderWithIntlConfiguration from '../../../test/jest/helpers/renderWithIntlConfiguration';
import FilterFilters from './FilterFilters';

jest.unmock('react-intl');

const activeFilters = {
  type: ['Whitelist'],
};

const filterHandlers = {
  clearGroup: jest.fn(),
  state: jest.fn(),
};

const renderFilterFilters = (props = {}) => renderWithIntlConfiguration(
  <FilterFilters
    activeFilters={activeFilters}
    filterHandlers={filterHandlers}
    {...props}
  />
);

describe('FilterFilters', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('filter accordions', () => {
    it('should render the type filter accordion', () => {
      renderFilterFilters();

      expect(screen.getByText('Type')).toBeInTheDocument();
    });
  });

  describe('checkbox filters', () => {
    it('should show the selected values of a filter group', () => {
      renderFilterFilters();

      const accordion = screen.getByRole('region', { name: 'Type filter list' });
      expect(within(accordion).getByRole('checkbox', { name: 'Whitelist' })).toBeChecked();
      expect(within(accordion).getByRole('checkbox', { name: 'Blacklist' })).not.toBeChecked();
    });

    it('should update the filter state when a checkbox is clicked', async () => {
      renderFilterFilters();

      const accordion = screen.getByRole('region', { name: 'Type filter list' });
      await userEvent.click(within(accordion).getByRole('checkbox', { name: 'Blacklist' }));

      expect(filterHandlers.state).toHaveBeenCalledWith({ type: ['Whitelist', 'Blacklist'] });
    });

    it('should clear a filter group with the clear button', async () => {
      renderFilterFilters();

      await userEvent.click(screen.getByRole('button', { name: /Clear selected Type filters/ }));

      expect(filterHandlers.clearGroup).toHaveBeenCalledWith('type');
    });

    it('should show no clear button for a filter group without selected values', () => {
      renderFilterFilters({ activeFilters: { type: [] } });

      expect(screen.queryByRole('button', { name: /Clear selected Type filters/ })).not.toBeInTheDocument();
    });
  });
});

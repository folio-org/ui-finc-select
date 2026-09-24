import {
  screen,
  within,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import renderWithIntlConfiguration from '../../../test/jest/helpers/renderWithIntlConfiguration';
import SourceFilters from './SourceFilters';

jest.unmock('react-intl');

const activeFilters = {
  status: ['active', 'implementation'],
  selected: [],
};

const filterHandlers = {
  clearGroup: jest.fn(),
  state: jest.fn(),
};

const renderSourceFilters = (props = {}) => renderWithIntlConfiguration(
  <SourceFilters
    activeFilters={activeFilters}
    filterHandlers={filterHandlers}
    {...props}
  />
);

describe('SourceFilters', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('filter accordions', () => {
    it('should render all filter accordions', () => {
      renderSourceFilters();

      expect(screen.getByText('Implementation status')).toBeInTheDocument();
      expect(screen.getByText('Selected')).toBeInTheDocument();
    });

    it('should pass additional props to the accordions', () => {
      renderSourceFilters({ closedByDefault: true });

      expect(screen.getByRole('button', { name: 'Implementation status filter list' }))
        .toHaveAttribute('aria-expanded', 'false');
      expect(screen.getByRole('button', { name: 'Selected filter list' }))
        .toHaveAttribute('aria-expanded', 'false');
    });
  });

  describe('checkbox filters', () => {
    it('should show the selected values of a filter group', () => {
      renderSourceFilters();

      const accordion = screen.getByRole('region', { name: 'Implementation status filter list' });
      expect(within(accordion).getByRole('checkbox', { name: 'Active' })).toBeChecked();
      expect(within(accordion).getByRole('checkbox', { name: 'Implementation' })).toBeChecked();
      expect(within(accordion).getByRole('checkbox', { name: 'Closed' })).not.toBeChecked();
    });

    it('should update the filter state when a checkbox is clicked', async () => {
      renderSourceFilters();

      const accordion = screen.getByRole('region', { name: 'Selected filter list' });
      await userEvent.click(within(accordion).getByRole('checkbox', { name: 'Some' }));

      expect(filterHandlers.state).toHaveBeenCalledWith({ ...activeFilters, selected: ['some'] });
    });

    it('should clear a filter group with the clear button', async () => {
      renderSourceFilters();

      await userEvent.click(screen.getByRole('button', { name: /Clear selected Implementation status filters/ }));

      expect(filterHandlers.clearGroup).toHaveBeenCalledWith('status');
    });

    it('should show no clear button for a filter group without selected values', () => {
      renderSourceFilters();

      expect(screen.queryByRole('button', { name: /Clear selected Selected filters/ })).not.toBeInTheDocument();
    });
  });
});

import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import { MemoryRouter } from 'react-router-dom';

import {
  render,
  screen,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';

import routeProps from '../../test/fixtures/routeProps';
import FilterViewRoute from './FilterViewRoute';

const queryClient = new QueryClient();

jest.mock('../components/Filters/FilterView', () => () => <div>FilterView</div>);

describe('render FilterViewRoute', () => {
  it('should render FilterView', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <FilterViewRoute {...routeProps} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('FilterView')).toBeInTheDocument();
    });
  });
});

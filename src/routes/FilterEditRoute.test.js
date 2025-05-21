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
import FilterEditRoute from './FilterEditRoute';

const queryClient = new QueryClient();

jest.mock('../components/Filters/FilterForm', () => () => <div>FilterForm</div>);

describe('render FilterEditRoute', () => {
  it('should render FilterForm', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <FilterEditRoute {...routeProps} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('FilterForm')).toBeInTheDocument();
    });
  });
});

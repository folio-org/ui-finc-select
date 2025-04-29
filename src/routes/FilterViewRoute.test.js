import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import { MemoryRouter } from 'react-router-dom';

import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import routeProps from '../../test/fixtures/routeProps';
import FilterViewRoute from './FilterViewRoute';

const queryClient = new QueryClient();

jest.mock('react-query', () => ({
  ...jest.requireActual('react-query'),
  useQuery: jest.fn().mockReturnValue({}),
  useMutation: jest.fn().mockReturnValue({}),
}));

jest.mock('../components/Filters/FilterView', () => () => <div>FilterView</div>);

describe('render FilterViewRoute', () => {
  it('should render FilterView', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <FilterViewRoute {...routeProps} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(screen.getByText('FilterView')).toBeInTheDocument();
  });
});

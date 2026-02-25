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
import SourceViewRoute from './SourceViewRoute';

const queryClient = new QueryClient();

jest.mock('../components/MetadataSources/MetadataSourceView', () => () => <div>MetadataSourceView</div>);

describe('render SourceViewRoute', () => {
  it('should render MetadataSourceView', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <SourceViewRoute {...routeProps} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('MetadataSourceView')).toBeInTheDocument();
    });
  });
});

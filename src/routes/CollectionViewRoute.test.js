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
import CollectionViewRoute from './CollectionViewRoute';

const queryClient = new QueryClient();

jest.mock('../components/MetadataCollections/MetadataCollectionView', () => () => <div>MetadataCollectionView</div>);

describe('render CollectionViewRoute', () => {
  it('should render MetadataCollectionView', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CollectionViewRoute {...routeProps} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('MetadataCollectionView')).toBeInTheDocument();
    });
  });
});

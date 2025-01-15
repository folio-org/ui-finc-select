import { MemoryRouter } from 'react-router-dom';

import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import routeProps from '../../test/fixtures/routeProps';
import CollectionViewRoute from './CollectionViewRoute';

jest.mock('../components/MetadataCollections/MetadataCollectionView', () => () => <div>MetadataCollectionView</div>);

describe('render CollectionViewRoute', () => {
  it('should render MetadataCollectionView', () => {
    render(
      <MemoryRouter>
        <CollectionViewRoute {...routeProps} />
      </MemoryRouter>
    );

    expect(screen.getByText('MetadataCollectionView')).toBeInTheDocument();
  });
});

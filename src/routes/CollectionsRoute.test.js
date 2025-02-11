import { MemoryRouter } from 'react-router-dom';

import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import routeProps from '../../test/fixtures/routeProps';
import CollectionsRoute from './CollectionsRoute';

jest.mock('../components/MetadataCollections/MetadataCollections', () => () => <div>MetadataCollections</div>);

describe('render CollectionsRoute', () => {
  it('should render MetadataCollections', () => {
    render(
      <MemoryRouter>
        <CollectionsRoute
          stripes={{ hasPerm: () => true, logger: { log: () => jest.fn() } }}
          {...routeProps}
        />
      </MemoryRouter>
    );

    expect(screen.getByText('MetadataCollections')).toBeInTheDocument();
  });
});

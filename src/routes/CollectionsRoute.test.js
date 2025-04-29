import { MemoryRouter } from 'react-router-dom';

import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import routeProps from '../../test/fixtures/routeProps';
import CollectionsRoute from './CollectionsRoute';

jest.mock('../components/MetadataCollections/MetadataCollections', () => () => <div>MetadataCollections</div>);

describe('render CollectionsRoute with permission', () => {
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

describe('render CollectionsRoute without permission', () => {
  it('should render the permission error', () => {
    render(
      <MemoryRouter>
        <CollectionsRoute
          stripes={{ hasPerm: () => false, logger: { log: () => jest.fn() } }}
          {...routeProps}
        />
      </MemoryRouter>
    );

    expect(screen.queryByText('MetadataCollections')).not.toBeInTheDocument();
    expect(screen.getByText('stripes-smart-components.permissionError')).toBeInTheDocument();
  });
});

import { MemoryRouter } from 'react-router-dom';

import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import routeProps from '../../test/fixtures/routeProps';
import SourcesRoute from './SourcesRoute';

jest.mock('../components/MetadataSources/MetadataSources', () => () => <div>MetadataSources</div>);

describe('render SourcesRoute', () => {
  it('should render MetadataSources', () => {
    render(
      <MemoryRouter>
        <SourcesRoute
          stripes={{ hasPerm: () => true, logger: { log: () => jest.fn() } }}
          {...routeProps}
        />
      </MemoryRouter>
    );

    expect(screen.getByText('MetadataSources')).toBeInTheDocument();
  });
});

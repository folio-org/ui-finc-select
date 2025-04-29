import { MemoryRouter } from 'react-router-dom';

import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import routeProps from '../../test/fixtures/routeProps';
import FiltersRoute from './FiltersRoute';

jest.mock('../components/Filters/Filters', () => () => <div>Filters</div>);

describe('render FiltersRoute with permission', () => {
  it('should render Filters', () => {
    render(
      <MemoryRouter>
        <FiltersRoute
          stripes={{ hasPerm: () => true, logger: { log: () => jest.fn() } }}
          {...routeProps}
        />
      </MemoryRouter>
    );

    expect(screen.getByText('Filters')).toBeInTheDocument();
  });
});

describe('render FiltersRoute without permission', () => {
  it('should render the permission error', () => {
    render(
      <MemoryRouter>
        <FiltersRoute
          stripes={{ hasPerm: () => false, logger: { log: () => jest.fn() } }}
          {...routeProps}
        />
      </MemoryRouter>
    );

    expect(screen.queryByText('Filters')).not.toBeInTheDocument();
    expect(screen.getByText('stripes-smart-components.permissionError')).toBeInTheDocument();
  });
});

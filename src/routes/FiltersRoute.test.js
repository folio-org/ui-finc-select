import { MemoryRouter } from 'react-router-dom';

import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import routeProps from '../../test/fixtures/routeProps';
import FiltersRoute from './FiltersRoute';

jest.mock('../components/Filters/Filters', () => () => <div>Filters</div>);

describe('render FiltersRoute', () => {
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

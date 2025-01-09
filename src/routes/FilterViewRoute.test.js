import { MemoryRouter } from 'react-router-dom';

import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import routeProps from '../../test/fixtures/routeProps';
import FilterViewRoute from './FilterViewRoute';

jest.mock('../components/Filters/FilterView', () => () => <div>FilterView</div>);

describe('render FilterViewRoute', () => {
  it('should render FilterView', () => {
    render(
      <MemoryRouter>
        <FilterViewRoute {...routeProps} />
      </MemoryRouter>
    );

    expect(screen.getByText('FilterView')).toBeInTheDocument();
  });
});

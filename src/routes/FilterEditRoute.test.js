import { MemoryRouter } from 'react-router-dom';

import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import routeProps from '../../test/fixtures/routeProps';
import FilterEditRoute from './FilterEditRoute';

jest.mock('../components/Filters/FilterForm', () => () => <div>FilterForm</div>);

describe('render FilterEditRoute', () => {
  it('should render FilterForm', () => {
    render(
      <MemoryRouter>
        <FilterEditRoute {...routeProps} />
      </MemoryRouter>
    );

    expect(screen.getByText('FilterForm')).toBeInTheDocument();
  });
});

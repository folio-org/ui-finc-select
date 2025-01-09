import { MemoryRouter } from 'react-router-dom';

import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import routeProps from '../../test/fixtures/routeProps';
import FilterCreateRoute from './FilterCreateRoute';


jest.mock('../components/Filters/FilterForm', () => () => <div>FilterForm</div>);

describe('render FilterCreateRoute', () => {
  it('should render FilterForm', () => {
    render(
      <MemoryRouter>
        <FilterCreateRoute {...routeProps} />
      </MemoryRouter>
    );

    expect(screen.getByText('FilterForm')).toBeInTheDocument();
  });
});

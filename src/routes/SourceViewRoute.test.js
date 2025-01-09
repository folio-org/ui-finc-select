import { MemoryRouter } from 'react-router-dom';

import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import routeProps from '../../test/fixtures/routeProps';
import SourceViewRoute from './SourceViewRoute';

jest.mock('../components/MetadataSources/MetadataSourceView', () => () => <div>MetadataSourceView</div>);

describe('render SourceViewRoute', () => {
  it('should render MetadataSourceView', () => {
    render(
      <MemoryRouter>
        <SourceViewRoute {...routeProps} />
      </MemoryRouter>
    );

    expect(screen.getByText('MetadataSourceView')).toBeInTheDocument();
  });
});

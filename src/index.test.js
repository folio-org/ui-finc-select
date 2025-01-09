import { MemoryRouter } from 'react-router-dom';

import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import FincSelect from './index';

jest.mock('./routes/CollectionsRoute', () => ({ children }) => (
  <div>CollectionsRoute {children}</div>
));
jest.mock('./routes/CollectionViewRoute', () => () => <div>CollectionViewRoute</div>);
jest.mock('./routes/FilterCreateRoute', () => () => <div>FilterCreateRoute</div>);
jest.mock('./routes/FilterEditRoute', () => () => <div>FilterEditRoute</div>);
jest.mock('./routes/FiltersRoute', () => ({ children }) => (
  <div>FiltersRoute {children}</div>
));
jest.mock('./routes/FilterViewRoute', () => () => <div>FilterViewRoute</div>);
jest.mock('./routes/SourcesRoute', () => ({ children }) => (
  <div>SourcesRoute {children}</div>
));
jest.mock('./routes/SourceViewRoute', () => () => <div>SourceViewRoute</div>);
jest.mock('./settings', () => () => <div>Settings</div>);

const match = {
  isExact: false,
  params: {},
  path: '/finc-select',
  url: '/finc-select',
};

const renderComponent = (settings, testPath) => (
  render(
    <MemoryRouter initialEntries={[testPath]}>
      <FincSelect
        location={{}}
        match={match}
        actAs={settings}
        stripes={{}}
      />
    </MemoryRouter>
  )
);

describe('render FincSelect settings', () => {
  it('should render <Settings> when actAs is `settings`', () => {
    renderComponent('settings', '/finc-select');
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('should not render <Settings> when showSettings is false', () => {
    renderComponent('', '/finc-select');
    expect(screen.queryByText('Settings')).not.toBeInTheDocument();
  });
});

describe('render FincSelect routes', () => {
  it('should render <CollectionsRoute> and <CollectionViewRoute>', () => {
    renderComponent('', '/finc-select/metadata-collections/50304b4b-cca1-49a8-8caa-318f0a07efa4');
    expect(screen.getByText('CollectionsRoute')).toBeInTheDocument();
    expect(screen.getByText('CollectionViewRoute')).toBeInTheDocument();
  });

  it('should render <FilterCreateRoute>', () => {
    renderComponent('', '/finc-select/filters/create');
    expect(screen.getByText('FilterCreateRoute')).toBeInTheDocument();
  });

  it('should render <FilterEditRoute>', () => {
    renderComponent('', '/finc-select/filters/50304b4b-cca1-49a8-8caa-318f0a07efa4/edit');
    expect(screen.getByText('FilterEditRoute')).toBeInTheDocument();
  });

  it('should render <FiltersRoute> and <FilterViewRoute>', () => {
    renderComponent('', '/finc-select/filters/50304b4b-cca1-49a8-8caa-318f0a07efa4');
    expect(screen.getByText('FiltersRoute')).toBeInTheDocument();
    expect(screen.getByText('FilterViewRoute')).toBeInTheDocument();
  });

  it('should render <SourcesRoute> and <SourceViewRoute>', () => {
    renderComponent('', '/finc-select/metadata-sources/50304b4b-cca1-49a8-8caa-318f0a07efa4');
    expect(screen.getByText('SourcesRoute')).toBeInTheDocument();
    expect(screen.getByText('SourceViewRoute')).toBeInTheDocument();
  });
});

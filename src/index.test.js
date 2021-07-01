import { noop } from 'lodash';
import React from 'react';
import { Router } from 'react-router-dom';
import { screen } from '@testing-library/react';
import { createMemoryHistory } from 'history';

import renderWithIntl from '../test/jest/helpers/renderWithIntl';
import CollectionsRoute from './routes/CollectionsRoute';
import SourcesRoute from './routes/SourcesRoute';
import CollectionViewRoute from './routes/CollectionViewRoute';
import SourceViewRoute from './routes/SourceViewRoute';
import FiltersRoute from './routes/FiltersRoute';
import FilterCreateRoute from './routes/FilterCreateRoute';
import FilterEditRoute from './routes/FilterEditRoute';
import FilterViewRoute from './routes/FilterViewRoute';
import collections from '../test/fixtures/metadatacollections';
import sources from '../test/fixtures/metadatasources';
import filters from '../test/fixtures/filters';
import collection from '../test/fixtures/metadatacollection';
import source from '../test/fixtures/metadatasource';
import filter from '../test/fixtures/filter';
import FincSelect from './index';

const routeProps = {
  history: {
    push: () => jest.fn()
  },
  match: {
    params: {
      id: '9a2427cd-4110-4bd9-b6f9-e3475631bbac',
    },
  },
  location: {},
  mutator: {
    query: { update: noop },
  },
  resources: { collections, sources, filters }
};

const createRouteProps = {
  history: {
    push: () => jest.fn()
  },
  location: {
    search: '',
  },
  mutator: {
    filters: { POST: jest.fn().mockReturnValue(Promise.resolve()) },
    collectionsIds: { POST: jest.fn().mockReturnValue(Promise.resolve()) },
  },
};

const editRouteProps = {
  history: {
    push: () => jest.fn()
  },
  location: {
    search: '',
  },
  match: {
    params: {
      id: '9a2427cd-4110-4bd9-b6f9-e3475631bbac',
    }
  },
  resources: {
    filter: { filter },
  },
};

const viewRouteProps = {
  history: {
    action: 'PUSH',
    block: jest.fn(),
    createHref: jest.fn(),
    go: jest.fn(),
    listen: jest.fn(),
    location: {
      hash: '',
      pathname: '',
      search: '',
    },
    push: () => jest.fn(),
    replace: () => jest.fn(),
  },
  location: {
    hash: '',
    pathname: '',
    search: '',
  },
  match: {
    params: {
      id: '9a2427cd-4110-4bd9-b6f9-e3475631bbac',
    }
  },
  resources: {
    collection: { collection },
    source: { source },
    filter: { filter },
  },
};

const match = {
  isExact: false,
  params: {},
  path: '/finc-select',
  url: '/finc-select',
};

const renderWithRouter = (component) => {
  const history = createMemoryHistory();
  return {
    ...renderWithIntl(
      <Router history={history}>
        {component}
      </Router>
    )
  };
};

jest.mock('./index', () => {
  return () => <span>FincSelect</span>;
});

it('should render CollectionsRoute', () => {
  const renderComponent = renderWithRouter(<CollectionsRoute {...routeProps} />);

  const { getByTestId } = renderComponent;
  expect(getByTestId('collections')).toBeInTheDocument();
  expect(screen.getByText('Metadata collections')).toBeInTheDocument();
});

it('should render SourcesRoute', () => {
  const renderComponent = renderWithRouter(<SourcesRoute {...routeProps} />);

  const { getByTestId } = renderComponent;
  expect(getByTestId('sources')).toBeInTheDocument();
  expect(screen.getByText('Metadata sources')).toBeInTheDocument();
});

it('should render FiltersRoute', () => {
  const renderComponent = renderWithRouter(<FiltersRoute {...routeProps} />);

  const { getByTestId } = renderComponent;
  expect(getByTestId('filters')).toBeInTheDocument();
});

it('should render FilterCreateRoute', () => {
  renderWithRouter(<FilterCreateRoute {...createRouteProps} />);

  expect(document.querySelector('#form-filter')).toBeInTheDocument();
  expect(screen.getByText('Create')).toBeInTheDocument();
});

it('should render FilterEditRoute', () => {
  renderWithRouter(<FilterEditRoute {...editRouteProps} />);

  expect(document.querySelector('#form-filter')).toBeInTheDocument();
});

it('should render SourceViewRoute', () => {
  renderWithRouter(<SourceViewRoute {...viewRouteProps} />);

  expect(document.querySelector('#pane-sourcedetails')).toBeInTheDocument();
});

it('should render CollectionViewRoute', () => {
  renderWithRouter(<CollectionViewRoute {...viewRouteProps} />);

  expect(document.querySelector('#pane-collectiondetails')).toBeInTheDocument();
});

it('should render FilterViewRoute', () => {
  renderWithRouter(<FilterViewRoute {...viewRouteProps} />);

  expect(document.querySelector('#pane-filterdetails')).toBeInTheDocument();
});

describe('Application root', () => {
  it('should render without crashing', () => {
    const { getByText } = renderWithRouter(<FincSelect match={match} />);
    const div = document.createElement('div');
    div.id = 'root';
    document.body.appendChild(div);
    expect(getByText('FincSelect')).toBeDefined();
  });
});

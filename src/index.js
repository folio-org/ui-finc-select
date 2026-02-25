import PropTypes from 'prop-types';
import { Switch } from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';

import { Route } from '@folio/stripes/core';

import CollectionsRoute from './routes/CollectionsRoute';
import CollectionViewRoute from './routes/CollectionViewRoute';
import FilterCreateRoute from './routes/FilterCreateRoute';
import FilterEditRoute from './routes/FilterEditRoute';
import FiltersRoute from './routes/FiltersRoute';
import FilterViewRoute from './routes/FilterViewRoute';
import SourcesRoute from './routes/SourcesRoute';
import SourceViewRoute from './routes/SourceViewRoute';
import Settings from './settings';

const FincSelect = ({
  actAs,
  match,
  ...props
}) => {
  if (actAs === 'settings') {
    return (
      <Settings
        match={match}
        {...props}
      />
    );
  }

  return (
    <Switch>
      <Route component={SourcesRoute} path={`${match.path}/metadata-sources/:id?`}>
        <Route component={SourceViewRoute} path={`${match.path}/metadata-sources/:id`} />
      </Route>
      <Route component={CollectionsRoute} path={`${match.path}/metadata-collections/:id?`}>
        <Route component={CollectionViewRoute} path={`${match.path}/metadata-collections/:id`} />
      </Route>
      <Route component={FilterCreateRoute} path={`${match.path}/filters/create`} />
      <Route component={FilterEditRoute} path={`${match.path}/filters/:id/edit`} />
      <Route component={FiltersRoute} path={`${match.path}/filters/:id?`}>
        <Route component={FilterViewRoute} path={`${match.path}/filters/:id`} />
      </Route>
    </Switch>
  );
};

FincSelect.propTypes = {
  actAs: PropTypes.string.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
};

export default FincSelect;

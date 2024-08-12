import ReactRouterPropTypes from 'react-router-prop-types';
import PropTypes from 'prop-types';
import { Switch } from 'react-router-dom';

import { Route } from '@folio/stripes/core';

import SourcesRoute from './routes/SourcesRoute';
import SourceViewRoute from './routes/SourceViewRoute';
import CollectionsRoute from './routes/CollectionsRoute';
import CollectionViewRoute from './routes/CollectionViewRoute';
import FiltersRoute from './routes/FiltersRoute';
import FilterViewRoute from './routes/FilterViewRoute';
import FilterEditRoute from './routes/FilterEditRoute';
import FilterCreateRoute from './routes/FilterCreateRoute';

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
      <Route path={`${match.path}/metadata-sources/:id?`} component={SourcesRoute}>
        <Route path={`${match.path}/metadata-sources/:id`} component={SourceViewRoute} />
      </Route>
      <Route path={`${match.path}/metadata-collections/:id?`} component={CollectionsRoute}>
        <Route path={`${match.path}/metadata-collections/:id`} component={CollectionViewRoute} />
      </Route>
      <Route path={`${match.path}/filters/create`} component={FilterCreateRoute} />
      <Route path={`${match.path}/filters/:id/edit`} component={FilterEditRoute} />
      <Route path={`${match.path}/filters/:id?`} component={FiltersRoute}>
        <Route path={`${match.path}/filters/:id`} component={FilterViewRoute} />
      </Route>
    </Switch>
  );
};

FincSelect.propTypes = {
  actAs: PropTypes.string.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
};

export default FincSelect;

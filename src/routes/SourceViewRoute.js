import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { get } from 'lodash';

import { stripesConnect } from '@folio/stripes/core';

import urls from '../components/DisplayUtils/urls';
import MetadataSourceView from '../components/MetadataSources/MetadataSourceView';

const SourceViewRoute = ({
  history,
  location,
  match,
  resources,
  stripes,
}) => {
  const handleClose = () => {
    history.push(`${urls.sources()}${location.search}`);
  };

  return (
    <MetadataSourceView
      handlers={{ onClose: handleClose }}
      history={history}
      isLoading={get(resources, 'source.isPending', true)}
      record={get(resources, 'source.records', []).find(i => i.id === match.params.id)}
      stripes={stripes}
    />
  );
};

SourceViewRoute.manifest = Object.freeze({
  source: {
    type: 'okapi',
    path: 'finc-select/metadata-sources/:{id}',
  },
  query: {},
});

SourceViewRoute.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  resources: PropTypes.shape({
    source: PropTypes.object,
  }).isRequired,
  stripes: PropTypes.shape({
    connect: PropTypes.func.isRequired,
    hasPerm: PropTypes.func.isRequired,
    okapi: PropTypes.object.isRequired,
  }).isRequired,
};

export default stripesConnect(SourceViewRoute);

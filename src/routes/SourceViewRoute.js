import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';

import { stripesConnect } from '@folio/stripes/core';

import urls from '../components/DisplayUtils/urls';
import MetadataSourceView from '../components/MetadataSources/MetadataSourceView';

class SourceViewRoute extends React.Component {
  static manifest = Object.freeze({
    source: {
      type: 'okapi',
      path: 'finc-select/metadata-sources/:{id}',
    },
    query: {},
  });

  static propTypes = {
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

  handleClose = () => {
    const { location } = this.props;
    this.props.history.push(`${urls.sources()}${location.search}`);
  }

  getRecord = (id) => {
    return _.get(this.props.resources, 'sources.records', [])
      .find(i => i.id === id);
  }

  render() {
    const { stripes } = this.props;

    return (
      <MetadataSourceView
        handlers={{ onClose: this.handleClose }}
        isLoading={_.get(this.props.resources, 'source.isPending', true)}
        record={_.get(this.props.resources, 'source.records', []).find(i => i.id === this.props.match.params.id)}
        stripes={stripes}
      />
    );
  }
}

export default stripesConnect(SourceViewRoute);

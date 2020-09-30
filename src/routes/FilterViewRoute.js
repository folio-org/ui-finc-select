import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';

import { stripesConnect } from '@folio/stripes/core';

import urls from '../components/DisplayUtils/urls';
import FilterView from '../components/Filters/FilterView';

class FilterViewRoute extends React.Component {
  static manifest = Object.freeze({
    filter: {
      type: 'okapi',
      path: 'finc-select/filters/:{id}',
    },
    collectionsIds: {
      type: 'okapi',
      path: 'finc-select/filters/:{id}/collections',
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
      filter: PropTypes.object,
      collectionsIds: PropTypes.object,
    }).isRequired,
    stripes: PropTypes.shape({
      hasPerm: PropTypes.func.isRequired,
      okapi: PropTypes.object.isRequired,
    }).isRequired,
  };

  handleClose = () => {
    const { location } = this.props;
    this.props.history.push(`${urls.filters()}${location.search}`);
  }

  handleEdit = () => {
    const { location, match } = this.props;
    this.props.history.push(`${urls.filterEdit(match.params.id)}${location.search}`);
  }

  getRecord = (id) => {
    return _.get(this.props.resources, 'filters.records', [])
      .find(i => i.id === id);
  }

  render() {
    const { stripes } = this.props;
    const collectionIds = _.get(this.props.resources, 'collectionsIds.records', []);

    return (
      <FilterView
        canEdit={stripes.hasPerm('finc-select.filters.item.put')}
        collectionIds={collectionIds}
        handlers={{
          onClose: this.handleClose,
          onEdit: this.handleEdit,
        }}
        isLoading={_.get(this.props.resources, 'filter.isPending', true)}
        record={_.get(this.props.resources, 'filter.records', []).find(i => i.id === this.props.match.params.id)}
        stripes={stripes}
      />
    );
  }
}

export default stripesConnect(FilterViewRoute);

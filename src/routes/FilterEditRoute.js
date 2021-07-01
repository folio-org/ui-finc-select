import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { stripesConnect } from '@folio/stripes/core';

import FilterForm from '../components/Filters/FilterForm';
import urls from '../components/DisplayUtils/urls';
import saveCollectionIds from './utilities/saveCollectionIds';

class FilterEditRoute extends React.Component {
  static manifest = Object.freeze({
    filters: {
      type: 'okapi',
      path: 'finc-select/filters/:{id}',
      shouldRefresh: () => false,
    },
    collectionsIds: {
      type: 'okapi',
      path: 'finc-select/filters/:{id}/collections',
    },
    mdSources: {
      type: 'okapi',
      records: 'tinyMetadataSources',
      path: 'finc-config/tiny-metadata-sources',
      resourceShouldRefresh: true
    },
  });

  static propTypes = {
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    location: PropTypes.shape({
      search: PropTypes.string.isRequired,
    }).isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
    mutator: PropTypes.shape({
      filters: PropTypes.shape({
        PUT: PropTypes.func.isRequired,
        DELETE: PropTypes.func.isRequired,
      }).isRequired,
      collectionsIds: PropTypes.shape({
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
  }

  constructor(props) {
    super(props);

    this.state = {
      hasPerms: props.stripes.hasPerm('finc-select.filters.item.put')
    };
  }

  getInitialValues = () => {
    const initialValues = _.get(this.props.resources, 'filters.records', []).find(i => i.id === this.props.match.params.id);

    return initialValues;
  }

  handleClose = () => {
    const { location, match } = this.props;
    this.props.history.push(`${urls.filterView(match.params.id)}${location.search}`);
  }

  handleSubmit = (filter) => {
    const { history, location, mutator } = this.props;
    const collectionIdsForSave = filter.collectionIds;
    // remove collectionIds for saving filter
    const filterForSave = _.omit(filter, ['collectionIds']);

    mutator.filters
      .PUT(filterForSave)
      .then(({ id }) => {
        if (collectionIdsForSave) {
          saveCollectionIds(id, collectionIdsForSave, this.props.stripes.okapi);
        }
        history.push(`${urls.filterView(id)}${location.search}`);
      });
  }

  deleteFilter = (filter) => {
    const { history, location, mutator } = this.props;

    mutator.filters.DELETE({ filter }).then(() => {
      history.push(`${urls.filters()}${location.search}`);
    });
  }

  fetchIsPending = () => {
    return Object.values(this.props.resources)
      .filter(resource => resource)
      .some(resource => resource.isPending);
  }

  render() {
    const { resources, stripes } = this.props;
    const collectionIds = _.get(this.props.resources, 'collectionsIds.records', []);

    if (!this.state.hasPerms) return <div><FormattedMessage id="ui-finc-select.noPermission" /></div>;
    if (this.fetchIsPending()) return 'loading';

    return (
      <FilterForm
        collectionIds={collectionIds}
        contentData={resources}
        filterData={{ mdSources: _.get(this.props.resources, 'mdSources.records', []) }}
        handlers={{ onClose: this.handleClose }}
        initialValues={this.getInitialValues()}
        isLoading={this.fetchIsPending()}
        onDelete={this.deleteFilter}
        onSubmit={this.handleSubmit}
        stripes={stripes}
        selectRecords={this.getSelectedCollections}
      />
    );
  }
}

export default stripesConnect(FilterEditRoute);

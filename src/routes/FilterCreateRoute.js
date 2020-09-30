import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { stripesConnect } from '@folio/stripes/core';

import FilterForm from '../components/Filters/FilterForm';
import urls from '../components/DisplayUtils/urls';
import saveCollectionIds from './utilities/saveCollectionIds';

class FilterCreateRoute extends React.Component {
  static manifest = Object.freeze({
    filters: {
      type: 'okapi',
      path: 'finc-select/filters',
      fetch: false,
      shouldRefresh: () => false,
    },
    collectionsIds: {
      type: 'okapi',
      path: 'finc-select/filters/:{id}/collections',
    },
  });

  static propTypes = {
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    location: PropTypes.shape({
      search: PropTypes.string.isRequired,
    }).isRequired,
    mutator: PropTypes.shape({
      filters: PropTypes.shape({
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
      hasPerms: props.stripes.hasPerm('finc-select.filters.item.post'),
    };
  }

  handleClose = () => {
    const { location } = this.props;
    this.props.history.push(`${urls.filters()}${location.search}`);
  }

  handleSubmit = (filter) => {
    const { history, location, mutator } = this.props;
    const collectionIdsForSave = filter.collectionIds;
    const filterForSave = _.omit(filter, ['collectionIds']);

    // THIS IS WHERE THE FUCKING PROBLEM IS: filter object has no collectionIds
    mutator.filters
      .POST(filterForSave)
      .then(({ id }) => {
        saveCollectionIds(id, collectionIdsForSave, this.props.stripes.okapi);
        history.push(`${urls.filterView(id)}${location.search}`);
      });
  }

  render() {
    const { resources, stripes } = this.props;
    const collectionIds = [];

    if (!this.state.hasPerms) return <div><FormattedMessage id="ui-finc-select.noPermission" /></div>;

    return (
      <FilterForm
        contentData={resources}
        collectionIds={collectionIds}
        handlers={{ onClose: this.handleClose }}
        onSubmit={this.handleSubmit}
        stripes={stripes}
        selectRecords={this.getSelectedCollections}
      />
    );
  }
}

export default stripesConnect(FilterCreateRoute);

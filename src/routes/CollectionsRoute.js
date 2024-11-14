import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';

import { stripesConnect } from '@folio/stripes/core';
import {
  makeQueryFunction,
  StripesConnectedSource,
} from '@folio/stripes/smart-components';

import urls from '../components/DisplayUtils/urls';
import MetadataCollections from '../components/MetadataCollections/MetadataCollections';
import filterConfig from '../components/MetadataCollections/filterConfigData';

const INITIAL_RESULT_COUNT = 30;
const RESULT_COUNT_INCREMENT = 30;

class CollectionsRoute extends React.Component {
  static manifest = Object.freeze({
    collections: {
      type: 'okapi',
      records: 'fincSelectMetadataCollections',
      recordsRequired: '%{resultCount}',
      perRequest: 30,
      path: 'finc-select/metadata-collections',
      resourceShouldRefresh: true,
      GET: {
        params: {
          query: makeQueryFunction(
            'cql.allRecords=1',
            '(label="%{query.query}*" or description="%{query.query}*" or collectionId="%{query.query}*")',
            {
              'label': 'label',
              'description': 'description',
              'collectionId': 'collectionId',
            },
            filterConfig,
            2,
          ),
        },
        staticFallback: { params: {} },
      },
    },
    source: {
      type: 'okapi',
      records: 'fincSelectMetadataSources',
      path: 'finc-select/metadata-sources',
      resourceShouldRefresh: true
    },
    // get for the filter all sources but just the tiny with name and id
    mdSources: {
      type: 'okapi',
      records: 'tinyMetadataSources',
      path: 'finc-config/tiny-metadata-sources',
      resourceShouldRefresh: true
    },
    query: { initialValue: {} },
    resultCount: { initialValue: INITIAL_RESULT_COUNT },
  });

  static propTypes = {
    children: PropTypes.node,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    location: PropTypes.shape({
      search: PropTypes.string,
    }).isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string,
      }),
    }),
    mutator: PropTypes.object,
    resources: PropTypes.object,
    stripes: PropTypes.shape({
      hasPerm: PropTypes.func.isRequired,
      logger: PropTypes.object,
    }),
  }

  constructor(props) {
    super(props);

    this.logger = props.stripes.logger;
    this.searchField = React.createRef();

    this.state = {};
  }

  componentDidMount() {
    this.collection = new StripesConnectedSource(this.props, this.logger, 'collections');

    if (this.searchField.current) {
      this.searchField.current.focus();
    }
  }

  componentDidUpdate(prevProps) {
    const newCount = this.collection.totalCount();
    const newRecords = this.collection.records();

    if (newCount === 1) {
      const { history, location } = this.props;

      const prevSource = new StripesConnectedSource(prevProps, this.logger, 'collections');
      const oldCount = prevSource.totalCount();
      const oldRecords = prevSource.records();

      if (oldCount !== 1 || (oldCount === 1 && oldRecords[0].id !== newRecords[0].id)) {
        const record = newRecords[0];
        history.push(`${urls.collectionView(record.id)}${location.search}`);
      }
    }
  }

  querySetter = ({ nsValues }) => {
    this.props.mutator.query.update(nsValues);
  }

  queryGetter = () => {
    return _.get(this.props.resources, 'query', {});
  }

  handleNeedMoreData = () => {
    if (this.collection) {
      this.collection.fetchMore(RESULT_COUNT_INCREMENT);
    }
  };

  render() {
    const { location, match, children } = this.props;

    if (this.collection) {
      this.collection.update(this.props, 'collections');
    }

    return (
      <MetadataCollections
        contentData={_.get(this.props.resources, 'collections.records', [])}
        filterData={{
          mdSources: _.get(this.props.resources, 'mdSources.records', []),
        }}
        onNeedMoreData={this.handleNeedMoreData}
        queryGetter={this.queryGetter}
        querySetter={this.querySetter}
        searchString={location.search}
        selectedRecordId={match.params.id}
        collection={this.collection}
      >
        {children}
      </MetadataCollections>
    );
  }
}

export default stripesConnect(CollectionsRoute);

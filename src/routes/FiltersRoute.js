import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';

import { stripesConnect } from '@folio/stripes/core';
import {
  makeQueryFunction,
  StripesConnectedSource,
} from '@folio/stripes/smart-components';

import urls from '../components/DisplayUtils/urls';
import Filters from '../components/Filters/Filters';
import filterConfig from '../components/Filters/filterConfigData';

const INITIAL_RESULT_COUNT = 30;
const RESULT_COUNT_INCREMENT = 30;

class FiltersRoute extends React.Component {
  static manifest = Object.freeze({
    filters: {
      type: 'okapi',
      records: 'fincSelectFilters',
      recordsRequired: '%{resultCount}',
      perRequest: 30,
      path: 'finc-select/filters',
      resourceShouldRefresh: true,
      GET: {
        params: {
          query: makeQueryFunction(
            'cql.allRecords=1',
            '(label="%{query.query}*")',
            {
              'Filter Name': 'label'
            },
            filterConfig,
            2,
          ),
        },
        staticFallback: { params: {} },
      },
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
    this.filter = new StripesConnectedSource(this.props, this.logger, 'filters');

    if (this.searchField.current) {
      this.searchField.current.focus();
    }
  }

  componentDidUpdate(prevProps) {
    const newCount = this.filter.totalCount();
    const newRecords = this.filter.records();

    if (newCount === 1) {
      const { history, location } = this.props;

      const prevSource = new StripesConnectedSource(prevProps, this.logger, 'filters');
      const oldCount = prevSource.totalCount();
      const oldRecords = prevSource.records();

      if (oldCount !== 1 || (oldCount === 1 && oldRecords[0].id !== newRecords[0].id)) {
        const record = newRecords[0];
        history.push(`${urls.filterView(record.id)}${location.search}`);
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
    if (this.filter) {
      this.filter.fetchMore(RESULT_COUNT_INCREMENT);
    }
  };

  render() {
    const { location, match, children } = this.props;

    if (this.filter) {
      this.filter.update(this.props, 'filters');
    }

    return (
      <Filters
        contentData={_.get(this.props.resources, 'filters.records', [])}
        filter={this.filter}
        onNeedMoreData={this.handleNeedMoreData}
        queryGetter={this.queryGetter}
        querySetter={this.querySetter}
        searchString={location.search}
        selectedRecordId={match.params.id}
      >
        {children}
      </Filters>
    );
  }
}

export default stripesConnect(FiltersRoute);

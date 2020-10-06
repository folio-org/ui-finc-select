import React from 'react';
import { FormattedMessage } from 'react-intl';

const filterConfig = [
  {
    name: 'status',
    cql: 'status',
    values: [
      { name: <FormattedMessage id="ui-finc-select.filterValue.active" />, cql: 'active' },
      { name: <FormattedMessage id="ui-finc-select.filterValue.request" />, cql: 'request' },
      { name: <FormattedMessage id="ui-finc-select.filterValue.implementation" />, cql: 'implementation' },
      { name: <FormattedMessage id="ui-finc-select.filterValue.closed" />, cql: 'closed' },
      { name: <FormattedMessage id="ui-finc-select.filterValue.impossible" />, cql: 'impossible' }
    ],
  },
  {
    name: 'selected',
    cql: 'selected',
    values: [
      { name: <FormattedMessage id="ui-finc-select.filterValue.all" />, cql: 'all' },
      { name: <FormattedMessage id="ui-finc-select.filterValue.some" />, cql: 'some' },
      { name: <FormattedMessage id="ui-finc-select.filterValue.none" />, cql: 'none' },
    ],
  }
];

export default filterConfig;

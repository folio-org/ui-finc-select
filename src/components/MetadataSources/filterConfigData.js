import React from 'react';
import { FormattedMessage } from 'react-intl';

const filterConfig = [
  {
    name: 'status',
    cql: 'status',
    values: [
      { name: <FormattedMessage id="ui-finc-select.dataOption.active" />, cql: 'active' },
      { name: <FormattedMessage id="ui-finc-select.dataOption.request" />, cql: 'request' },
      { name: <FormattedMessage id="ui-finc-select.dataOption.implementation" />, cql: 'implementation' },
      { name: <FormattedMessage id="ui-finc-select.dataOption.closed" />, cql: 'closed' },
      { name: <FormattedMessage id="ui-finc-select.dataOption.impossible" />, cql: 'impossible' }
    ],
  },
  {
    name: 'selected',
    cql: 'selected',
    values: [
      { name: <FormattedMessage id="ui-finc-select.dataOption.all" />, cql: 'all' },
      { name: <FormattedMessage id="ui-finc-select.dataOption.some" />, cql: 'some' },
      { name: <FormattedMessage id="ui-finc-select.dataOption.none" />, cql: 'none' },
    ],
  }
];

export default filterConfig;

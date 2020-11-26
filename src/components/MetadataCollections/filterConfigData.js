import React from 'react';
import { FormattedMessage } from 'react-intl';

const filterConfig = [
  {
    name: 'selected',
    cql: 'selected',
    operator: '=',
    values: [
      { name: <FormattedMessage id="ui-finc-select.dataOption.yes" />, cql: 'yes' },
      { name: <FormattedMessage id="ui-finc-select.dataOption.no" />, cql: 'no' }
    ],
  },
  {
    name: 'freeContent',
    cql: 'freeContent',
    values: [
      { name: <FormattedMessage id="ui-finc-select.dataOption.yes" />, cql: 'yes' },
      { name: <FormattedMessage id="ui-finc-select.dataOption.no" />, cql: 'no' },
      { name: <FormattedMessage id="ui-finc-select.dataOption.undetermined" />, cql: 'undetermined' }
    ],
  },
  {
    name: 'permitted',
    cql: 'permitted',
    operator: '=',
    values: [
      { name: <FormattedMessage id="ui-finc-select.dataOption.yes" />, cql: 'yes' },
      { name: <FormattedMessage id="ui-finc-select.dataOption.no" />, cql: 'no' }
    ],
  },
  {
    name: 'mdSource',
    cql: 'mdSource.id',
    operator: '==',
    values: [],
  }
];

export default filterConfig;

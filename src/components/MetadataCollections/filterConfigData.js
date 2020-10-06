import React from 'react';
import { FormattedMessage } from 'react-intl';

const filterConfig = [
  {
    name: 'selected',
    cql: 'selected',
    values: [
      { name: <FormattedMessage id="ui-finc-select.filterValue.yes" />, cql: 'yes' },
      { name: <FormattedMessage id="ui-finc-select.filterValue.no" />, cql: 'no' }
    ],
  },
  {
    name: 'freeContent',
    cql: 'freeContent',
    values: [
      { name: <FormattedMessage id="ui-finc-select.filterValue.yes" />, cql: 'yes' },
      { name: <FormattedMessage id="ui-finc-select.filterValue.no" />, cql: 'no' },
      { name: <FormattedMessage id="ui-finc-select.filterValue.undetermined" />, cql: 'undetermined' }
    ],
  },
  {
    name: 'permitted',
    cql: 'permitted',
    values: [
      { name: <FormattedMessage id="ui-finc-select.filterValue.yes" />, cql: 'yes' },
      { name: <FormattedMessage id="ui-finc-select.filterValue.no" />, cql: 'no' }
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

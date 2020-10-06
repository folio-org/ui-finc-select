import React from 'react';
import { FormattedMessage } from 'react-intl';

const filterConfig = [
  {
    name: 'type',
    cql: 'type',
    values: [
      { name: <FormattedMessage id="ui-finc-select.filterValue.whitelist" />, cql: 'Whitelist' },
      { name: <FormattedMessage id="ui-finc-select.filterValue.blacklist" />, cql: 'Blacklist' }
    ],
  }
];

export default filterConfig;

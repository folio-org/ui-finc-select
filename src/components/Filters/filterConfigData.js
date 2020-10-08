import React from 'react';
import { FormattedMessage } from 'react-intl';

const filterConfig = [
  {
    name: 'type',
    cql: 'type',
    values: [
      { name: <FormattedMessage id="ui-finc-select.dataOption.Whitelist" />, cql: 'Whitelist' },
      { name: <FormattedMessage id="ui-finc-select.dataOption.Blacklist" />, cql: 'Blacklist' }
    ],
  }
];

export default filterConfig;

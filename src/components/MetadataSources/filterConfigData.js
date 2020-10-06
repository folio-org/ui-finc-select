const filterConfig = [
  {
    name: 'status',
    cql: 'status',
    values: [
      { name: 'Active', cql: 'active' },
      { name: 'Request', cql: 'request' },
      { name: 'Implementation', cql: 'implementation' },
      { name: 'Closed', cql: 'closed' },
      { name: 'Impossible', cql: 'impossible' }
    ],
  },
  {
    name: 'selected',
    cql: 'selected',
    values: [
      { name: 'All', cql: 'all' },
      { name: 'Some', cql: 'some' },
      { name: 'None', cql: 'none' },
    ],
  }
];

export default filterConfig;

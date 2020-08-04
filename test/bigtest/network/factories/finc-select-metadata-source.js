import { faker, trait } from '@bigtest/mirage';

import Factory from './application';

export default Factory.extend({
  id: () => faker.random.uuid(),
  label: (i) => 'SOURCE ' + i,
  description: (i) => 'description' + i,
  status: '',
  organization: {
    id: '',
    name: ''
  },
  contacts: {
    internal: [],
    external: [],
  },
  indexingLevel: '',
  generalNotes: '',
  contracts: [],
  lastProcessed: '',
  tickets: [],
  accessUrl: '',
  sourceId: 1,
  solrShard: '',
  deliveryMethods: [],
  formats: [],
  updateRhythm: '',
  inferiorTo: [],
  selected: '',
  withOrganizations: trait({
    afterCreate(organizations, server) {
      server.createList('finc-select-organization', 9, { organizations });
    }
  }),
});

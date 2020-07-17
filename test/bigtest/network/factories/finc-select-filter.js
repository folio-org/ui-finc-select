import faker from 'faker';
import { trait } from 'miragejs';

import Factory from './application';

export default Factory.extend({
  id: () => faker.random.uuid(),
  label: (i) => 'FILTER ' + i,
  type: '',
  filterFiles: [{
    label: '',
    criteria: '',
    fileId: '',
  }],

  withFilterFile: trait({
    afterCreate(file, server) {
      server.createList('finc-select-filter-file', 9, { file });
    }
  })
});

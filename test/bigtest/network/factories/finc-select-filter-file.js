import faker from 'faker';

import Factory from './application';

export default Factory.extend({
  id: () => faker.random.uuid(),
  label: (i) => 'FILE ' + i,
  criteria: '',
  // fileId: '',
  filename: '',
});

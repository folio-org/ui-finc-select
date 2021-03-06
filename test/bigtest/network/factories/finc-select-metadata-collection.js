import faker from 'faker';

import Factory from './application';

export default Factory.extend({
  id: () => faker.random.uuid(),
  label: (i) => 'COLLECTION ' + i,
  description: (i) => 'description' + i,
  mdSource: {
    id: 'uuid-1234',
    name: 'mdSource name'
  },
  metadataAvailable: '',
  usageRestricted: '',
  permitted: '',
  freeContent: '',
  lod: {
    publication: '',
    note: ''
  },
  collectionId: '',
  tickets: [],
  contentFiles: [],
  solrMegaCollections: [],
  selected: '',
});

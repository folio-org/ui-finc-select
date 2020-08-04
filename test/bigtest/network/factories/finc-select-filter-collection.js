
import { faker } from '@bigtest/mirage';

import Factory from './application';

export default Factory.extend({
  id: () => faker.random.uuid(),
});

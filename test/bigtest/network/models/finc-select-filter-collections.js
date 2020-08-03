import {
  belongsTo,
  Model,
} from '@bigtest/mirage';

export default Model.extend({
  collectionIds: belongsTo('finc-select-filter'),
});

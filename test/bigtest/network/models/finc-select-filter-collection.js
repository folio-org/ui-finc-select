import {
  belongsTo,
  Model,
} from 'miragejs';

export default Model.extend({
  collectionIds: belongsTo('finc-select-filter'),
});

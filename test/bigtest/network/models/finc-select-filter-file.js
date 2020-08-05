import {
  belongsTo,
  Model,
} from 'miragejs';

export default Model.extend({
  file: belongsTo('finc-select-filter'),
});

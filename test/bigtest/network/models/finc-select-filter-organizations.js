import {
  belongsTo,
  Model,
} from 'miragejs';

export default Model.extend({
  organizations: belongsTo('finc-select-metadata-source'),
});

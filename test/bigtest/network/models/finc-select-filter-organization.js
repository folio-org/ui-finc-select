import {
  belongsTo,
  Model,
} from 'miragejs';

export default Model.extend({
  organization: belongsTo('finc-select-metadata-source'),
});

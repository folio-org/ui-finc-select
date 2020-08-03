import {
  belongsTo,
  Model,
} from '@bigtest/mirage';

export default Model.extend({
  organizations: belongsTo('finc-select-metadata-source'),
});

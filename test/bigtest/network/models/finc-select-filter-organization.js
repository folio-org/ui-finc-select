import {
  belongsTo,
  Model,
} from '@bigtest/mirage';

export default Model.extend({
  organization: belongsTo('finc-select-metadata-source'),
});

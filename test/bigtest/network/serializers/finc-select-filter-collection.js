import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({

  serialize(...args) {
    const json = ApplicationSerializer.prototype.serialize.apply(this, args);

    const { collectionIds = [] } = json;

    json.totalRecords = collectionIds.length;

    return json;
  }

});

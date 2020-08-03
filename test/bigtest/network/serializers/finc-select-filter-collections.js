import ApplicationSerializer from './application';

// const { isArray } = Array;
// const { assign } = Object;

export default ApplicationSerializer.extend({

  serialize(...args) {
    const json = ApplicationSerializer.prototype.serialize.apply(this, args);

    const { collectionIds = [] } = json;

    json.totalRecords = collectionIds.length;

    return json;

    // if (isArray(json.fincSelectFilterCollections)) {
    //   return assign({}, json, {
    //     totalRecords: json.fincSelectFilterCollections.length
    //   });
    // } else {
    //   return json.fincSelectFilterCollections;
    // }
  }

});

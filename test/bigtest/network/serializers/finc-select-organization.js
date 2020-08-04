import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({

  serialize(...args) {
    const json = ApplicationSerializer.prototype.serialize.apply(this, args);

    const { organizations = [] } = json;

    json.totalRecords = organizations.length;

    return json;
  }

});

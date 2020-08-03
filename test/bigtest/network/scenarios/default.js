/* istanbul ignore file */

// default scenario is used during `yarn start --mirage`
export default function defaultScenario(server) {
  server.create('finc-select-metadata-source', 'withOrganizations');
  server.create('finc-select-metadata-collection');
  server.create('finc-select-filter', 'withFilterFile', 'withFilterCollections');
  server.create('tiny-metadata-source');
}

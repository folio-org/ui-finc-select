const urls = {
  sources: () => '/finc-select/metadata-sources',
  sourceView: id => `/finc-select/metadata-sources/${id}`,

  collections: () => '/finc-select/metadata-collections',
  collectionView: id => `/finc-select/metadata-collections/${id}`,

  showAllCollections: (sourceId) => `/finc-select/metadata-collections?filters=mdSource.${sourceId}`,
  showSelectedCollections: (sourceId) => `/finc-select/metadata-collections?filters=mdSource.${sourceId},selected.yes`,

  filters: () => '/finc-select/filters',
  filterView: id => `/finc-select/filters/${id}`,
  filterEdit: id => `/finc-select/filters/${id}/edit`,
  filterCreate: () => '/finc-select/filters/create',

  organizationView: id => `/organizations/view/${id}`,
};

export default urls;

export const API_COLLECTIONS = 'finc-config/metadata-collections';
export const API_COLLECTIONS_BY_FILTER_ID = (filterId) => `finc-select/filters/${filterId}/collections`;
export const API_COLLECTIONS_SELECT_ALL_BY_SOURCE_ID = (sourceId) => `finc-select/metadata-sources/${sourceId}/collections/select-all`;
export const API_EZB_CREDENTIALS = 'finc-select/ezb-credentials';
export const API_FILTERS = 'finc-select/filters';
export const API_ORGANIZATIONS = 'organizations-storage/organizations';
export const API_ORGANIZATION_BY_ID = (organizationId) => `organizations-storage/organizations/${organizationId}`;
export const API_SOURCES = 'finc-select/metadata-sources';
export const API_TINY_SOURCES = 'finc-config/tiny-metadata-sources';

export const QK_COLLECTIONS = 'collections';
export const QK_EZB_CREDENTIALS = 'ezbCredentials';
export const QK_FILTERS = 'filters';
export const QK_ORGANIZATIONS = 'organizations';
export const QK_SOURCES = 'sources';
export const QK_TINY_SOURCES = 'tiny-sources';

import fetchWithDefaultOptions from '../../components/DisplayUtils/fetchWithDefaultOptions';

export default (filterId, collectionIds, okapi) => {
  return fetchWithDefaultOptions(okapi, `/finc-select/filters/${filterId}/collections`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ collectionIds }),
  });
};

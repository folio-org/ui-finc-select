import urls from './urls';

describe('urls module', () => {
  test('sources should return the correct path', () => {
    expect(urls.sources()).toBe('/finc-select/metadata-sources');
  });

  test('sourceView should return the correct path with id', () => {
    const id = '123';
    expect(urls.sourceView(id)).toBe(`/finc-select/metadata-sources/${id}`);
  });

  test('collections should return the correct path', () => {
    expect(urls.collections()).toBe('/finc-select/metadata-collections');
  });

  test('collectionView should return the correct path with id', () => {
    const id = '456';
    expect(urls.collectionView(id)).toBe(`/finc-select/metadata-collections/${id}`);
  });

  test('showAllCollections should return the correct path with sourceId', () => {
    const sourceId = '789';
    expect(urls.showAllCollections(sourceId)).toBe(`/finc-select/metadata-collections?filters=mdSource.${sourceId}`);
  });

  test('showSelectedCollections should return the correct path with sourceId', () => {
    const sourceId = '789';
    expect(urls.showSelectedCollections(sourceId)).toBe(`/finc-select/metadata-collections?filters=mdSource.${sourceId},selected.yes`);
  });

  test('filters should return the correct path', () => {
    expect(urls.filters()).toBe('/finc-select/filters');
  });

  test('filterView should return the correct path with id', () => {
    const id = '321';
    expect(urls.filterView(id)).toBe(`/finc-select/filters/${id}`);
  });

  test('filterEdit should return the correct path with id', () => {
    const id = '654';
    expect(urls.filterEdit(id)).toBe(`/finc-select/filters/${id}/edit`);
  });

  test('filterCreate should return the correct path', () => {
    expect(urls.filterCreate()).toBe('/finc-select/filters/create');
  });

  test('organizationView should return the correct path with id', () => {
    const id = '987';
    expect(urls.organizationView(id)).toBe(`/organizations/view/${id}`);
  });
});

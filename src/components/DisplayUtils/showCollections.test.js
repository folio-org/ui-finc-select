import doShowCollections from './showCollections';
import urls from './urls';

describe('doShowCollections', () => {
  const sourceId = 'testSource';
  const mockHistory = { push: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should navigate to showSelectedCollections if showSelected is true', () => {
    jest.spyOn(urls, 'showSelectedCollections').mockReturnValue(`/finc-select/metadata-collections?filters=mdSource.${sourceId},selected.yes`);

    doShowCollections(mockHistory, sourceId, true);

    expect(mockHistory.push).toHaveBeenCalledWith(`/finc-select/metadata-collections?filters=mdSource.${sourceId},selected.yes`);
  });

  it('should navigate to showAllCollections if showSelected is false', () => {
    jest.spyOn(urls, 'showAllCollections').mockReturnValue(`/finc-select/metadata-collections?filters=mdSource.${sourceId}`);

    doShowCollections(mockHistory, sourceId, false);

    expect(mockHistory.push).toHaveBeenCalledWith(`/finc-select/metadata-collections?filters=mdSource.${sourceId}`);
  });
});

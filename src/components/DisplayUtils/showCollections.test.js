import doShowCollections from './showCollections';
import urls from './urls';

describe('doShowCollections', () => {
  const sourceId = '9a2427cd-4110-4bd9-b6f9-e3475631bbac';
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

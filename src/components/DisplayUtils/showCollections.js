import urls from './urls';

const doShowCollections = (history, sourceId, showSelected = false) => {
  const filters = {
    state: {
      mdSource: [sourceId],
      ...(showSelected && { selected: ['yes'] })
    },
    string: showSelected ? `mdSource.${sourceId},selected.yes` : `mdSource.${sourceId}`
  };

  localStorage.removeItem('fincSelectCollectionFilters');
  localStorage.removeItem('fincSelectCollectionSearchString');
  localStorage.removeItem('fincSelectCollectionSearchIndex');

  localStorage.setItem('fincSelectCollectionFilters', JSON.stringify(filters));
  localStorage.setItem('fincSelectCollectionSearchString', JSON.stringify({}));

  return showSelected ? history.push(urls.showSelectedCollections(sourceId)) : history.push(urls.showAllCollections(sourceId));
};

export default doShowCollections;

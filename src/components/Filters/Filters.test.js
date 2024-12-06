import { BrowserRouter as Router } from 'react-router-dom';

import { StripesContext, useStripes } from '@folio/stripes/core';

import withIntlConfiguration from '../../../test/jest/helpers/withIntlConfiguration';
import filters from '../../../test/fixtures/metadatacollections';
import Filters from './Filters';

const renderFilters = (stripes) => (
  withIntlConfiguration(
    <Router>
      <StripesContext.Provider value={stripes}>
        <Filters
          contentData={filters}
          onNeedMoreData={jest.fn()}
          queryGetter={jest.fn()}
          querySetter={jest.fn()}
          searchString="type.Whitelist,type.Blacklist"
          selectedRecordId=""
          onChangeIndex={jest.fn()}
        />
      </StripesContext.Provider>
    </Router>
  )
);

jest.unmock('react-intl');

describe('Filters SASQ View', () => {
  let stripes;

  beforeEach(() => {
    stripes = useStripes();
    renderFilters(stripes);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('pane filterresults should be visible', () => {
    expect(document.querySelector('#pane-filterresults-content')).toBeInTheDocument();
  });

  describe('check the filter elements', () => {
    it('type filter should be present', () => {
      expect(document.querySelector('#filter-accordion-type')).toBeInTheDocument();
    });

    it('reset all button should be present', () => {
      expect(document.querySelector('#clickable-reset-all')).toBeInTheDocument();
    });

    it('submit button should be present', () => {
      expect(document.querySelector('#filterSubmitSearch')).toBeInTheDocument();
    });

    it('search field should be present', () => {
      expect(document.querySelector('#filterSearchField')).toBeInTheDocument();
    });
  });
});

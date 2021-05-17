import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { StripesContext } from '@folio/stripes-core/src/StripesContext';

import '../../../test/jest/__mock__';
import renderWithIntl from '../../../test/jest/helpers/renderWithIntl';
import translationsProperties from '../../../test/jest/helpers/translationsProperties';
import filters from '../../../test/fixtures/metadatacollections';
import Filters from './Filters';
import stripes from '../../../test/jest/__mock__/stripesCore.mock';

const renderFilters = () => (
  renderWithIntl(
    <Router>
      <StripesContext.Provider value={stripes}>
        <Filters
          contentData={filters}
          onNeedMoreData={jest.fn()}
          queryGetter={jest.fn()}
          querySetter={jest.fn()}
          searchString={'type.Whitelist,type.Blacklist'}
          selectedRecordId={''}
          onChangeIndex={jest.fn()}
        />
      </StripesContext.Provider>
    </Router>,
    translationsProperties
  )
);

describe('Filters SASQ View', () => {
  beforeEach(() => {
    renderFilters();
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

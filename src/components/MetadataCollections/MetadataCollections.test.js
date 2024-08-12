import { BrowserRouter as Router } from 'react-router-dom';
import { noop } from 'lodash';

import { StripesContext, useStripes } from '@folio/stripes/core';
import { StripesConnectedSource } from '@folio/stripes/smart-components';
import { render } from '@folio/jest-config-stripes/testing-library/react';

import withIntlConfiguration from '../../../test/jest/helpers/withIntlConfiguration';
import metadatacollections from '../../../test/fixtures/metadatacollections';
import mdSources from '../../../test/fixtures/tinyMetadataSources';
import MetadataCollections from './MetadataCollections';

const tinySources = { mdSources };

const testCollection = {
  logger: { log: noop },
  mutator: { collections: {}, mdSources: {}, query: {}, resultCount: {} },
  props: { history: {}, location: {}, match: {}, staticContext: undefined, children: {} },
  recordsObj: {},
  resources: {
    collections: {},
    mdSources: { tinySources },
    query: { query: '', filters: 'permitted.yes,selected.yes', sort: 'label' },
    resultCount: 30
  }
};

const connectedTestCollection = new StripesConnectedSource(testCollection.props, testCollection.logger, 'collections');

const renderMetadataCollections = (stripes) => (
  render(withIntlConfiguration(
    <Router>
      <StripesContext.Provider value={stripes}>
        <MetadataCollections
          contentData={metadatacollections}
          collection={connectedTestCollection}
          filterData={tinySources}
          onNeedMoreData={jest.fn()}
          queryGetter={jest.fn()}
          querySetter={jest.fn()}
          searchString="permitted.yes,selected.yes"
          selectedRecordId=""
          onChangeIndex={jest.fn()}
        />
      </StripesContext.Provider>
    </Router>
  ))
);

jest.unmock('react-intl');

describe('Collections SASQ View', () => {
  let stripes;

  beforeEach(() => {
    stripes = useStripes();
    renderMetadataCollections(stripes);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('pane collectionresults should be visible', () => {
    expect(document.querySelector('#pane-collectionresults-content')).toBeInTheDocument();
  });

  describe('check the collection filter elements', () => {
    it('mdSource filter should be present', () => {
      expect(document.querySelector('#filter-accordion-mdSource')).toBeInTheDocument();
    });

    it('freeContent filter should be present', () => {
      expect(document.querySelector('#filter-accordion-freeContent')).toBeInTheDocument();
    });

    it('reset all button should be present', () => {
      expect(document.querySelector('#clickable-reset-all')).toBeInTheDocument();
    });

    it('submit button should be present', () => {
      expect(document.querySelector('#collectionSubmitSearch')).toBeInTheDocument();
    });

    it('search field should be present', () => {
      expect(document.querySelector('#collectionSearchField')).toBeInTheDocument();
    });
  });
});

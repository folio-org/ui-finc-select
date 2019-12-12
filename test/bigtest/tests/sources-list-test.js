import {
  beforeEach,
  describe,
  it,
} from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';
import SourcesList from '../interactors/sources-list';

const SOURCE_COUNT = 25;

describe('Sources List', () => {
  setupApplication();

  const sourcesList = new SourcesList();

  beforeEach(async function () {
    this.server.createList('finc-select-metadata-source', SOURCE_COUNT);
    this.visit('/finc-select/metadata-sources?filters=status.active');
    await sourcesList.whenLoaded();
  });

  it('shows the list of source items', () => {
    expect(sourcesList.isVisible).to.equal(true);
  });

  it('renders each source-instance', () => {
    expect(sourcesList.instances().length).to.be.equal(SOURCE_COUNT);
  });

  describe('check the source filter elements', function () {
    it('status filter should be present', () => {
      expect(sourcesList.statusFilterIsPresent).to.be.true;
    });

    it('reset all button should be present', () => {
      expect(sourcesList.resetAllBtnIsPresent).to.be.true;
    });

    it('submit button should be present', () => {
      expect(sourcesList.submitBtnIsPresent).to.be.true;
    });

    it('search field should be present', () => {
      expect(sourcesList.searchFieldIsPresent).to.be.true;
    });
  });
});

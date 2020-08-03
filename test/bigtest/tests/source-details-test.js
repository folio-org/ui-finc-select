import {
  beforeEach,
  describe,
  it,
} from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';
import SourceDetailsPage from '../interactors/source-details-page';
import SourcesList from '../interactors/sources-list';

describe('Source Details', () => {
  setupApplication();
  const sourceDetailsPage = new SourceDetailsPage();
  const sourcesList = new SourcesList();

  let source = null;

  beforeEach(async function () {
    source = this.server.create('finc-select-metadata-source', 'withOrganizations');
    await this.visit('/finc-select/metadata-sources?filters=status.active');
  });

  it('shows the list of source items', () => {
    expect(sourcesList.isVisible).to.equal(true);
  });

  it('renders each source-instance', () => {
    expect(sourcesList.instances().length).to.be.gte(1);
  });

  describe('clicking on the first source', function () {
    beforeEach(async function () {
      await sourcesList.instances(0).click();
    });

    it('source details should be visible', function () {
      expect(sourceDetailsPage.isVisible).to.equal(true);
    });

    it('displays source label in the pane header', function () {
      expect(sourceDetailsPage.sourceTitle).to.include(source.label);
    });

    it('all accordions in source-instance should be present', function () {
      expect(sourceDetailsPage.managementAccordion.isPresent).to.equal(true);
      expect(sourceDetailsPage.technicalAccordion.isPresent).to.equal(true);
    });
  });

  describe('close source details pane', () => {
    beforeEach(async function () {
      await sourceDetailsPage.closePaneBtn.click();
    });

    it('source details should not be visible', () => {
      expect(sourceDetailsPage.isPresent).to.be.false;
    });
  });
});

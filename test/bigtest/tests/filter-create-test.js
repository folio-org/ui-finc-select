/* eslint-disable indent */
import {
  beforeEach,
  describe,
  it,
} from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';
import EditFilterPage from '../interactors/filter-edit-page';
import FilterDetailsPage from '../interactors/filter-details-page';
import FiltersList from '../interactors/filters-list';

describe('Create Filter', () => {
  setupApplication();
  const filtersList = new FiltersList();
  const filterDetailsPage = new FilterDetailsPage();
  const editFilterPage = new EditFilterPage();

  beforeEach(async function () {
    // const filter = this.server.create('finc-select-filter', 'withFilterFile', 'withFilterCollections');
    this.visit('/finc-select/filters?filters=type.Whitelist');
    await filtersList.whenLoaded();
  });

  it('shows filter details pane', () => {
    expect(filtersList.isPresent).to.be.true;
  });

  describe('click on add new filter button', () => {
    beforeEach(async function () {
      await filtersList.addNewFilterBtn.click();
    });

    it('add new filter modal should be visible', () => {
      expect(editFilterPage.isPresent).to.be.true;
    });

    describe('update create filter form', () => {
      const TEST_NAME = 'Filter test name';
      const TEST_TYPE = 'Whitelist';

      beforeEach(async function () {
        await editFilterPage.filterName.fill(TEST_NAME);
        await editFilterPage.typeSelect.select(TEST_TYPE);
        await editFilterPage.saveFilterBtn.click();
      });

      it('filter details view should be open and create filter form should be closed', () => {
        // ALERT: 'ERROR: in module @folio/finc-select, operation POST on resource 'filters' failed, saying: Unexpected end of JSON input'
        expect(filterDetailsPage.isPresent).to.be.true;
        expect(editFilterPage.isPresent).to.be.false;
      });
    });

    describe('click cancel in create new filter form', () => {
      beforeEach(async function () {
        await editFilterPage.closeEditPaneBtn.click();
      });

      it('filter edit form should be closed', () => {
        expect(editFilterPage.isPresent).to.be.false;
      });
    });
  });
});

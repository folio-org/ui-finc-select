import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { Form } from 'react-final-form';
import { render, screen } from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import { StripesContext, useStripes } from '@folio/stripes/core';

import withIntlConfiguration from '../../../test/jest/helpers/withIntlConfiguration';
import FilterForm from './FilterForm';
import FILTER from '../../../test/fixtures/filter';

const onDelete = jest.fn();
const onClose = jest.fn();
const handleSubmit = jest.fn();
const onSubmit = jest.fn();

const renderEmptyFilterForm = (stripes, initialValues = {}) => {
  return render(
    withIntlConfiguration(
      <StripesContext.Provider value={stripes}>
        <MemoryRouter>
          <Form
            onSubmit={jest.fn}
            render={() => (
              <FilterForm
                initialValues={initialValues}
                handlers={{ onClose, onDelete }}
                handleSubmit={handleSubmit}
                onSubmit={onSubmit}
              />
            )}
          />
        </MemoryRouter>
      </StripesContext.Provider>
    )
  );
};

const renderFilterForm = (stripes, initialValues = FILTER) => {
  return render(
    withIntlConfiguration(
      <StripesContext.Provider value={stripes}>
        <MemoryRouter>
          <Form
            onSubmit={jest.fn}
            render={() => (
              <FilterForm
                initialValues={initialValues}
                handlers={{ onClose, onDelete }}
                handleSubmit={handleSubmit}
                onSubmit={onSubmit}
                onDelete={onDelete}
              />
            )}
          />
        </MemoryRouter>
      </StripesContext.Provider>
    )
  );
};

jest.unmock('react-intl');

describe('FilterForm', () => {
  let stripes;

  beforeEach(() => {
    stripes = useStripes();
  });

  describe('CREATE: empty form', () => {
    beforeEach(() => {
      renderEmptyFilterForm(stripes);
    });

    test('should display accordions', () => {
      expect(document.querySelector('#editFilterInfo')).toBeInTheDocument();
      expect(document.querySelector('#editFilterFile')).toBeInTheDocument();
      expect(document.querySelector('#editCollections')).toBeInTheDocument();
    });

    test('should display all fields', () => {
      expect(document.querySelector('#addfilter_label')).toBeInTheDocument();
      expect(document.querySelector('#addfilter_type')).toBeInTheDocument();
    });

    describe('select type', () => {
      beforeEach(async () => {
        await userEvent.selectOptions(screen.getByLabelText('Type', { exact: false }), [
          'Blacklist',
        ]);
      });

      test('test required fields', async () => {
        await userEvent.click(screen.getByText('Save & close'));
        expect(screen.getAllByText('Required!', { exact: false })).toHaveLength(1);
        expect(onSubmit).not.toHaveBeenCalled();
      });
    });
  });

  describe('EDIT: form with initial values', () => {
    beforeEach(() => {
      renderFilterForm(stripes);
    });

    test('description should have value of fixture filter', () => {
      expect(screen.getByDisplayValue('Holdings 1')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Whitelist')).toBeInTheDocument();
    });
  });

  describe('delete filter', () => {
    beforeEach(() => {
      renderFilterForm(stripes);
    });

    test('delete modal is present', async () => {
      await userEvent.click(screen.getByText('Delete'));

      expect(document.getElementById('delete-filter-confirmation')).toBeInTheDocument();
      expect(screen.getByText('Do you really want to delete Holdings 1?')).toBeInTheDocument();
    });

    test('click cancel', async () => {
      await userEvent.click(screen.getByText('Delete'));
      const cancel = screen.getByRole('button', {
        name: 'Cancel',
        id: 'clickable-delete-filter-confirmation-cancel',
      });
      await userEvent.click(cancel);
      expect(onDelete).not.toHaveBeenCalled();
    });

    test('click submit', async () => {
      await userEvent.click(screen.getByText('Delete'));
      const submit = screen.getByRole('button', {
        name: 'Submit',
        id: 'clickable-delete-filter-confirmation-confirm',
      });
      await userEvent.click(submit);
      expect(onDelete).toHaveBeenCalled();
    });
  });
});

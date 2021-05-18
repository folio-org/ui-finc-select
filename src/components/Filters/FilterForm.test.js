import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { Form } from 'react-final-form';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StripesContext } from '@folio/stripes-core/src/StripesContext';

import renderWithIntl from '../../../test/jest/helpers/renderWithIntl';
import FilterForm from './FilterForm';
import FILTER from '../../../test/fixtures/filter';
import stripes from '../../../test/jest/__mock__/stripesCore.mock';

const onDelete = jest.fn();
const onClose = jest.fn();
const handleSubmit = jest.fn();
const onSubmit = jest.fn();

const renderEmptyFilterForm = (initialValues = {}) => {
  return renderWithIntl(
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
  );
};

const renderFilterForm = (initialValues = FILTER) => {
  return renderWithIntl(
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
  );
};

describe('FilterForm', () => {
  describe('CREATE: empty form', () => {
    beforeEach(() => {
      renderEmptyFilterForm();
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
      beforeEach(() => {
        userEvent.selectOptions(
          screen.getByLabelText('Type', { exact: false }), ['Blacklist']
        );
      });
      test('test required fields', async () => {
        userEvent.click(screen.getByText('Save & close'));
        expect(screen.getAllByText('Required!', { exact: false })).toHaveLength(1);
        expect(onSubmit).not.toHaveBeenCalled();
      });
    });
  });

  describe('EDIT: form with initial values', () => {
    beforeEach(() => {
      renderFilterForm();
    });
    test('description should have value of fixture filter', () => {
      expect(screen.getByDisplayValue('Holdings 1')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Whitelist')).toBeInTheDocument();
    });
  });

  describe('delete filter', () => {
    beforeEach(() => {
      renderFilterForm();
    });

    test('delete modal is present', () => {
      userEvent.click(screen.getByText('Delete'));
      expect(document.getElementById('delete-filter-confirmation')).toBeInTheDocument();
      expect(screen.getByText('Do you really want to delete Holdings 1?')).toBeInTheDocument();
    });

    test('click cancel', () => {
      userEvent.click(screen.getByText('Delete'));
      const cancel = screen.getByRole('button', {
        name: 'Cancel',
        id: 'clickable-delete-filter-confirmation-cancel',
      });
      userEvent.click(cancel);
      expect(onDelete).not.toHaveBeenCalled();
    });

    test('click submit', () => {
      userEvent.click(screen.getByText('Delete'));
      const submit = screen.getByRole('button', {
        name: 'Submit',
        id: 'clickable-delete-filter-confirmation-confirm',
      });
      userEvent.click(submit);
      expect(onDelete).toHaveBeenCalled();
    });
  });
});

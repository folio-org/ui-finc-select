import { MemoryRouter } from 'react-router-dom';
import { Form } from 'react-final-form';

import { screen, within } from '@folio/jest-config-stripes/testing-library/react';
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
  return withIntlConfiguration(
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

const renderFilterForm = (stripes, initialValues = FILTER) => {
  return withIntlConfiguration(
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
      expect(screen.getByRole('button', { name: 'Icon General' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Icon File' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Icon Metadata collections' })).toBeInTheDocument();
    });

    test('should display all fields', () => {
      expect(screen.getByRole('textbox', { name: 'Name' })).toBeInTheDocument();
      expect(screen.getByRole('combobox', { name: 'Type' })).toBeInTheDocument();
    });

    test('if select type and click save is showing required fields', async () => {
      await userEvent.selectOptions(screen.getByRole('combobox', { name: /Type/ }), 'Blacklist');
      await userEvent.click(screen.getByRole('button', { name: 'Save & close' }));
      expect(screen.getAllByText('Required!', { exact: false })).toHaveLength(1);
      expect(onSubmit).not.toHaveBeenCalled();
    });
  });

  describe('EDIT filter', () => {
    beforeEach(() => {
      renderFilterForm(stripes);
    });

    test('test if value of fixture filter are shown', () => {
      expect(screen.getByDisplayValue('Holdings 1')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Whitelist')).toBeInTheDocument();
    });

    test('if delete modal is opening', async () => {
      await userEvent.click(screen.getByRole('button', { name: 'Delete' }));
      const confirmationModal = screen.getByRole('dialog', { name: /Do you really want to delete Holdings 1?/ });
      expect(confirmationModal).toBeInTheDocument();
    });

    test('click cancel', async () => {
      await userEvent.click(screen.getByRole('button', { name: 'Delete' }));
      const confirmationModal = screen.getByRole('dialog', { name: /Do you really want to delete Holdings 1?/ });
      const cancelButton = within(confirmationModal).getByRole('button', { name: 'Cancel' });
      await userEvent.click(cancelButton);
      expect(onDelete).not.toHaveBeenCalled();
    });

    test('click submit', async () => {
      await userEvent.click(screen.getByRole('button', { name: 'Delete' }));
      const confirmationModal = screen.getByRole('dialog', { name: /Do you really want to delete Holdings 1?/ });
      const submitButton = within(confirmationModal).getByRole('button', { name: 'Submit' });
      await userEvent.click(submitButton);
      expect(onDelete).toHaveBeenCalled();
    });
  });
});

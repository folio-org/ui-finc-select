import { MemoryRouter } from 'react-router-dom';
import { Form } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';

import { fireEvent, screen, waitFor } from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import { StripesContext, useStripes } from '@folio/stripes/core';

import withIntlConfiguration from '../../../../test/jest/helpers/withIntlConfiguration';
import FilterForm from '../FilterForm';
import FilterFileForm from './FilterFileForm';
import FILTER from '../../../../test/fixtures/filter';

const onToggle = jest.fn();
const onDelete = jest.fn();
const onClose = jest.fn();
const handleSubmit = jest.fn();
const onSubmit = jest.fn();
const onUploadFile = jest.fn();
const onDownloadFile = jest.fn();

const file = new File(['foo'], 'file.json', { type: 'text/plain' });

const renderFilterFileForm = (stripes, initialValues = FILTER) => {
  return withIntlConfiguration(
    <StripesContext.Provider value={stripes}>
      <MemoryRouter>
        <Form
          onSubmit={onSubmit}
          render={() => (
            <FilterForm
              initialValues={initialValues}
              handlers={{ onClose, onDelete }}
              handleSubmit={handleSubmit}
              onSubmit={onSubmit}
              onDelete={onDelete}
            >
              <FilterFileForm
                accordionId="accordionId"
                expanded
                onToggle={onToggle}
                stripes={stripes}
              >
                <FieldArray
                  addDocBtnLabel="Add file to filter"
                  name="filterFiles"
                  onDownloadFile={onDownloadFile}
                  onUploadFile={onUploadFile}
                />
              </FilterFileForm>
            </FilterForm>
          )}
        />
      </MemoryRouter>
    </StripesContext.Provider>
  );
};

jest.unmock('react-intl');

describe('FilterFileForm', () => {
  let stripes;

  describe('render FilterFileForm', () => {
    beforeEach(() => {
      stripes = useStripes();
      renderFilterFileForm(stripes);
    });

    test('Add file button is rendered', () => {
      const selectFile = screen.getByRole('button', {
        name: 'Add file to filter',
      });
      expect(selectFile).toBeInTheDocument();
    });

    describe('Click add file button', () => {
      beforeEach(async () => {
        const selectFile = screen.getByRole('button', {
          name: 'Add file to filter',
        });
        await userEvent.click(selectFile);
      });

      test('should render filter file upload button', () => {
        expect(document.querySelector('#filter-file-label-1')).toBeInTheDocument();
        expect(document.querySelector('#filter-file-upload-button')).toBeInTheDocument();
      });

      test('should render filter file upload button', async () => {
        const filenameInput = document.querySelector('#filter-file-label-1');
        const uploadFileInput = document.querySelector('#filter-file-input');
        const saveButton = screen.getByRole('button', { name: 'Save & close' });

        await userEvent.type(filenameInput, 'my filename');
        fireEvent.change(uploadFileInput, { target: { filterFiles: [file] } });
        await waitFor(() => {
          expect(saveButton).toBeEnabled();
        });
      });
    });
  });
});

import React from 'react';
import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { Form } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import { StripesContext } from '@folio/stripes/core';

// import { server, rest } from '../../../../test/jest/testServer';
import renderWithIntl from '../../../../test/jest/helpers';
import FilterForm from '../FilterForm';
import FilterFileForm from './FilterFileForm';
import FILTER from '../../../../test/fixtures/filter';
import stripes from '../../../../test/jest/__mock__/stripesCore.mock';

const onToggle = jest.fn();
const onDelete = jest.fn();
const onClose = jest.fn();
const handleSubmit = jest.fn();
const onSubmit = jest.fn();
const onUploadFile = jest.fn();
const onDownloadFile = jest.fn();

// const filterId = '0ba00047-b6cb-417a-a735-e2c1e45e30f1';
const file = new File(['foo'], 'file.json', { type: 'text/plain' });

const renderFilterFileForm = (initialValues = FILTER) => {
  return renderWithIntl(
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

describe('FilterFileForm', () => {
  describe('render FilterFileForm', () => {
    beforeEach(() => {
      renderFilterFileForm();
    });

    test('Add file button is rendered', async () => {
      const selectFile = screen.getByRole('button', {
        name: 'Add file to filter',
      });
      expect(selectFile).toBeInTheDocument();
    });

    describe('Click add file button', () => {
      beforeEach(() => {
        const selectFile = screen.getByRole('button', {
          name: 'Add file to filter',
        });
        userEvent.click(selectFile);
      });

      test('should render filter file upload button', async () => {
        expect(document.querySelector('#filter-file-label-1')).toBeInTheDocument();
        expect(document.querySelector('#filter-file-upload-button')).toBeInTheDocument();
      });

      test('should render filter file upload button', async () => {
        const filenameInput = document.querySelector('#filter-file-label-1');
        const uploadFileInput = document.querySelector('#filter-file-input');
        const saveButton = screen.getByRole('button', { name: 'Save & close' });

        userEvent.type(filenameInput, 'my filename');
        await act(async () => fireEvent.change(uploadFileInput, { target: { filterFiles: [file] } }));
        await waitFor(() => expect(saveButton).not.toHaveAttribute('disabled'));
        // expect(screen.getByText('The filter file my filename is connected.')).toBeVisible();
      });

      // test('upload filter file', async () => {
      //   server.use(
      //     rest.post(
      //       'https://folio-testing-okapi.dev.folio.org/finc-select/files/',
      //       (req, res, ctx) => {
      //         return res(ctx.status(200));
      //       }
      //     )
      //   );

      //   const filenameInput = document.querySelector('#filter-file-label-1');
      //   userEvent.type(filenameInput, 'my filename');

      //   const saveButton = screen.getByRole('button', { name: 'Save & close' });
      //   await act(async () => userEvent.click(saveButton));

      //   await waitFor(() => expect(onUploadFile).toBeCalled());
      // });
    });
  });
});

import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { Form } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import { StripesContext } from '@folio/stripes-core/src/StripesContext';

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

// const filterId = '0ba00047-b6cb-417a-a735-e2c1e45e30f1';
// const file = new File(['foo'], 'file.json', { type: 'text/plain' });

const renderFilterFileForm = (initialValues = FILTER) => {
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
            >
              <FilterFileForm
                accordionId="accordionId"
                expanded
                onToggle={onToggle}
                stripes={stripes}
              >
                <FieldArray
                  addDocBtnLabel="Add file to filter"
                  // component={DocumentsFieldArray}
                  name="filterFiles"
                  onDownloadFile={jest.fn()}
                  onUploadFile={jest.fn()}
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
        expect(document.querySelector('#filter-file-label-0')).toBeInTheDocument();
        expect(document.querySelector('#filter-file-upload-button')).toBeInTheDocument();
      });
    });
  });
});

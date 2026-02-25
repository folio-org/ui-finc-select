import arrayMutators from 'final-form-arrays';
import { Form } from 'react-final-form';
import { MemoryRouter } from 'react-router-dom';

import {
  screen,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import {
  StripesContext,
  useStripes,
} from '@folio/stripes/core';

import renderWithIntlConfiguration from '../../../../test/jest/helpers/renderWithIntlConfiguration';
import fetchWithDefaultOptions from '../../DisplayUtils/fetchWithDefaultOptions';
import FilterFileForm from './FilterFileForm';

const onToggle = jest.fn();
const onSubmit = jest.fn();

const file = new File(['foo'], 'file.json', { type: 'text/plain' });

jest.mock('../../DisplayUtils/fetchWithDefaultOptions');

const mockPost = jest.fn(() => Promise.resolve({
  ok: true,
  text: () => Promise.resolve('34bdd9da-b765-448a-8519-11d460a4df5d'),
}));

const renderFilterFileForm = (stripes) => {
  return renderWithIntlConfiguration(
    <StripesContext.Provider value={stripes}>
      <MemoryRouter>
        <Form
          mutators={arrayMutators}
          onSubmit={onSubmit}
          render={() => (
            <FilterFileForm
              accordionId="accordionId"
              expanded
              onToggle={onToggle}
            />
          )}
        />
      </MemoryRouter>
    </StripesContext.Provider>
  );
};

jest.unmock('react-intl');

describe('FilterFileForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    fetchWithDefaultOptions.mockImplementation(mockPost);
  });

  describe('render FilterFileForm', () => {
    beforeEach(() => {
      const stripes = useStripes();
      renderFilterFileForm(stripes);
    });

    test('Add file button is rendered', () => {
      const selectFile = screen.getByRole('button', { name: 'Add file to filter' });
      expect(selectFile).toBeInTheDocument();
    });

    describe('Click add file button', () => {
      beforeEach(async () => {
        const selectFile = screen.getByRole('button', { name: 'Add file to filter' });
        await userEvent.click(selectFile);
      });

      it('should render filter file upload card', () => {
        expect(document.querySelector('#filter-file-label-0')).toBeInTheDocument();
        expect(document.querySelector('#filter-file-upload-button')).toBeInTheDocument();
      });

      test('upload file should call fetch', async () => {
        const filenameInput = document.querySelector('#filter-file-label-0');
        const uploadFileInput = document.querySelector('#filter-file-input');

        await userEvent.type(filenameInput, 'my filename');
        await userEvent.upload(uploadFileInput, file);

        await waitFor(() => {
          expect(fetchWithDefaultOptions).toHaveBeenCalledWith(
            expect.any(Object),
            expect.stringContaining('/finc-select/files'),
            expect.objectContaining({
              method: 'POST',
              body: file,
            })
          );
        });
      });
    });
  });
});

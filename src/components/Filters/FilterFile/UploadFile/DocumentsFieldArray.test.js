import { MemoryRouter } from 'react-router-dom';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';

import { screen } from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import { StripesContext, useStripes } from '@folio/stripes/core';

import DocumentsFieldArray from './DocumentsFieldArray';
import renderWithIntlConfiguration from '../../../../../test/jest/helpers/renderWithIntlConfiguration';

const renderDocumentsFieldArray = (stripes, filterFileMock = {}) => {
  return renderWithIntlConfiguration(
    <StripesContext.Provider value={stripes}>
      <MemoryRouter>
        <Form
          onSubmit={jest.fn()}
          mutators={{
            ...arrayMutators,
          }}
          initialValues={filterFileMock}
          render={() => (
            <DocumentsFieldArray name="filterFiles" />
          )}
        />
      </MemoryRouter>
    </StripesContext.Provider>
  );
};

jest.unmock('react-intl');

describe('DocumentsFieldArray', () => {
  let stripes;

  beforeEach(() => {
    stripes = useStripes();
  });

  test('adding EditCards for documents', async () => {
    renderDocumentsFieldArray(stripes);

    expect(screen.queryByRole('textbox', { name: 'File' })).not.toBeInTheDocument();
    expect(screen.queryByRole('textbox', { name: 'Criteria' })).not.toBeInTheDocument();

    const addFileToFilterButton = screen.getByRole('button', { name: 'Add file to filter' });
    expect(addFileToFilterButton).toBeInTheDocument();

    await userEvent.click(addFileToFilterButton);

    expect(await screen.findByRole('textbox', { name: 'File' })).toBeInTheDocument();
    expect(await screen.findByRole('textbox', { name: 'Criteria' })).toBeInTheDocument();

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    expect(deleteButton).toBeInTheDocument();

    await userEvent.click(deleteButton);

    expect(screen.queryByRole('textbox', { name: 'File' })).not.toBeInTheDocument();
    expect(screen.queryByRole('textbox', { name: 'Criteria' })).not.toBeInTheDocument();

    await userEvent.click(addFileToFilterButton);
    await userEvent.click(addFileToFilterButton);

    expect(await screen.findAllByRole('textbox', { name: 'File' })).toHaveLength(2);
    expect(await screen.findAllByRole('textbox', { name: 'Criteria' })).toHaveLength(2);
  });

  test('shows connected filename text', async () => {
    const filterFileMock = {
      filterFiles: [
        {
          fileId: '12345',
          label: 'filename.txt',
        },
      ],
    };

    renderDocumentsFieldArray(stripes, filterFileMock);

    const connectedFileText = await screen.findByText('The filter file filename.txt is connected.');
    expect(connectedFileText).toBeInTheDocument();
  });

  test('show correct numbering after delete EditCard number 2 of 3', async () => {
    renderDocumentsFieldArray(stripes);

    const addFileToFilterButton = screen.getByRole('button', { name: 'Add file to filter' });
    expect(addFileToFilterButton).toBeInTheDocument();

    await userEvent.click(addFileToFilterButton);
    await userEvent.click(addFileToFilterButton);
    await userEvent.click(addFileToFilterButton);

    expect(screen.getByText('File #1')).toBeInTheDocument();
    expect(screen.getByText('File #2')).toBeInTheDocument();
    expect(screen.getByText('File #3')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /delete file #2/i }));

    expect(screen.getByText('File #1')).toBeInTheDocument();
    expect(screen.getByText('File #2')).toBeInTheDocument();
    expect(screen.queryByText('File #3')).not.toBeInTheDocument();
  });
});

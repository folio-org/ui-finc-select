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

  test('show correct file labels after delete EditCard', async () => {
    const filterFilesMock = {
      filterFiles: [
        {
          fileId: '1111',
          label: 'file 1.txt',
        },
        {
          fileId: '2222',
          label: 'file 2.txt',
        },
        {
          fileId: '3333',
          label: 'file 3.txt',
        },
      ],
    };

    renderDocumentsFieldArray(stripes, filterFilesMock);

    expect(screen.getByText('The filter file file 1.txt is connected.')).toBeInTheDocument();
    expect(screen.getByText('The filter file file 2.txt is connected.')).toBeInTheDocument();
    expect(screen.getByText('The filter file file 3.txt is connected.')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /delete file #2/i }));

    expect(screen.getByText('The filter file file 1.txt is connected.')).toBeInTheDocument();
    expect(screen.queryByText('The filter file file 2.txt is connected.')).not.toBeInTheDocument();
    expect(screen.getByText('The filter file file 3.txt is connected.')).toBeInTheDocument();
  });
});

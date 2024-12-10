import { MemoryRouter } from 'react-router-dom';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';

import { screen } from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import { StripesContext, useStripes } from '@folio/stripes/core';

import DocumentsFieldArray from './DocumentsFieldArray';
import renderWithIntlConfiguration from '../../../../../test/jest/helpers/renderWithIntlConfiguration';

const renderDocumentsFieldArray = (stripes) => {
  return renderWithIntlConfiguration(
    <StripesContext.Provider value={stripes}>
      <MemoryRouter>
        <Form
          onSubmit={jest.fn()}
          mutators={{
            ...arrayMutators,
          }}
          render={() => (
            <DocumentsFieldArray fields={{ name: 'filterFiles' }} />
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
    renderDocumentsFieldArray(stripes);
  });

  test('adding EditCards for documents', async () => {
    expect(screen.queryByRole('textbox', { name: 'File' })).not.toBeInTheDocument();
    expect(screen.queryByRole('textbox', { name: 'Criteria' })).not.toBeInTheDocument();

    const addFileToFilterButton = screen.getByRole('button', { name: 'Add file to filter' });
    expect(addFileToFilterButton).toBeInTheDocument();
    await userEvent.click(addFileToFilterButton);

    expect(screen.getByRole('textbox', { name: 'File' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Criteria' })).toBeInTheDocument();

    const deleteButton = screen.getByLabelText('delete-document');
    expect(deleteButton).toBeInTheDocument();
    await userEvent.click(deleteButton);
    expect(screen.queryByRole('textbox', { name: 'File' })).not.toBeInTheDocument();
    expect(screen.queryByRole('textbox', { name: 'Criteria' })).not.toBeInTheDocument();

    await userEvent.click(addFileToFilterButton);
    await userEvent.click(addFileToFilterButton);
    expect(screen.getAllByRole('textbox', { name: 'File' })).toHaveLength(2);
    expect(screen.getAllByRole('textbox', { name: 'Criteria' })).toHaveLength(2);
  });
});

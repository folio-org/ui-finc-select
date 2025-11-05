import { MemoryRouter } from 'react-router-dom';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';

import { act, screen } from '@folio/jest-config-stripes/testing-library/react';
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
    renderDocumentsFieldArray(stripes);
  });

  test('adding EditCards for documents', async () => {
    expect(screen.queryByRole('textbox', { name: 'File' })).not.toBeInTheDocument();
    expect(screen.queryByRole('textbox', { name: 'Criteria' })).not.toBeInTheDocument();

    const addFileToFilterButton = screen.getByRole('button', { name: 'Add file to filter' });
    expect(addFileToFilterButton).toBeInTheDocument();
    await act(async () => {
      await userEvent.click(addFileToFilterButton);
    });

    expect(await screen.findByRole('textbox', { name: 'File' })).toBeInTheDocument();
    expect(await screen.findByRole('textbox', { name: 'Criteria' })).toBeInTheDocument();

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    expect(deleteButton).toBeInTheDocument();
    await act(async () => {
      await userEvent.click(deleteButton);
    });
    expect(screen.queryByRole('textbox', { name: 'File' })).not.toBeInTheDocument();
    expect(screen.queryByRole('textbox', { name: 'Criteria' })).not.toBeInTheDocument();

    await act(async () => {
      await userEvent.click(addFileToFilterButton);
      await userEvent.click(addFileToFilterButton);
    });
    expect(await screen.findAllByRole('textbox', { name: 'File' })).toHaveLength(2);
    expect(await screen.findAllByRole('textbox', { name: 'Criteria' })).toHaveLength(2);
  });
});

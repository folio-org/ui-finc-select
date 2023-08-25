import { StripesContext } from '@folio/stripes/core';
import { render, screen } from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import withIntlConfiguration from '../../../../test/jest/helpers/withIntlConfiguration';
import FilterFileView from './FilterFileView';

const stripes = {
  // we need to set okapi token here
  okapi: {
    tenant: 'diku',
    token: 'someToken',
    url: 'https://folio-testing-okapi.dev.folio.org',
  },
};

const withoutFilterFile = {
  filterFiles: [],
};

const withFilterFile = {
  filterFiles: [
    {
      label: 'filter file label',
      fileId: 'a34dc305-892a-4a7f-9d4a-64c165cb49a0',
    },
  ],
};

const renderFilterFileView = (filter) =>
  render(
    withIntlConfiguration(
      <MemoryRouter>
        <StripesContext.Provider value={stripes}>
          <FilterFileView filter={filter} stripes={stripes} />
        </StripesContext.Provider>
      </MemoryRouter>
    )
  );

jest.unmock('react-intl');

jest.mock('file-saver', () => ({
  saveAs: jest.fn(),
}));

describe('FilterFileView with no file', () => {
  beforeEach(() => {
    renderFilterFileView(withoutFilterFile);
  });

  it('Text should be rendered', () => {
    const downloadButton = screen.getByText('Filter has no file', { exact: false });
    expect(downloadButton).toBeInTheDocument();
  });
});

describe('FilterFileView with file', () => {
  beforeEach(() => {
    renderFilterFileView(withFilterFile);
  });

  it('Download button should be rendered', () => {
    const downloadButton = screen.getByRole('button', { name: 'Download' });
    expect(downloadButton).toBeInTheDocument();
  });

  it('click download button', async () => {
    global.fetch = jest
      .fn()
      .mockResolvedValue({ blob: () => Promise.resolve(new Blob(['content'])) });

    const downloadButton = screen.getByRole('button', { name: 'Download' });
    await userEvent.click(downloadButton);

    expect(global.fetch).toHaveBeenCalled();
  });
});

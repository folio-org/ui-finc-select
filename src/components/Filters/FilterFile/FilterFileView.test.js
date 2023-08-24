import React from 'react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { StripesContext } from '@folio/stripes/core';
import { Button } from '@folio/stripes-components';

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

const handleDownloadFile = jest.fn();

const renderFilterFileView = (filter) =>
  render(
    withIntlConfiguration(
      <MemoryRouter>
        <StripesContext.Provider value={stripes}>
          <FilterFileView filter={filter} stripes={stripes}>
            <Button onClick={handleDownloadFile()}>Download</Button>
          </FilterFileView>
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
    const downloadButton = screen.getByRole('button', { name: 'Download' });
    await userEvent.click(downloadButton);

    expect(handleDownloadFile).toHaveBeenCalled();
  });
});

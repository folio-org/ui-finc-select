import React from 'react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { screen } from '@testing-library/react';
import { StripesContext } from '@folio/stripes/core';
import { Button } from '@folio/stripes-components';

import '../../../../test/jest/__mock__';
import translationsProperties from '../../../../test/jest/helpers/translationsProperties';
import renderWithIntl from '../../../../test/jest/helpers';
import FilterFileView from './FilterFileView';
import { server, rest } from '../../../../test/jest/testServer';
// import stripes from '../../../../test/jest/__mock__/stripesCore.mock';

const STRIPES = {
  actionNames: [],
  clone: () => ({ ...STRIPES }),
  connect: (Component) => Component,
  config: {},
  currency: 'USD',
  hasInterface: () => true,
  hasPerm: jest.fn().mockReturnValue(true),
  locale: 'en-US',
  logger: {
    log: () => { },
  },
  okapi: {
    tenant: 'diku',
    token: 'someToken',
    url: 'https://folio-testing-okapi.dev.folio.org',
  },
  plugins: {},
  setBindings: () => { },
  setCurrency: () => { },
  setLocale: () => { },
  setSinglePlugin: () => { },
  setTimezone: () => { },
  setToken: () => { },
  store: {
    getState: () => { },
    dispatch: () => { },
    subscribe: () => { },
    replaceReducer: () => { },
  },
  timezone: 'UTC',
  user: {
    perms: {},
    user: {
      id: 'b1add99d-530b-5912-94f3-4091b4d87e2c',
      username: 'diku_admin',
    },
  },
  withOkapi: true,
};

const withoutFilterFile = {
  'filterFiles' : [],
};

const withFilterFile = {
  filterFiles: [
    {
      'label' : 'filter file label',
      'fileId' : 'a34dc305-892a-4a7f-9d4a-64c165cb49a0',
    },
  ]
};

const handleDownloadFile = jest.fn();

const renderFilterFileView = (filter) => (
  renderWithIntl(
    <MemoryRouter>
      <StripesContext.Provider value={STRIPES}>
        <FilterFileView
          filter={filter}
          stripes={STRIPES}
        >
          <Button onClick={handleDownloadFile()}>Download</Button>
        </FilterFileView>
      </StripesContext.Provider>
    </MemoryRouter>,
    translationsProperties
  )
);

jest.mock('file-saver', () => ({
  saveAs: jest.fn(),
}));

describe('FilterFileView with no file', () => {
  beforeEach(() => {
    renderFilterFileView(withoutFilterFile);
  });

  it('Text should be rendered', () => {
    const downloadButton = screen.getByText('Filter has no file', {
      exact: false,
    });
    expect(downloadButton).toBeInTheDocument();
  });
});

describe('FilterFileView with file', () => {
  beforeEach(() => {
    renderFilterFileView(withFilterFile);
  });

  it('Download button should be rendered', () => {
    const downloadButton = screen.getByRole('button', {
      name: 'Download',
    });
    expect(downloadButton).toBeInTheDocument();
  });

  it('click download button', () => {
    server.use(
      rest.get(
        'https://folio-testing-okapi.dev.folio.org/finc-select/files/0ba00047-b6cb-417a-a735-e2c1e45e30f1',
        (req, res, ctx) => {
          return res(ctx.status(200));
        }
      )
    );

    const downloadButton = screen.getByRole('button', { name: 'Download' });
    userEvent.click(downloadButton);

    expect(handleDownloadFile).toHaveBeenCalled();
  });
});

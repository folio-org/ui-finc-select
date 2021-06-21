import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { screen } from '@testing-library/react';
import { StripesContext } from '@folio/stripes-core/src/StripesContext';

import '../../../../test/jest/__mock__';
import translationsProperties from '../../../../test/jest/helpers/translationsProperties';
import renderWithIntl from '../../../../test/jest/helpers';
import FilterFileView from './FilterFileView';
import stripes from '../../../../test/jest/__mock__/stripesCore.mock';

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

const renderFilterFileView = (fakeStripes = StripesContext, filter) => (
  renderWithIntl(
    <MemoryRouter>
      <StripesContext.Provider value={fakeStripes}>
        <FilterFileView
          filter={filter}
          stripes={fakeStripes}
        />
      </StripesContext.Provider>
    </MemoryRouter>,
    translationsProperties
  )
);

describe('FilterFileView with no file', () => {
  beforeEach(() => {
    renderFilterFileView(stripes, withoutFilterFile);
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
    renderFilterFileView(stripes, withFilterFile);
  });

  it('Download button should be rendered', () => {
    const downloadButton = screen.getByRole('button', {
      name: 'Download',
    });
    expect(downloadButton).toBeInTheDocument();
  });
});

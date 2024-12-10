import { noop } from 'lodash';
import { MemoryRouter } from 'react-router-dom';

import renderWithIntlConfiguration from '../../test/jest/helpers/renderWithIntlConfiguration';
import metadatasources from '../../test/fixtures/metadatasources';
import SourcesRoute from './SourcesRoute';

const routeProps = {
  history: {
    push: () => jest.fn()
  },
  match: {
    params: {
      id: '6dd325f8-b1d5-4568-a0d7-aecf6b8d6697',
    },
  },
  location: {},
  mutator: {
    query: { update: noop },
  },
  resources: { metadatasources }
};

jest.unmock('react-intl');

describe('SourcesRoute', () => {
  describe('rendering the route with permissions', () => {
    let renderComponent;
    beforeEach(() => {
      renderComponent = renderWithIntlConfiguration(
        <MemoryRouter>
          <SourcesRoute
            {...routeProps}
            stripes={{ hasPerm: () => true, logger: { log: () => jest.fn() } }}
          />
        </MemoryRouter>
      );
    });

    test('renders the sources component', () => {
      const { getByTestId } = renderComponent;
      expect(getByTestId('sources')).toBeInTheDocument();
    });
  });
});

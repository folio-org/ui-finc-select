import { noop } from 'lodash';
import { MemoryRouter } from 'react-router-dom';

import withIntlConfiguration from '../../test/jest/helpers/withIntlConfiguration';
import metadatacollections from '../../test/fixtures/metadatacollections';
import CollectionsRoute from './CollectionsRoute';

const routeProps = {
  history: {
    push: () => jest.fn()
  },
  match: {
    params: {
      id: '9a2427cd-4110-4bd9-b6f9-e3475631bbac',
    },
  },
  location: {},
  mutator: {
    query: { update: noop },
  },
  resources: { metadatacollections }
};

jest.unmock('react-intl');

describe('CollectionsRoute', () => {
  describe('rendering the route with permissions', () => {
    let renderComponent;
    beforeEach(() => {
      renderComponent = withIntlConfiguration(
        <MemoryRouter>
          <CollectionsRoute
            {...routeProps}
            stripes={{ hasPerm: () => true, logger: { log: () => jest.fn() } }}
          />
        </MemoryRouter>
      );
    });

    test('renders the collections component', () => {
      const { getByTestId } = renderComponent;
      expect(getByTestId('collections')).toBeInTheDocument();
    });
  });
});

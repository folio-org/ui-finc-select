import { StaticRouter } from 'react-router-dom';

import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import withIntlConfiguration from '../../../../../../test/jest/helpers/withIntlConfiguration';
import EditCard from './EditCard';

const onDelete = jest.fn();

const props = {
  children: 'children',
  deleteButtonTooltipText: 'Remove card',
  header: 'Card #1',
  onDelete
};

describe('EditCard', () => {
  beforeEach(() => {
    render(withIntlConfiguration(
      <StaticRouter>
        <EditCard
          {...props}
        />
      </StaticRouter>
    ));
  });

  test('renders the EditCard component', async () => {
    expect(screen.getByRole('button', { name: 'Remove card' })).toBeInTheDocument();
    expect(screen.getByText('Card #1')).toBeInTheDocument();
  });
});

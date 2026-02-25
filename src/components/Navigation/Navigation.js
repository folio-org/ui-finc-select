import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  ButtonGroup,
} from '@folio/stripes/components';

import urls from '../DisplayUtils/urls';

const FincNavigation = ({ id }) => {
  const collectionsSearchString = localStorage.getItem('finc-select-collections-search-string') || '';
  const sourcesSearchString = localStorage.getItem('finc-select-sources-search-string') || '';
  const filtersSearchString = localStorage.getItem('finc-select-filters-search-string') || '';

  return (
    <ButtonGroup data-test-navigation fullWidth>
      <Button
        buttonStyle={id === 'source' ? 'primary' : 'default'}
        data-test-navigation-source
        id="metadata-sources"
        to={id !== 'source' ? `${urls.sources()}${sourcesSearchString}` : ''}
      >
        <FormattedMessage id="ui-finc-select.navigation.sources" />
      </Button>
      <Button
        buttonStyle={id === 'collection' ? 'primary' : 'default'}
        data-test-navigation-collection
        id="metadata-collections"
        to={id !== 'collection' ? `${urls.collections()}${collectionsSearchString}` : ''}
      >
        <FormattedMessage id="ui-finc-select.navigation.collections" />
      </Button>
      <Button
        buttonStyle={id === 'filter' ? 'primary' : 'default'}
        data-test-navigation-filter
        id="filters"
        to={id !== 'filter' ? `${urls.filters()}${filtersSearchString}` : ''}
      >
        <FormattedMessage id="ui-finc-select.navigation.filters" />
      </Button>
    </ButtonGroup>
  );
};

FincNavigation.propTypes = {
  id: PropTypes.string,
};

export default FincNavigation;

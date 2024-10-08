import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  ButtonGroup,
} from '@folio/stripes/components';

import urls from '../DisplayUtils/urls';

const FincNavigation = ({ id }) => {
  return (
    <ButtonGroup fullWidth data-test-navigation>
      <Button
        buttonStyle={id === 'source' ? 'primary' : 'default'}
        data-test-navigation-source
        id="metadata-sources"
        to={id !== 'source' ? urls.sources() : ''}
      >
        <FormattedMessage id="ui-finc-select.navigation.sources" />
      </Button>
      <Button
        buttonStyle={id === 'collection' ? 'primary' : 'default'}
        data-test-navigation-collection
        id="metadata-collections"
        to={id !== 'collection' ? urls.collections() : ''}
      >
        <FormattedMessage id="ui-finc-select.navigation.collections" />
      </Button>
      <Button
        buttonStyle={id === 'filter' ? 'primary' : 'default'}
        data-test-navigation-filter
        id="filters"
        to={id !== 'filter' ? urls.filters() : ''}
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

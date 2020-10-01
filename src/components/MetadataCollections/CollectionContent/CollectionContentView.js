import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  KeyValue,
  NoValue,
  Row,
} from '@folio/stripes/components';

class CollectionContentView extends React.Component {
  static propTypes = {
    metadataCollection: PropTypes.object,
  };

  render() {
    const { metadataCollection } = this.props;

    return (
      <React.Fragment>
        <Row>
          <KeyValue
            label={<FormattedMessage id="ui-finc-select.collection.description" />}
            value={_.get(metadataCollection, 'description', <NoValue />)}
          />
        </Row>
        <Row>
          <KeyValue
            label={<FormattedMessage id="ui-finc-select.collection.freeContent" />}
            value={_.upperFirst(_.get(metadataCollection, 'freeContent', <NoValue />))}
          />
        </Row>
      </React.Fragment>
    );
  }
}

export default CollectionContentView;

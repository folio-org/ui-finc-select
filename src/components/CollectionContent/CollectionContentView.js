import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
} from 'react-intl';
import {
  KeyValue,
  Row
} from '@folio/stripes/components';

class CollectionContentView extends React.Component {
  static propTypes = {
    metadataCollection: PropTypes.object.isRequired
  };

  render() {
    const { metadataCollection } = this.props;

    return (
      <React.Fragment>
        <div id="id">
          <Row>
            <KeyValue
              label={<FormattedMessage id="ui-finc-select.collection.description" />}
              value={_.get(metadataCollection, 'description', '-')}
            />
          </Row>
          <Row>
            <KeyValue
              label={<FormattedMessage id="ui-finc-select.collection.freeContent" />}
              value={_.get(metadataCollection, 'freeContent', '-')}
            />
          </Row>
          <Row>
            <KeyValue
              label={<FormattedMessage id="ui-finc-select.collection.note" />}
              value={_.get(metadataCollection, 'note', '-')}
            />
          </Row>
        </div>
      </React.Fragment>
    );
  }
}

export default CollectionContentView;

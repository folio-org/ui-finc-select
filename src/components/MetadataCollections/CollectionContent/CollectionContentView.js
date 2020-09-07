import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  KeyValue,
  NoValue,
  Row,
} from '@folio/stripes/components';

import freeContentOptions from '../../DataOptions/freeContent';

class CollectionContentView extends React.Component {
  static propTypes = {
    metadataCollection: PropTypes.object,
    id: PropTypes.string,
  };

  render() {
    const { metadataCollection, id } = this.props;

    const freeContentValue = _.get(metadataCollection, 'freeContent', '');
    const dataWithFreeContentValue = freeContentOptions.find(
      (e) => e.value === freeContentValue
    );
    const freeContentLabel = _.get(dataWithFreeContentValue, 'label', <NoValue />);


    return (
      <React.Fragment>
        <div id={id}>
          <Row>
            <KeyValue
              label={<FormattedMessage id="ui-finc-select.collection.description" />}
              value={_.get(metadataCollection, 'description', <NoValue />)}
            />
          </Row>
          <Row>
            <KeyValue
              label={<FormattedMessage id="ui-finc-select.collection.freeContent" />}
              value={freeContentLabel}
            />
          </Row>
        </div>
      </React.Fragment>
    );
  }
}

export default CollectionContentView;

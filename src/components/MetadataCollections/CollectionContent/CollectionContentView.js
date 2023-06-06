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

  getDataLable(field) {
    const fieldValue = _.get(this.props.metadataCollection, field, '');
    if (fieldValue !== '') {
      return <FormattedMessage id={`ui-finc-select.dataOption.${fieldValue}`} />;
    } else {
      return <NoValue />;
    }
  }

  render() {
    const { metadataCollection } = this.props;
    const freeContentLabel = this.getDataLable('freeContent');

    return (
      <>
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
      </>
    );
  }
}

export default CollectionContentView;

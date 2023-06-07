import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  KeyValue,
  NoValue,
  Row,
} from '@folio/stripes/components';

class SourceInfoView extends React.Component {
  static propTypes = {
    metadataSource: PropTypes.object,
  };

  getDataLable(field) {
    const fieldValue = _.get(this.props.metadataSource, field, '');
    if (fieldValue !== '') {
      return <FormattedMessage id={`ui-finc-select.dataOption.${fieldValue}`} />;
    } else {
      return <NoValue />;
    }
  }

  render() {
    const { metadataSource } = this.props;
    const implementationStatusLabel = this.getDataLable('status');

    return (
      <>
        <Row>
          <KeyValue
            label={<FormattedMessage id="ui-finc-select.source.label" />}
            value={_.get(metadataSource, 'label', <NoValue />)}
          />
        </Row>
        <Row>
          <KeyValue
            label={<FormattedMessage id="ui-finc-select.source.description" />}
            value={_.get(metadataSource, 'description', <NoValue />)}
          />
        </Row>
        <Row>
          <KeyValue
            label={<FormattedMessage id="ui-finc-select.source.status" />}
            value={implementationStatusLabel}
          />
        </Row>
      </>
    );
  }
}

export default SourceInfoView;

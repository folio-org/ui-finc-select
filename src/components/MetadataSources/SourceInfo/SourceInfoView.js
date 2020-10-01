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

  render() {
    const { metadataSource } = this.props;

    return (
      <React.Fragment>
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
            value={_.upperFirst(_.get(metadataSource, 'status', <NoValue />))}
          />
        </Row>
      </React.Fragment>
    );
  }
}

export default SourceInfoView;

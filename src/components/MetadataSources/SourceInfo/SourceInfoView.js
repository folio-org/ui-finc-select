import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  KeyValue,
  NoValue,
  Row,
} from '@folio/stripes/components';

import implementationStatusOptions from '../../DataOptions/implementationStatus';

class SourceInfoView extends React.Component {
  static propTypes = {
    metadataSource: PropTypes.object,
    stripes: PropTypes
      .shape({
        connect: PropTypes.func.isRequired,
      }),
    id: PropTypes.string,
  };

  render() {
    const { metadataSource, id } = this.props;
    const statusValue = _.get(metadataSource, 'status', '');
    const dataWithStatusValue = implementationStatusOptions.find(
      (e) => e.value === statusValue
    );
    const statusLabel = _.get(dataWithStatusValue, 'label', <NoValue />);

    return (
      <React.Fragment>
        <div id={id}>
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
              value={statusLabel}
            />
          </Row>
        </div>
      </React.Fragment>
    );
  }
}

export default SourceInfoView;

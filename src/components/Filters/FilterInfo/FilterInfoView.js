import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  KeyValue,
  NoValue,
  Row,
} from '@folio/stripes/components';

class FilterInfoView extends React.Component {
  static propTypes = {
    filter: PropTypes.object,
  };

  getDataLable(field) {
    const fieldValue = _.get(this.props.filter, field, '');
    if (fieldValue !== '') {
      return <FormattedMessage id={`ui-finc-select.dataOption.${fieldValue}`} />;
    } else {
      return <NoValue />;
    }
  }

  render() {
    const { filter } = this.props;
    const typeLabel = this.getDataLable('type');


    return (
      <>
        <Row>
          <KeyValue
            label={<FormattedMessage id="ui-finc-select.filter.label" />}
            value={_.get(filter, 'label', <NoValue />)}
          />
        </Row>
        <Row>
          <KeyValue
            label={<FormattedMessage id="ui-finc-select.filter.type" />}
            value={typeLabel}
          />
        </Row>
      </>
    );
  }
}
export default FilterInfoView;

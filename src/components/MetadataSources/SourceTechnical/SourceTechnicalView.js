import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Headline,
  KeyValue,
  List,
  NoValue,
  Row,
} from '@folio/stripes/components';

import BasicCss from '../../BasicStyle.css';

class SourceTechnicalView extends React.Component {
  static propTypes = {
    metadataSource: PropTypes.object,
  };

  renderUrlList = (values) => {
    const { metadataSource } = this.props;
    const isEmptyMessage = <FormattedMessage id="ui-finc-select.renderList.isEmpty" />;

    if (!metadataSource) {
      return isEmptyMessage;
    } else {
      const valueItems = metadataSource[values];
      const valueFormatter = (valueItem) => (<li key={valueItem}><a href={valueItem} target="_blank" rel="noopener noreferrer">{valueItem}</a></li>);

      return (
        <List
          isEmptyMessage={isEmptyMessage}
          items={valueItems}
          itemFormatter={valueFormatter}
        />
      );
    }
  }

  render() {
    const { metadataSource } = this.props;

    return (
      <React.Fragment>
        <Row>
          <KeyValue
            label={<FormattedMessage id="ui-finc-select.source.lastProcessed" />}
            value={_.get(metadataSource, 'lastProcessed', <NoValue />)}
          />
        </Row>
        {/* TICKET is repeatable */}
        <Row>
          <Headline
            className={BasicCss.styleForHeadline}
            size="medium"
          >
            <FormattedMessage id="ui-finc-select.source.tickets" />
          </Headline>
        </Row>
        <Row>
          { this.renderUrlList('tickets') }
        </Row>
        <Row>
          <KeyValue
            label={<FormattedMessage id="ui-finc-select.source.id" />}
            value={_.get(metadataSource, 'sourceId', <NoValue />)}
          />
        </Row>
      </React.Fragment>
    );
  }
}

export default SourceTechnicalView;

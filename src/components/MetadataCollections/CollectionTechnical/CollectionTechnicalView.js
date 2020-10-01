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

class CollectionTechnicalView extends React.Component {
  static propTypes = {
    metadataCollection: PropTypes.object,
  };

  renderUrlList = (values) => {
    const { metadataCollection } = this.props;
    const isEmptyMessage = <FormattedMessage id="ui-finc-select.renderList.isEmpty" />;

    if (!metadataCollection) {
      return isEmptyMessage;
    } else {
      const valueItems = metadataCollection[values];
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
    const { metadataCollection } = this.props;

    return (
      <React.Fragment>
        <Row>
          <KeyValue
            label={<FormattedMessage id="ui-finc-select.collection.id" />}
            value={_.get(metadataCollection, 'collectionId', <NoValue />)}
          />
        </Row>
        <Row>
          <KeyValue
            label={<FormattedMessage id="ui-finc-select.collection.generalNotes" />}
            value={_.get(metadataCollection, 'generalNotes', <NoValue />)}
          />
        </Row>
        <Row>
          <Headline
            className={BasicCss.styleForHeadline}
            size="medium"
          >
            <FormattedMessage id="ui-finc-select.collection.tickets" />
          </Headline>
        </Row>
        <Row>
          { this.renderUrlList('tickets') }
        </Row>
      </React.Fragment>
    );
  }
}

export default CollectionTechnicalView;

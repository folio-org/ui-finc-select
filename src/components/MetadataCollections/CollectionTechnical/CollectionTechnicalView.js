import PropTypes from 'prop-types';
import { get } from 'lodash';
import { FormattedMessage } from 'react-intl';

import {
  Headline,
  KeyValue,
  List,
  NoValue,
  Row,
} from '@folio/stripes/components';

import BasicCss from '../../BasicStyle.css';

const CollectionTechnicalView = ({ metadataCollection }) => {
  const renderUrlList = (values) => {
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
  };

  return (
    <>
      <Row>
        <KeyValue
          label={<FormattedMessage id="ui-finc-select.collection.id" />}
          value={get(metadataCollection, 'collectionId', <NoValue />)}
        />
      </Row>
      <Row>
        <KeyValue
          label={<FormattedMessage id="ui-finc-select.collection.generalNotes" />}
          value={get(metadataCollection, 'generalNotes', <NoValue />)}
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
        { renderUrlList('tickets') }
      </Row>
    </>
  );
};

CollectionTechnicalView.propTypes = {
  metadataCollection: PropTypes.object,
};


export default CollectionTechnicalView;

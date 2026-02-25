import { get } from 'lodash';
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

const SourceTechnicalView = ({ metadataSource }) => {
  const renderUrlList = (values) => {
    const isEmptyMessage = <FormattedMessage id="ui-finc-select.renderList.isEmpty" />;

    if (!metadataSource) {
      return isEmptyMessage;
    } else {
      const valueItems = metadataSource[values];
      const valueFormatter = valueItem => (
        <li key={valueItem}>
          <a href={valueItem} rel="noopener noreferrer" target="_blank">{valueItem}</a>
        </li>
      );

      return (
        <List
          isEmptyMessage={isEmptyMessage}
          itemFormatter={valueFormatter}
          items={valueItems}
        />
      );
    }
  };

  return (
    <>
      <Row>
        <KeyValue
          label={<FormattedMessage id="ui-finc-select.source.lastProcessed" />}
          value={get(metadataSource, 'lastProcessed', <NoValue />)}
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
        { renderUrlList('tickets') }
      </Row>
      <Row>
        <KeyValue
          label={<FormattedMessage id="ui-finc-select.source.id" />}
          value={get(metadataSource, 'sourceId', <NoValue />)}
        />
      </Row>
    </>
  );
};

SourceTechnicalView.propTypes = {
  metadataSource: PropTypes.object,
};

export default SourceTechnicalView;

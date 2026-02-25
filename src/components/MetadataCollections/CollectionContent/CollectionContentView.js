import { get } from 'lodash';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  KeyValue,
  NoValue,
  Row,
} from '@folio/stripes/components';

const CollectionContentView = ({ metadataCollection }) => {
  const getDataLable = (field) => {
    const fieldValue = get(metadataCollection, field, '');

    if (fieldValue !== '') {
      return <FormattedMessage id={`ui-finc-select.dataOption.${fieldValue}`} />;
    } else {
      return <NoValue />;
    }
  };

  const freeContentLabel = getDataLable('freeContent');

  return (
    <>
      <Row>
        <KeyValue
          label={<FormattedMessage id="ui-finc-select.collection.description" />}
          value={get(metadataCollection, 'description', <NoValue />)}
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
};

CollectionContentView.propTypes = {
  metadataCollection: PropTypes.object,
};

export default CollectionContentView;

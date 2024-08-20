import PropTypes from 'prop-types';
import { get } from 'lodash';
import { FormattedMessage } from 'react-intl';

import {
  KeyValue,
  NoValue,
  Row,
} from '@folio/stripes/components';

const SourceInfoView = ({ metadataSource }) => {
  const getDataLable = (field) => {
    const fieldValue = get(metadataSource, field, '');
    if (fieldValue !== '') {
      return <FormattedMessage id={`ui-finc-select.dataOption.${fieldValue}`} />;
    } else {
      return <NoValue />;
    }
  };

  const implementationStatusLabel = getDataLable('status');

  return (
    <>
      <Row>
        <KeyValue
          label={<FormattedMessage id="ui-finc-select.source.label" />}
          value={get(metadataSource, 'label', <NoValue />)}
        />
      </Row>
      <Row>
        <KeyValue
          label={<FormattedMessage id="ui-finc-select.source.description" />}
          value={get(metadataSource, 'description', <NoValue />)}
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
};

SourceInfoView.propTypes = {
  metadataSource: PropTypes.object,
};

export default SourceInfoView;

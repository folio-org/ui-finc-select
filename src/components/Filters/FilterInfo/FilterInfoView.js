import { get } from 'lodash';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  KeyValue,
  NoValue,
  Row,
} from '@folio/stripes/components';

const FilterInfoView = ({
  filter,
}) => {
  const getDataLable = (field) => {
    const fieldValue = get(filter, field, '');

    if (fieldValue !== '') {
      return <FormattedMessage id={`ui-finc-select.dataOption.${fieldValue}`} />;
    } else {
      return <NoValue />;
    }
  };

  const typeLabel = getDataLable('type');

  return (
    <>
      <Row>
        <KeyValue
          label={<FormattedMessage id="ui-finc-select.filter.label" />}
          value={get(filter, 'label', <NoValue />)}
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
};

FilterInfoView.propTypes = {
  filter: PropTypes.object,
};

export default FilterInfoView;

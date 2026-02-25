import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';

import {
  Accordion,
  Col,
  Row,
  Select,
  TextField,
} from '@folio/stripes/components';

import typeOptions from '../../DataOptions/type';
import Required from '../../DisplayUtils/Validate';

const FilterInfoForm = ({
  accordionId,
  expanded,
  onToggle,
}) => {
  const intl = useIntl();

  const getDataOptions = (field) => {
    return field.map((item) => ({
      label: intl.formatMessage({ id: `ui-finc-select.dataOption.${item.value}` }),
      value: item.value,
    }));
  };

  return (
    <Accordion
      id={accordionId}
      label={<FormattedMessage id="ui-finc-select.filter.generalAccordion" />}
      onToggle={onToggle}
      open={expanded}
    >
      <Row>
        <Col xs={8}>
          <Field
            component={TextField}
            fullWidth
            id="addfilter_label"
            label={<FormattedMessage id="ui-finc-select.filter.label" />}
            name="label"
            required
            validate={Required}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={8}>
          <Field
            component={Select}
            dataOptions={getDataOptions(typeOptions)}
            fullWidth
            id="addfilter_type"
            label={<FormattedMessage id="ui-finc-select.filter.type" />}
            name="type"
            placeholder=" "
            required
            validate={Required}
          />
        </Col>
      </Row>
    </Accordion>
  );
};

FilterInfoForm.propTypes = {
  accordionId: PropTypes.string.isRequired,
  expanded: PropTypes.bool,
  onToggle: PropTypes.func,
};

export default FilterInfoForm;

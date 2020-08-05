import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  Col,
  Row,
  Select,
  TextField
} from '@folio/stripes/components';

import { Required } from '../../DisplayUtils/Validate';

class FilterInfoForm extends React.Component {
  render() {
    const { expanded, onToggle, accordionId } = this.props;
    const dataType = [
      { value: 'Whitelist', label: 'Whitelist' },
      { value: 'Blacklist', label: 'Blacklist' }
    ];

    return (
      <Accordion
        id={accordionId}
        label={<FormattedMessage id="ui-finc-select.filter.generalAccordion" />}
        open={expanded}
        onToggle={onToggle}
      >
        <Row>
          <Col xs={8}>
            <Field
              component={TextField}
              fullWidth
              id="addfilter_label"
              label={<FormattedMessage id="ui-finc-select.filter.label" />}
              name="label"
              placeholder="Enter a name to identify the filter"
              required
              validate={Required}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={8}>
            <Field
              component={Select}
              dataOptions={dataType}
              fullWidth
              id="addfilter_type"
              label={<FormattedMessage id="ui-finc-select.filter.type" />}
              name="type"
              placeholder="Enter a type for the filter"
              required
              validate={Required}
            />
          </Col>
        </Row>
      </Accordion>
    );
  }
}

FilterInfoForm.propTypes = {
  accordionId: PropTypes.string.isRequired,
  expanded: PropTypes.bool,
  onToggle: PropTypes.func,
};

export default FilterInfoForm;

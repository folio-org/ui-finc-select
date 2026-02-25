import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { useFieldArray } from 'react-final-form-arrays';
import {
  FormattedMessage,
  injectIntl,
} from 'react-intl';

import { EditCard } from '@folio/stripes-leipzig-components';
import {
  Button,
  Col,
  Layout,
  Row,
  TextField,
} from '@folio/stripes/components';

import Required from '../../../DisplayUtils/Validate';
import FileUploaderField from './FileUploaderField';

const DocumentsFieldArray = ({
  intl,
  name,
  onUploadFile,
}) => {
  const { fields } = useFieldArray(name);

  const renderFileUpload = (field, i) => {
    const file = fields.value[i];

    if (file?.fileId) {
      const filename = file.label;
      const fileConnectedText = <FormattedMessage id="ui-finc-select.filter.file.connected" values={{ filename }} />;
      return (
        <Col md={6} xs={12}>
          <p>{fileConnectedText}</p>
        </Col>
      );
    } else {
      return (
        <>
          {onUploadFile &&
            <Col md={6} xs={12}>
              <Field
                component={FileUploaderField}
                id={`filter-file-card-fileId-${i}`}
                name={`${field}.fileId`}
                onUploadFile={onUploadFile}
                required
                validate={Required}
              />
            </Col>
          }
        </>
      );
    }
  };

  const renderFields = () => {
    return fields.map((field, index) => (
      <EditCard
        key={field}
        deleteButtonTooltipText={intl.formatMessage(
          { id: 'ui-finc-select.filter.file.label.delete.number' },
          { number: index + 1 }
        )}
        header={intl.formatMessage(
          { id: 'ui-finc-select.filter.file.label.number' },
          { number: index + 1 }
        )}
        onDelete={() => fields.remove(index)}
      >
        <Row>
          <Col md={onUploadFile ? 6 : 12} xs={12}>
            <Row>
              <Col xs={12}>
                <Field
                  autoFocus
                  component={TextField}
                  id={`filter-file-label-${index}`}
                  label={<FormattedMessage id="ui-finc-select.filter.file.label" />}
                  name={`${field}.label`}
                  placeholder={intl.formatMessage({ id: 'ui-finc-select.filter.file.placeholder.name' })}
                  required
                  validate={Required}
                />
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                <Field
                  component={TextField}
                  id={`filter-file-criteria-${index}`}
                  label={<FormattedMessage id="ui-finc-select.filter.file.criteria" />}
                  name={`${field}.criteria`}
                />
              </Col>
            </Row>
          </Col>
          {renderFileUpload(field, index)}
        </Row>
      </EditCard>
    ));
  };

  const renderEmpty = () => (
    <Layout className="padding-bottom-gutter">
      <FormattedMessage id="ui-finc-select.filter.file.empty" />
    </Layout>
  );

  return (
    <div>
      <div>
        { fields.length ? renderFields() : renderEmpty() }
      </div>
      <Button
        id="add-filter-file-btn"
        onClick={() => fields.push({})}
      >
        <FormattedMessage id="ui-finc-select.filter.file.addFile" />
      </Button>
    </div>
  );
};

DocumentsFieldArray.propTypes = {
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }),
  name: PropTypes.string.isRequired,
  onUploadFile: PropTypes.func,
};

export default injectIntl(DocumentsFieldArray);

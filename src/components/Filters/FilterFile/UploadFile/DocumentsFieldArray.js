import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';
import { useFieldArray } from 'react-final-form-arrays';

import {
  Button,
  Col,
  Layout,
  Row,
  TextField,
} from '@folio/stripes/components';

import EditCard from '../../../DisplayUtils/EditCard/EditCard';
import FileUploaderField from './FileUploaderField';
import Required from '../../../DisplayUtils/Validate';

const DocumentsFieldArray = ({
  intl,
  fields: { name },
  onUploadFile,
}) => {
  const { fields } = useFieldArray(name);

  const renderFileUpload = (doc, i) => {
    if (isEmpty(doc.fileId)) {
      return (
        <>
          {onUploadFile &&
            <Col xs={12} md={6}>
              <Row>
                <Col xs={12}>
                  <Field
                    component={FileUploaderField}
                    data-test-filter-file-card-fileid
                    fileLabel={doc.label}
                    id={`filter-file-card-fileId-${i}`}
                    name={`${name}[${i}].fileId`}
                    onUploadFile={onUploadFile}
                    required
                    validate={Required}
                  />
                </Col>
              </Row>
            </Col>
          }
        </>
      );
    } else {
      const filename = doc.label;
      const fileConnectedText = <FormattedMessage id="ui-finc-select.filter.file.connected" values={{ filename }} />;
      return (
        <>
          {fileConnectedText}
        </>
      );
    }
  };

  const renderDocs = () => {
    return fields.map((doc, i) => (
      <EditCard
        data-test-filter-file
        deletebuttonarialabel={`delete filter file ${name}`}
        deleteBtnProps={{
          'id': `${name}-delete-${i}`,
          'data-test-delete-filter-file-button': true
        }}
        header={<FormattedMessage id="ui-finc-select.filter.file.label" values={{ number: i + 1 }} />}
        key={fields.value[i].fileId}
        onDelete={() => fields.remove(i)}
      >
        <Row>
          <Col xs={12} md={onUploadFile ? 6 : 12}>
            <Row>
              <Col xs={12}>
                <Field
                  autoFocus
                  component={TextField}
                  data-test-filter-file-label
                  id={`filter-file-label-${i}`}
                  label={<FormattedMessage id="ui-finc-select.filter.file.label" />}
                  name={`${name}[${i}].label`}
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
                  data-test-filter-file-criteria
                  id={`filter-file-criteria-${i}`}
                  label={<FormattedMessage id="ui-finc-select.filter.file.criteria" />}
                  name={`${name}[${i}].criteria`}
                />
              </Col>
            </Row>
          </Col>
          {renderFileUpload(doc, i)}
        </Row>
      </EditCard>
    ));
  };

  const renderEmpty = () => (
    <Layout
      data-test-filter-file-card-empty-message
      className="padding-bottom-gutter"
    >
      <FormattedMessage id="ui-finc-select.filter.file.empty" />
    </Layout>
  );

  return (
    <div data-test-filter-file-card>
      <div>
        { fields.length ? renderDocs() : renderEmpty() }
      </div>
      <Button
        data-test-filter-file-card-add-button
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
  name: PropTypes.string,
  fields: PropTypes.shape({
    name: PropTypes.string,
  }),
  onUploadFile: PropTypes.func,
};

export default injectIntl(DocumentsFieldArray);

import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { FormattedMessage } from 'react-intl';
import { Field } from 'redux-form';

import {
  Button,
  Col,
  Layout,
  Row,
  Select,
  TextField,
} from '@folio/stripes/components';

import EditCard from './EditCard';
import FileUploaderField from './FileUploaderField';
import withKiwtFieldArray from './withKiwtFieldArray';

class DocumentsFieldArray extends React.Component {
  static propTypes = {
    addDocBtnLabel: PropTypes.node,
    onDownloadFile: PropTypes.func,
    onUploadFile: PropTypes.func,
    isEmptyMessage: PropTypes.node,
    items: PropTypes.arrayOf(PropTypes.object),
    name: PropTypes.string.isRequired,
    onAddField: PropTypes.func.isRequired,
    onDeleteField: PropTypes.func.isRequired,
    documentCategories: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
    })),
  }

  static defaultProps = {
    addDocBtnLabel: 'addDocBtnLabel',
    isEmptyMessage: 'isEmptyMessage',
  }

  validateDocIsSpecified = (value, allValues, props, fieldName) => {
    const index = parseInt(/\[([0-9]*)\]/.exec(fieldName)[1], 10);
    const { fileUpload, name } = get(allValues, [this.props.name, index], {});
    if (name && (!fileUpload)) {
      return 'add name and file';
    }

    return undefined;
  }

  validateRequired = (value) => (
    !value ? 'missingRequiredField' : undefined
  )

  renderCategory = (i) => {
    const { documentCategories, name } = this.props;

    if (get(documentCategories, 'length', 0) === 0) return null;

    return (
      <Row>
        <Col xs={12}>
          <FormattedMessage id="stripes-erm-components.placeholder.documentCategory">
            {placeholder => (
              <Field
                component={Select}
                data-test-document-field-category
                dataOptions={documentCategories}
                id={`${name}-category-${i}`}
                label={<FormattedMessage id="stripes-erm-components.doc.category" />}
                name={`${name}[${i}].atType`}
                placeholder={placeholder}
              />
            )}
          </FormattedMessage>
        </Col>
      </Row>
    );
  }

  renderDocs = () => {
    const {
      onDownloadFile,
      onUploadFile,
      items,
      name,
      onDeleteField
    } = this.props;

    return items.map((doc, i) => (
      <EditCard
        data-test-document-field
        deleteBtnProps={{
          'id': `${name}-delete-${i}`,
          'data-test-delete-field-button': true
        }}
        header={<FormattedMessage id="stripes-erm-components.doc.title" values={{ number: i + 1 }} />}
        key={i}
        onDelete={() => onDeleteField(i, doc)}
      >
        <Row>
          <Col xs={12} md={onUploadFile ? 6 : 12}>
            <Row>
              <Col xs={12}>
                <Field
                  data-test-document-field-name
                  component={TextField}
                  id={`${name}-name-${i}`}
                  label="doc name"
                  name={`${name}[${i}].name`}
                  required
                  validate={this.validateRequired}
                />
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                <Field
                  component={TextField}
                  data-test-document-field-criteria
                  id={`${name}-url-${i}`}
                  label={<FormattedMessage id="criteria" />}
                  name={`${name}[${i}].criteria`}
                  // validate={[
                  //   this.validateDocIsSpecified
                  // ]}
                />
              </Col>
            </Row>
            { this.renderCategory(i) }
          </Col>
          {onUploadFile &&
            <Col xs={12} md={6}>
              <Row>
                <Col xs={12}>
                  <Field
                    component={FileUploaderField}
                    data-test-document-field-file
                    id={`${name}-file-${i}`}
                    label="filter file"
                    name={`${name}[${i}].fileUpload`}
                    onDownloadFile={onDownloadFile}
                    onUploadFile={onUploadFile}
                    validate={this.validateDocIsSpecified}
                  />
                </Col>
              </Row>
            </Col>
          }
        </Row>
      </EditCard>
    ));
  }

  renderEmpty = () => (
    <Layout data-test-document-field-empty-message className="padding-bottom-gutter">
      { this.props.isEmptyMessage }
    </Layout>
  )

  render() {
    const { items, name, onAddField } = this.props;

    return (
      <div data-test-documents-field-array>
        <div>
          { items.length ? this.renderDocs() : this.renderEmpty() }
        </div>
        <Button
          data-test-documents-field-array-add-button
          id={`add-${name}-btn`}
          onClick={() => onAddField({})}
        >
          { this.props.addDocBtnLabel }
        </Button>
      </div>
    );
  }
}

export default withKiwtFieldArray(DocumentsFieldArray);
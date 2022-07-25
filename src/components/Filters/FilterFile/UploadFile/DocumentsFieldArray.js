import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import {
  injectIntl,
  FormattedMessage
} from 'react-intl';
import { Field } from 'react-final-form';

import {
  Button,
  Col,
  Layout,
  Row,
  TextField,
} from '@folio/stripes/components';
import {
  EditCard,
  withKiwtFieldArray,
} from '@folio/stripes-erm-components';

import FileUploaderField from './FileUploaderField';
import Required from '../../../DisplayUtils/Validate';

class DocumentsFieldArray extends React.Component {
  static propTypes = {
    addDocBtnLabel: PropTypes.node,
    intl: PropTypes.shape({
      formatMessage: PropTypes.func.isRequired,
    }),
    isEmptyMessage: PropTypes.node,
    items: PropTypes.arrayOf(PropTypes.object),
    name: PropTypes.string.isRequired,
    onAddField: PropTypes.func.isRequired,
    onDeleteField: PropTypes.func.isRequired,
    onUploadFile: PropTypes.func,
  }

  static defaultProps = {
    addDocBtnLabel: <FormattedMessage id="ui-finc-select.filter.file.addFile" />,
    isEmptyMessage: <FormattedMessage id="ui-finc-select.filter.file.empty" />,
  }

  renderFileUpload = (doc, onUploadFile, name, i) => {
    if (_.isEmpty(doc.fileId)) {
      return (
        <React.Fragment>
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
        </React.Fragment>
      );
    } else {
      const filename = doc.label;
      const fileConnectedText = <FormattedMessage id="ui-finc-select.filter.file.connected" values={{ filename }} />;
      return (
        <React.Fragment>
          {fileConnectedText}
        </React.Fragment>
      );
    }
  }

  renderDocs = () => {
    const {
      onUploadFile,
      intl,
      items,
      name,
      onDeleteField
    } = this.props;

    return items.map((doc, i) => (
      <EditCard
        data-test-filter-file
        deletebuttonarialabel={`delete filter file ${name}`}
        deleteBtnProps={{
          'id': `${name}-delete-${i}`,
          'data-test-delete-filter-file-button': true
        }}
        header={<FormattedMessage id="ui-finc-select.filter.file.label" values={{ number: i + 1 }} />}
        key={i}
        onDelete={() => onDeleteField(i, doc)}
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
          {this.renderFileUpload(doc, onUploadFile, name, i)}
        </Row>
      </EditCard>
    ));
  }

  renderEmpty = () => (
    <Layout
      data-test-filter-file-card-empty-message
      className="padding-bottom-gutter"
    >
      { this.props.isEmptyMessage }
    </Layout>
  )

  render() {
    const { items, onAddField } = this.props;

    return (
      <div data-test-filter-file-card>
        <div>
          { items.length ? this.renderDocs() : this.renderEmpty() }
        </div>
        <Button
          data-test-filter-file-card-add-button
          id="add-filter-file-btn"
          onClick={() => onAddField()}
        >
          { this.props.addDocBtnLabel }
        </Button>
      </div>
    );
  }
}

export default withKiwtFieldArray(injectIntl(DocumentsFieldArray));

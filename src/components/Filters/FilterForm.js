import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  AccordionSet,
  Button,
  Col,
  ConfirmationModal,
  ExpandAllButton,
  Icon,
  IconButton,
  Pane,
  PaneFooter,
  PaneMenu,
  Paneset,
  Row,
} from '@folio/stripes/components';
import { ViewMetaData } from '@folio/stripes/smart-components';
import { IfPermission } from '@folio/stripes/core';
import stripesFinalForm from '@folio/stripes/final-form';

import FilterInfoForm from './FilterInfo/FilterInfoForm';
import FilterFileForm from './FilterFile/FilterFileForm';
import CollectionsForm from './Collections/CollectionsForm';
import BasicStyle from '../BasicStyle.css';

class FilterForm extends React.Component {
  static propTypes = {
    collectionIds: PropTypes.arrayOf(PropTypes.object),
    filterData: PropTypes.shape({
      mdSources: PropTypes.array,
    }),
    handlers: PropTypes.PropTypes.shape({
      onClose: PropTypes.func.isRequired,
    }),
    handleSubmit: PropTypes.func.isRequired,
    initialValues: PropTypes.object,
    invalid: PropTypes.bool,
    isLoading: PropTypes.bool,
    onCancel: PropTypes.func,
    onDelete: PropTypes.func,
    onSubmit: PropTypes.func,
    pristine: PropTypes.bool,
    stripes: PropTypes.shape({
      okapi: PropTypes.object,
    }),
    submitting: PropTypes.bool,
  };

  static defaultProps = {
    initialValues: {},
  }

  constructor(props) {
    super(props);

    this.state = {
      confirmDelete: false,
      sections: {
        editFilterInfo: true,
        editFilterFile: true,
        editCollections: true
      },
    };

    this.handleExpandAll = this.handleExpandAll.bind(this);
  }

  beginDelete = () => {
    this.setState({
      confirmDelete: true,
    });
  }

  confirmDelete = (confirmation) => {
    if (confirmation) {
      this.deleteFilter();
    } else {
      this.setState({ confirmDelete: false });
    }
  }

  getFirstMenu() {
    return (
      <PaneMenu>
        <FormattedMessage id="ui-finc-select.form.close">
          { ariaLabel => (
            <IconButton
              ariaLabel={ariaLabel}
              icon="times"
              id="clickable-closefilterdialog"
              onClick={this.props.handlers.onClose}
            />
          )}
        </FormattedMessage>
      </PaneMenu>
    );
  }

  getLastMenu() {
    const { initialValues } = this.props;
    const { confirmDelete } = this.state;
    const isEditing = initialValues && initialValues.id;

    return (
      <PaneMenu>
        {isEditing && (
        <IfPermission perm="finc-select.filters.item.delete">
          <Button
            buttonStyle="danger"
            disabled={confirmDelete}
            id="clickable-delete-filter"
            marginBottom0
            onClick={this.beginDelete}
            title="delete"
          >
            <FormattedMessage id="ui-finc-select.form.delete" />
          </Button>
        </IfPermission>
        )}
      </PaneMenu>
    );
  }

  getPaneFooter() {
    const {
      handlers: { onClose },
      handleSubmit,
      invalid,
      pristine,
      submitting
    } = this.props;

    const disabled = pristine || submitting || invalid;

    const startButton = (
      <Button
        buttonStyle="default mega"
        data-test-filter-form-cancel-button
        id="clickable-close-filter-form"
        marginBottom0
        onClick={onClose}
      >
        <FormattedMessage id="ui-finc-select.form.cancel" />
      </Button>
    );

    const endButton = (
      <Button
        buttonStyle="primary mega"
        data-test-filter-form-submit-button
        disabled={disabled}
        id="clickable-savefilter"
        marginBottom0
        onClick={handleSubmit}
        type="submit"
      >
        <FormattedMessage id="ui-finc-select.form.saveAndClose" />
      </Button>
    );

    return <PaneFooter renderStart={startButton} renderEnd={endButton} />;
  }

  handleExpandAll(sections) {
    this.setState({ sections });
  }

  handleSectionToggle = ({ id }) => {
    this.setState((state) => {
      const newState = _.cloneDeep(state);

      newState.sections[id] = !newState.sections[id];
      return newState;
    });
  }

  handleDelete = () => {
    this.props.onDelete();
  }

  render() {
    const { initialValues, isLoading } = this.props;
    const { confirmDelete, sections } = this.state;
    const paneTitle = initialValues.id ? initialValues.label : <FormattedMessage id="ui-finc-select.form.create" />;

    const firstMenu = this.getFirstMenu();
    const lastMenu = this.getLastMenu();
    const footer = this.getPaneFooter();
    const name = initialValues.label;

    if (isLoading) return <Icon icon="spinner-ellipsis" width="10px" />;

    return (
      <form
        className={BasicStyle.styleForFormRoot}
        data-test-filter-form-page
        id="form-filter"
      >
        <Paneset isRoot>
          <Pane
            defaultWidth="100%"
            firstMenu={firstMenu}
            footer={footer}
            lastMenu={lastMenu}
            paneTitle={paneTitle}
          >
            <div className={BasicStyle.styleForFormContent}>
              <AccordionSet>
                <Row end="xs">
                  <Col xs>
                    <ExpandAllButton
                      accordionStatus={sections}
                      id="clickable-expand-all"
                      onToggle={this.handleExpandAll}
                      setStatus={null}
                    />
                  </Col>
                </Row>
                {initialValues.metadata &&
                  initialValues.metadata.createdDate && (
                    <ViewMetaData metadata={initialValues.metadata} />
                )}
                <FilterInfoForm
                  accordionId="editFilterInfo"
                  expanded={sections.editFilterInfo}
                  onToggle={this.handleSectionToggle}
                  {...this.props}
                />
                <FilterFileForm
                  accordionId="editFilterFile"
                  expanded={sections.editFilterFile}
                  onToggle={this.handleSectionToggle}
                  {...this.props}
                />
                <CollectionsForm
                  accordionId="editCollections"
                  collectionIds={this.props.collectionIds}
                  expanded={sections.editCollections}
                  filterData={this.props.filterData}
                  filterId={initialValues.id}
                  onToggle={this.handleSectionToggle}
                  {...this.props}
                />
              </AccordionSet>
              <ConfirmationModal
                heading={<FormattedMessage id="ui-finc-select.form.delete" />}
                id="delete-filter-confirmation"
                message={<FormattedMessage
                  id="ui-finc-select.form.delete.confirm.message"
                  values={{ name }}
                />}
                onCancel={() => { this.confirmDelete(false); }}
                onConfirm={() => this.props.onDelete()}
                open={confirmDelete}
              />
            </div>
          </Pane>
        </Paneset>
      </form>
    );
  }
}

export default stripesFinalForm({
  // set navigationCheck true for confirming changes
  navigationCheck: true,
  // the form will reinitialize every time the initialValues prop changes
  enableReinitialize: true,
  mutators: {
    setCollection: (args, state, tools) => {
      tools.changeValue(state, 'collectionIds', () => args[1]);
    },
  },
})(FilterForm);

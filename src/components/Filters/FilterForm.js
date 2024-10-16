import PropTypes from 'prop-types';
import { useState } from 'react';
import { isEqual } from 'lodash';
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
  PaneHeader,
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

const FilterForm = ({
  collectionIds,
  filterData,
  handlers,
  handleSubmit,
  initialValues = {},
  invalid,
  isLoading,
  onDelete,
  pristine,
  submitting,
  ...props
}) => {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [sections, setSections] = useState(
    {
      editFilterInfo: true,
      editFilterFile: true,
      editCollections: true
    }
  );

  const handleExpandAll = (s) => {
    setSections(s);
  };

  const handleSectionToggle = ({ id }) => {
    setSections((prevSections) => ({ ...prevSections, [id]: !prevSections[id] }));
  };

  const beginDelete = () => {
    setConfirmDelete(true);
  };

  const doConfirmDelete = (confirmation) => {
    if (confirmation) {
      onDelete();
    } else {
      setConfirmDelete(false);
    }
  };

  const getFirstMenu = () => {
    return (
      <PaneMenu>
        <FormattedMessage id="ui-finc-select.form.close">
          { ([ariaLabel]) => (
            <IconButton
              aria-label={ariaLabel}
              icon="times"
              id="clickable-closefilterdialog"
              onClick={handlers.onClose}
            />
          )}
        </FormattedMessage>
      </PaneMenu>
    );
  };

  const getLastMenu = () => {
    const isEditing = initialValues?.id;

    return (
      <PaneMenu>
        {isEditing && (
        <IfPermission perm="finc-select.filters.item.delete">
          <Button
            buttonStyle="danger"
            disabled={confirmDelete}
            id="clickable-delete-filter"
            marginBottom0
            onClick={beginDelete}
            title="delete"
          >
            <FormattedMessage id="ui-finc-select.form.delete" />
          </Button>
        </IfPermission>
        )}
      </PaneMenu>
    );
  };

  const getPaneFooter = () => {
    const disabled = pristine || submitting || invalid;

    const startButton = (
      <Button
        buttonStyle="default mega"
        data-test-filter-form-cancel-button
        id="clickable-close-filter-form"
        marginBottom0
        onClick={handlers.onClose}
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
        <FormattedMessage id="stripes-components.saveAndClose" />
      </Button>
    );

    return <PaneFooter renderStart={startButton} renderEnd={endButton} />;
  };

  const renderPaneHeader = () => {
    const paneTitle = initialValues.id ? initialValues.label : <FormattedMessage id="ui-finc-select.form.create" />;

    return (
      <PaneHeader
        firstMenu={getFirstMenu()}
        lastMenu={getLastMenu()}
        paneTitle={paneTitle}
      />
    );
  };

  const footer = getPaneFooter();
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
          footer={footer}
          renderHeader={renderPaneHeader}
        >
          <div className={BasicStyle.styleForFormContent}>
            <AccordionSet>
              <Row end="xs">
                <Col xs>
                  <ExpandAllButton
                    accordionStatus={sections}
                    id="clickable-expand-all"
                    onToggle={handleExpandAll}
                    setStatus={null}
                  />
                </Col>
              </Row>
              {initialValues.metadata?.createdDate && (
                <ViewMetaData metadata={initialValues.metadata} />
              )}
              <FilterInfoForm
                accordionId="editFilterInfo"
                expanded={sections.editFilterInfo}
                onToggle={handleSectionToggle}
                {...props}
              />
              <FilterFileForm
                accordionId="editFilterFile"
                expanded={sections.editFilterFile}
                onToggle={handleSectionToggle}
                {...props}
              />
              <CollectionsForm
                accordionId="editCollections"
                collectionIds={collectionIds}
                expanded={sections.editCollections}
                filterData={filterData}
                filterId={initialValues.id}
                onToggle={handleSectionToggle}
                {...props}
              />
            </AccordionSet>
            <ConfirmationModal
              heading={<FormattedMessage id="ui-finc-select.form.delete" />}
              id="delete-filter-confirmation"
              message={<FormattedMessage
                id="ui-finc-select.form.delete.confirm.message"
                values={{ name }}
              />}
              onCancel={() => { doConfirmDelete(false); }}
              onConfirm={() => onDelete()}
              open={confirmDelete}
            />
          </div>
        </Pane>
      </Paneset>
    </form>
  );
};

FilterForm.propTypes = {
  collectionIds: PropTypes.arrayOf(PropTypes.object),
  filterData: PropTypes.shape({
    mdSources: PropTypes.arrayOf(PropTypes.object),
  }),
  handlers: PropTypes.PropTypes.shape({
    onClose: PropTypes.func.isRequired,
  }),
  handleSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.object,
  invalid: PropTypes.bool,
  isLoading: PropTypes.bool,
  onDelete: PropTypes.func,
  pristine: PropTypes.bool,
  submitting: PropTypes.bool,
};

export default stripesFinalForm({
  initialValuesEqual: (a, b) => isEqual(a, b),
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

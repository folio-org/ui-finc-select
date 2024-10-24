
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { useRef, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import {
  AccordionSet,
  Accordion,
  Button,
  Col,
  ExpandAllButton,
  Icon,
  Layout,
  NoValue,
  Pane,
  PaneHeader,
  PaneMenu,
  Row,
} from '@folio/stripes/components';
import { ViewMetaData } from '@folio/stripes/smart-components';

import FilterInfoView from './FilterInfo/FilterInfoView';
import FilterFileView from './FilterFile/FilterFileView';
import CollectionsView from './Collections/CollectionsView';

const FilterView = ({
  canEdit,
  collectionIds,
  handlers,
  isLoading,
  record,
  stripes,
}) => {
  const [accordions, setAccordions] = useState(
    {
      fileAccordion: false,
      collectionAccordion: false
    }
  );

  const editButton = useRef(null);

  const handleExpandAll = (obj) => {
    setAccordions(obj);
  };

  const handleAccordionToggle = ({ id }) => {
    setAccordions({ ...accordions, [id]: !accordions[id] });
  };

  const renderEditPaneMenu = () => {
    return (
      <PaneMenu>
        {canEdit && (
          <Button
            aria-label={<FormattedMessage id="ui-finc-select.edit" />}
            buttonRef={editButton}
            buttonStyle="primary"
            id="clickable-edit-filter"
            marginBottom0
            onClick={handlers.onEdit}
          >
            <FormattedMessage id="ui-finc-select.edit" />
          </Button>
        )}
      </PaneMenu>
    );
  };

  const renderLoadingPaneHeader = () => {
    return (
      <PaneHeader
        dismissible
        onClose={handlers.onClose}
        paneTitle={<span data-test-filter-header-title>loading</span>}
      />
    );
  };

  const renderDetailsPaneHeader = () => {
    const label = get(record, 'label', <NoValue />);

    return (
      <PaneHeader
        dismissible
        lastMenu={renderEditPaneMenu()}
        onClose={handlers.onClose}
        paneTitle={<span data-test-filter-header-title>{label}</span>}
      />
    );
  };

  const renderLoadingPane = () => {
    return (
      <Pane
        defaultWidth="40%"
        id="pane-filterdetails"
        renderHeader={renderLoadingPaneHeader}
      >
        <Layout className="marginTop1">
          <Icon icon="spinner-ellipsis" width="10px" />
        </Layout>
      </Pane>
    );
  };

  if (isLoading) return renderLoadingPane();

  const docs = get(record, 'filterFiles', []);

  return (
    <Pane
      data-test-filter-pane-details
      defaultWidth="40%"
      id="pane-filterdetails"
      renderHeader={renderDetailsPaneHeader}
    >
      <AccordionSet>
        <ViewMetaData
          metadata={get(record, 'metadata', {})}
          stripes={stripes}
        />
        <FilterInfoView
          filter={record}
          id="filterInfo"
          stripes={stripes}
        />
        <Row end="xs">
          <Col xs>
            <ExpandAllButton
              accordionStatus={accordions}
              onToggle={handleExpandAll}
              setStatus={null}
            />
          </Col>
        </Row>
        <Accordion
          id="fileAccordion"
          label={<FormattedMessage id="ui-finc-select.filter.fileAccordion" />}
          onToggle={handleAccordionToggle}
          open={accordions.fileAccordion}
        >
          <FilterFileView
            docs={docs}
            filter={record}
            id="filterInfo"
            stripes={stripes}
          />
        </Accordion>
        <Accordion
          id="collectionAccordion"
          label={<FormattedMessage id="ui-finc-select.filter.collectionAccordion" />}
          onToggle={handleAccordionToggle}
          open={accordions.collectionAccordion}
        >
          <CollectionsView
            collectionIds={collectionIds}
            filter={record}
            id="collections"
            stripes={stripes}
          />
        </Accordion>
      </AccordionSet>
    </Pane>
  );
};

FilterView.propTypes = {
  canEdit: PropTypes.bool,
  collectionIds: PropTypes.arrayOf(PropTypes.object),
  handlers: PropTypes.shape({
    onClose: PropTypes.func.isRequired,
    onEdit: PropTypes.func,
  }).isRequired,
  isLoading: PropTypes.bool,
  record: PropTypes.object,
  stripes: PropTypes.shape({
    connect: PropTypes.func,
  }),
};

export default FilterView;

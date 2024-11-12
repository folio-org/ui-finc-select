import PropTypes from 'prop-types';
import { get } from 'lodash';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';

import {
  AccordionSet,
  Accordion,
  Col,
  ExpandAllButton,
  Icon,
  Layout,
  NoValue,
  Pane,
  PaneHeader,
  Row,
} from '@folio/stripes/components';
import { ViewMetaData } from '@folio/stripes/smart-components';

import SourceInfoView from './SourceInfo/SourceInfoView';
import SourceManagementView from './SourceManagement/SourceManagementView';
import SourceTechnicalView from './SourceTechnical/SourceTechnicalView';

const MetadataSourceView = ({
  handlers,
  history,
  isLoading,
  record,
  stripes,
}) => {
  const [accordionsState, setAccordionsState] = useState({
    managementAccordion: false,
    technicalAccordion: false
  });

  const handleExpandAll = (obj) => {
    setAccordionsState(obj);
  };

  const handleAccordionToggle = ({ id }) => {
    setAccordionsState({ ...accordionsState, [id]: !accordionsState[id] });
  };

  const renderLoadingPaneHeader = () => {
    return (
      <PaneHeader
        dismissible
        onClose={handlers.onClose}
        paneTitle={<span data-test-source-header-title>loading</span>}
      />
    );
  };

  const renderDetailsPaneHeader = () => {
    const label = get(record, 'label', <NoValue />);

    return (
      <PaneHeader
        dismissible
        onClose={handlers.onClose}
        paneTitle={<span data-test-source-header-title>{label}</span>}
      />
    );
  };

  const renderLoadingPane = () => {
    return (
      <Pane
        defaultWidth="40%"
        id="pane-sourcedetails"
        renderHeader={renderLoadingPaneHeader}
      >
        <Layout className="marginTop1">
          <Icon icon="spinner-ellipsis" width="10px" />
        </Layout>
      </Pane>
    );
  };

  const organizationId = get(record, 'organization.id', '');

  if (isLoading) return renderLoadingPane();

  return (
    <Pane
      data-test-source-pane-details
      defaultWidth="40%"
      id="pane-sourcedetails"
      renderHeader={renderDetailsPaneHeader}
    >
      <AccordionSet>
        <ViewMetaData
          metadata={get(record, 'metadata', {})}
          stripes={stripes}
        />
        <SourceInfoView
          id="sourceInfo"
          metadataSource={record}
          stripes={stripes}
        />
        <Row end="xs">
          <Col xs>
            <ExpandAllButton
              accordionStatus={accordionsState}
              onToggle={handleExpandAll}
              setStatus={null}
            />
          </Col>
        </Row>
        <Accordion
          id="managementAccordion"
          label={<FormattedMessage id="ui-finc-select.source.accordion.management" />}
          onToggle={handleAccordionToggle}
          open={accordionsState.managementAccordion}
        >
          <SourceManagementView
            history={history}
            id="sourceManagement"
            metadataSource={record}
            organizationId={organizationId}
            stripes={stripes}
          />
        </Accordion>
        <Accordion
          id="technicalAccordion"
          label={<FormattedMessage id="ui-finc-select.source.accordion.technical" />}
          open={accordionsState.technicalAccordion}
          onToggle={handleAccordionToggle}
        >
          <SourceTechnicalView
            id="sourceTechnical"
            metadataSource={record}
            stripes={stripes}
          />
        </Accordion>
      </AccordionSet>
    </Pane>
  );
};

MetadataSourceView.propTypes = {
  handlers: PropTypes.shape({
    onClose: PropTypes.func.isRequired,
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }),
  isLoading: PropTypes.bool,
  record: PropTypes.object,
  stripes: PropTypes.object,
};

export default MetadataSourceView;

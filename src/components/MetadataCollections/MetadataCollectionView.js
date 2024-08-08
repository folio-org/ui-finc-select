import PropTypes from 'prop-types';
import { useState } from 'react';
import { get } from 'lodash';
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

import CollectionInfoView from './CollectionInfo/CollectionInfoView';
import CollectionContentView from './CollectionContent/CollectionContentView';
import CollectionTechnicalView from './CollectionTechnical/CollectionTechnicalView';

const MetadataCollectionView = ({
  handlers,
  isLoading,
  record,
  stripes,
}) => {
  const [accordionsState, setAccordionsState] = useState({
    contentAccordion: false,
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
        paneTitle={<span data-test-collection-header-title>loading</span>}
      />
    );
  };

  const renderDetailsPaneHeader = () => {
    const label = get(record, 'label', <NoValue />);

    return (
      <PaneHeader
        dismissible
        onClose={handlers.onClose}
        paneTitle={<span data-test-collection-header-title>{label}</span>}
      />
    );
  };

  const renderLoadingPane = () => {
    return (
      <Pane
        defaultWidth="40%"
        id="pane-collectiondetails"
        renderHeader={renderLoadingPaneHeader}
      >
        <Layout className="marginTop1">
          <Icon icon="spinner-ellipsis" width="10px" />
        </Layout>
      </Pane>
    );
  };

  if (isLoading) return renderLoadingPane();

  return (
    <>
      <Pane
        data-test-collection-pane-details
        defaultWidth="40%"
        id="pane-collectiondetails"
        renderHeader={renderDetailsPaneHeader}
      >
        <AccordionSet>
          <ViewMetaData
            metadata={get(record, 'metadata', {})}
            stripes={stripes}
          />
          <CollectionInfoView
            id="collectionInfo"
            metadataCollection={record}
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
            id="contentAccordion"
            label={<FormattedMessage id="ui-finc-select.collection.accordion.content" />}
            onToggle={handleAccordionToggle}
            open={accordionsState.contentAccordion}
          >
            <CollectionContentView
              id="collectionContent"
              metadataCollection={record}
              stripes={stripes}
            />
          </Accordion>
          <Accordion
            id="technicalAccordion"
            label={<FormattedMessage id="ui-finc-select.collection.accordion.technical" />}
            onToggle={handleAccordionToggle}
            open={accordionsState.technicalAccordion}
          >
            <CollectionTechnicalView
              id="collectionTechnical"
              metadataCollection={record}
              stripes={stripes}
            />
          </Accordion>
        </AccordionSet>
      </Pane>
    </>
  );
};

MetadataCollectionView.propTypes = {
  handlers: PropTypes.shape({
    onClose: PropTypes.func.isRequired
  }).isRequired,
  isLoading: PropTypes.bool,
  record: PropTypes.object,
  stripes: PropTypes.object,
};

export default MetadataCollectionView;

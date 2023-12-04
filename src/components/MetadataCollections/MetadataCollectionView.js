import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
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

class MetadataCollectionView extends React.Component {
  static propTypes = {
    handlers: PropTypes.shape({
      onClose: PropTypes.func.isRequired
    }).isRequired,
    isLoading: PropTypes.bool,
    record: PropTypes.object,
    stripes: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.state = {
      accordions: {
        contentAccordion: false,
        technicalAccordion: false
      },
    };
  }

  handleExpandAll = (obj) => {
    this.setState((curState) => {
      const newState = _.cloneDeep(curState);

      newState.accordions = obj;
      return newState;
    });
  }

  handleAccordionToggle = ({ id }) => {
    this.setState((state) => {
      const newState = _.cloneDeep(state);

      if (!_.has(newState.accordions, id)) newState.accordions[id] = true;
      newState.accordions[id] = !newState.accordions[id];
      return newState;
    });
  }

  renderLoadingPaneHeader = () => {
    return (
      <PaneHeader
        dismissible
        onClose={this.props.handlers.onClose}
        paneTitle={<span data-test-collection-header-title>loading</span>}
      />
    );
  };

  renderDetailsPaneHeader = () => {
    const label = _.get(this.props.record, 'label', <NoValue />);

    return (
      <PaneHeader
        dismissible
        onClose={this.props.handlers.onClose}
        paneTitle={<span data-test-collection-header-title>{label}</span>}
      />
    );
  };

  renderLoadingPane = () => {
    return (
      <Pane
        defaultWidth="40%"
        id="pane-collectiondetails"
        renderHeader={this.renderLoadingPaneHeader}
      >
        <Layout className="marginTop1">
          <Icon icon="spinner-ellipsis" width="10px" />
        </Layout>
      </Pane>
    );
  }

  render() {
    const { record, isLoading, stripes } = this.props;

    if (isLoading) return this.renderLoadingPane();

    return (
      <>
        <Pane
          data-test-collection-pane-details
          defaultWidth="40%"
          id="pane-collectiondetails"
          renderHeader={this.renderDetailsPaneHeader}
        >
          <AccordionSet>
            <ViewMetaData
              metadata={_.get(record, 'metadata', {})}
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
                  accordionStatus={this.state.accordions}
                  onToggle={this.handleExpandAll}
                  setStatus={null}
                />
              </Col>
            </Row>
            <Accordion
              id="contentAccordion"
              label={<FormattedMessage id="ui-finc-select.collection.accordion.content" />}
              onToggle={this.handleAccordionToggle}
              open={this.state.accordions.contentAccordion}
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
              onToggle={this.handleAccordionToggle}
              open={this.state.accordions.technicalAccordion}
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
  }
}

export default MetadataCollectionView;

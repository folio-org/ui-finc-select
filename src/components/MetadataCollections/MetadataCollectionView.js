import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  Col,
  ExpandAllButton,
  Icon,
  Layout,
  Pane,
  Row,
} from '@folio/stripes/components';

import CollectionInfoView from './CollectionInfo/CollectionInfoView';
import CollectionContentView from './CollectionContent/CollectionContentView';
import CollectionTechnicalView from './CollectionTechnical/CollectionTechnicalView';


class CollectionViewRoute extends React.Component {
  static propTypes = {
    handlers: PropTypes.shape({
      onClose: PropTypes.func.isRequired,
      onEdit: PropTypes.func,
    }).isRequired,
    isLoading: PropTypes.bool,
    record: PropTypes.object,
    stripes: PropTypes.shape({
      connect: PropTypes.func.isRequired,
    }).isRequired,
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

  renderLoadingPane = () => {
    return (
      <Pane
        defaultWidth="40%"
        dismissible
        id="pane-collectiondetails"
        onClose={this.props.handlers.onClose}
        paneTitle={<span data-test-collection-header-title>loading</span>}
      >
        <Layout className="marginTop1">
          <Icon icon="spinner-ellipsis" width="10px" />
        </Layout>
      </Pane>
    );
  }

  render() {
    const { record, isLoading, stripes } = this.props;
    const label = _.get(record, 'label', '-');

    if (isLoading) return this.renderLoadingPane();

    return (
      <React.Fragment>
        <Pane
          data-test-collection-pane-details
          defaultWidth="40%"
          dismissible
          id="pane-collectiondetails"
          onClose={this.props.handlers.onClose}
          paneTitle={<span data-test-collection-header-title>{label}</span>}
        >
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
              stripes={this.props.stripes}
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
              stripes={this.props.stripes}
            />
          </Accordion>
        </Pane>
      </React.Fragment>
    );
  }
}

export default CollectionViewRoute;

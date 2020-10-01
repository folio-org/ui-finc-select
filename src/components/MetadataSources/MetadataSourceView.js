import _ from 'lodash';
import React from 'react';
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
  Row,
} from '@folio/stripes/components';
import { ViewMetaData } from '@folio/stripes/smart-components';

import SourceInfoView from './SourceInfo/SourceInfoView';
import SourceManagementView from './SourceManagement/SourceManagementView';
import SourceTechnicalView from './SourceTechnical/SourceTechnicalView';

class MetadataSourceView extends React.Component {
  static propTypes = {
    handlers: PropTypes.shape({
      onClose: PropTypes.func.isRequired,
    }).isRequired,
    record: PropTypes.object,
    stripes: PropTypes.shape({
      connect: PropTypes.func.isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      accordions: {
        managementAccordion: false,
        technicalAccordion: false
      },
    };

    this.connectedViewMetaData = this.props.stripes.connect(ViewMetaData);
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
        id="pane-sourcedetails"
        onClose={this.props.handlers.onClose}
        paneTitle={<span data-test-source-header-title>loading</span>}
      >
        <Layout className="marginTop1">
          <Icon icon="spinner-ellipsis" width="10px" />
        </Layout>
      </Pane>
    );
  }

  render() {
    const { record } = this.props;
    const label = _.get(record, 'label', <NoValue />);
    const organizationId = _.get(record, 'organization.id', '');

    return (
      <React.Fragment>
        <Pane
          data-test-source-pane-details
          defaultWidth="40%"
          dismissible
          id="pane-sourcedetails"
          onClose={this.props.handlers.onClose}
          paneTitle={<span data-test-source-header-title>{label}</span>}
        >
          <AccordionSet>
            <this.connectedViewMetaData
              metadata={_.get(record, 'metadata', {})}
              stripes={this.props.stripes}
            />
            <SourceInfoView
              id="sourceInfo"
              metadataSource={record}
              stripes={this.props.stripes}
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
              id="managementAccordion"
              label={<FormattedMessage id="ui-finc-select.source.accordion.management" />}
              onToggle={this.handleAccordionToggle}
              open={this.state.accordions.managementAccordion}
            >
              <SourceManagementView
                id="sourceManagement"
                metadataSource={record}
                organizationId={organizationId}
                stripes={this.props.stripes}
              />
            </Accordion>
            <Accordion
              id="technicalAccordion"
              label={<FormattedMessage id="ui-finc-select.source.accordion.technical" />}
              open={this.state.accordions.technicalAccordion}
              onToggle={this.handleAccordionToggle}
            >
              <SourceTechnicalView
                id="sourceTechnical"
                metadataSource={record}
                stripes={this.props.stripes}
              />
            </Accordion>
          </AccordionSet>
        </Pane>
      </React.Fragment>
    );
  }
}

export default MetadataSourceView;

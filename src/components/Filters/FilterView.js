import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
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
  PaneMenu,
  Row,
} from '@folio/stripes/components';
import { ViewMetaData } from '@folio/stripes/smart-components';

import FilterInfoView from './FilterInfo/FilterInfoView';
import FilterFileView from './FilterFile/FilterFileView';
import CollectionsView from './Collections/CollectionsView';

class FilterView extends React.Component {
  static propTypes = {
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

  constructor(props) {
    super(props);

    this.state = {
      accordions: {
        fileAccordion: false,
        collectionAccordion: false
      },
    };

    this.editButton = React.createRef();

    // this.connectedViewMetaData = this.props.stripes.connect(ViewMetaData);
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

  renderEditPaneMenu = () => {
    const { canEdit, handlers } = this.props;

    return (
      <PaneMenu>
        {canEdit && (
          <Button
            aria-label={<FormattedMessage id="ui-finc-select.edit" />}
            buttonRef={this.editButton}
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
  }

  renderLoadingPane = () => {
    return (
      <Pane
        defaultWidth="40%"
        dismissible
        id="pane-filterdetails"
        onClose={this.props.handlers.onClose}
        paneTitle={<span data-test-filter-header-title>loading</span>}
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

    const label = _.get(record, 'label', <NoValue />);
    const docs = _.get(record, 'filterFiles', []);

    return (
      <React.Fragment>
        <Pane
          data-test-filter-pane-details
          defaultWidth="40%"
          dismissible
          id="pane-filterdetails"
          lastMenu={this.renderEditPaneMenu()}
          onClose={this.props.handlers.onClose}
          paneTitle={<span data-test-filter-header-title>{label}</span>}
        >
          <AccordionSet>
            <ViewMetaData
              metadata={_.get(record, 'metadata', {})}
              stripes={this.props.stripes}
            />
            <FilterInfoView
              filter={record}
              id="filterInfo"
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
              id="fileAccordion"
              label={<FormattedMessage id="ui-finc-select.filter.fileAccordion" />}
              onToggle={this.handleAccordionToggle}
              open={this.state.accordions.fileAccordion}
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
              onToggle={this.handleAccordionToggle}
              open={this.state.accordions.collectionAccordion}
            >
              <CollectionsView
                collectionIds={this.props.collectionIds}
                filter={record}
                id="collections"
                stripes={stripes}
              />
            </Accordion>
          </AccordionSet>
        </Pane>
      </React.Fragment>
    );
  }
}

export default FilterView;

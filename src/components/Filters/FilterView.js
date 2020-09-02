import React from 'react';
import _ from 'lodash';
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
  Row
} from '@folio/stripes/components';
import { ViewMetaData } from '@folio/stripes/smart-components';
import { IfPermission } from '@folio/stripes/core';

import FilterInfoView from './FilterInfo/FilterInfoView';
import FilterFileView from './FilterFile/FilterFileView';
import CollectionsView from './Collections/CollectionsView';

class FilterView extends React.Component {
  static propTypes = {
    handlers: PropTypes.shape({
      onClose: PropTypes.func.isRequired,
      onEdit: PropTypes.func,
    }).isRequired,
    isLoading: PropTypes.bool,
    record: PropTypes.object,
    collectionIds: PropTypes.arrayOf(PropTypes.object),
    stripes: PropTypes.shape({
      connect: PropTypes.func,
      okapi: PropTypes.object.isRequired,
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

  renderEditPaneMenu = () => {
    const { handlers } = this.props;

    return (
      <IfPermission perm="finc-select.filters.item.put">
        <PaneMenu>
          <Button
            id="clickable-edit-filter"
            buttonStyle="primary"
            onClick={handlers.onEdit}
            aria-label="Edit Filter"
            buttonRef={this.editButton}
            marginBottom0
          >
            <FormattedMessage id="ui-finc-select.edit" />
          </Button>
        </PaneMenu>
      </IfPermission>
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

  getFilterFormData = (filter) => {
    const filterFormData = filter ? _.cloneDeep(filter) : filter;

    return filterFormData;
  }

  render() {
    const { record, isLoading, stripes } = this.props;

    if (isLoading) return this.renderLoadingPane();

    const label = _.get(record, 'label', <NoValue />);
    const docs = _.get(record, 'filterFiles', []);

    return (
      <React.Fragment>
        <Pane
          defaultWidth="40%"
          dismissible
          id="pane-filterdetails"
          lastMenu={this.renderEditPaneMenu()}
          onClose={this.props.handlers.onClose}
          paneTitle={<span data-test-filter-header-title>{label}</span>}
        >
          <div id="filterDetails">
            <AccordionSet>
              <this.connectedViewMetaData
                metadata={_.get(record, 'metadata', {})}
                stripes={this.props.stripes}
              />
              <FilterInfoView
                id="filterInfo"
                filter={record}
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
                  id="filterInfo"
                  filter={record}
                  stripes={stripes}
                  docs={docs}
                />
              </Accordion>
              <Accordion
                id="collectionAccordion"
                label={<FormattedMessage id="ui-finc-select.filter.collectionAccordion" />}
                onToggle={this.handleAccordionToggle}
                open={this.state.accordions.collectionAccordion}
              >
                <CollectionsView
                  id="collections"
                  filter={record}
                  collectionIds={this.props.collectionIds}
                  stripes={stripes}
                />
              </Accordion>
            </AccordionSet>
          </div>
        </Pane>
      </React.Fragment>
    );
  }
}


export default FilterView;

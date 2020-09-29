import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import {
  withRouter,
  Link,
} from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  Col,
  KeyValue,
  NoValue,
  Row,
} from '@folio/stripes/components';
import { stripesConnect } from '@folio/stripes/core';

import urls from '../../DisplayUtils/urls';
import SelectAllCollections from './SelectAllCollections';

class SourceManagementView extends React.Component {
  static manifest = Object.freeze({
    org: {
      type: 'okapi',
      path: 'organizations-storage/organizations/!{organizationId}',
      throwErrors: false
    },
    query: {},
  });

  static propTypes = {
    id: PropTypes.string,
    metadataSource: PropTypes.object,
    resources: PropTypes.shape({
      org: PropTypes.object,
      failed: PropTypes.object,
    }).isRequired,
    stripes: PropTypes.shape({
      connect: PropTypes.func.isRequired,
    }),
  };

  constructor(props) {
    super(props);

    this.connectedSelectAllCollections = this.props.stripes.connect(SelectAllCollections);
  }

  render() {
    const { metadataSource, stripes, id } = this.props;
    const sourceId = _.get(metadataSource, 'id', '-');
    const organization = _.get(this.props.metadataSource, 'organization', <NoValue />);

    let orgValue;
    if (this.props.resources.org && this.props.resources.org.failed) {
      if (organization.name) {
        orgValue = organization.name;
      } else {
        orgValue = <NoValue />;
      }
    } else {
      orgValue = (
        <React.Fragment>
          <Link to={{ pathname: `${urls.organizationView(organization.id)}` }}>
            {organization.name}
          </Link>
        </React.Fragment>
      );
    }

    return (
      <React.Fragment>
        <div id={id}>
          <Row>
            <Col xs={6}>
              <Button
                buttonStyle="primary"
                id="showSelectedCollections"
                to={urls.showSelectedCollections(sourceId)}
              >
                <FormattedMessage id="ui-finc-select.source.button.showselectedCollections" />
              </Button>
            </Col>
          </Row>

          <Row>
            <Col xs={6}>
              <this.connectedSelectAllCollections
                sourceId={sourceId}
                stripes={stripes}
              />
            </Col>
            <Col xs={6}>
              {/* showAllCollections as button */}
              <Button
                buttonStyle="primary"
                id="showAllCollections"
                to={urls.showAllCollections(sourceId)}
              >
                <FormattedMessage id="ui-finc-select.source.button.showAllCollections" />
              </Button>
            </Col>
          </Row>
          <Row>
            <KeyValue
              label={<FormattedMessage id="ui-finc-select.source.organization" />}
              value={orgValue}
            />
          </Row>
          <Row>
            <KeyValue
              label={<FormattedMessage id="ui-finc-select.source.indexingLevel" />}
              value={_.get(metadataSource, 'indexingLevel', <NoValue />)}
            />
          </Row>
          <Row>
            <KeyValue
              label={<FormattedMessage id="ui-finc-select.source.generalNotes" />}
              value={_.get(metadataSource, 'generalNotes', <NoValue />)}
            />
          </Row>
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(stripesConnect(SourceManagementView));

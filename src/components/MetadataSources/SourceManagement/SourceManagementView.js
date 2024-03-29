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
    metadataSource: PropTypes.object,
    resources: PropTypes.shape({
      org: PropTypes.object,
      failed: PropTypes.object,
    }).isRequired,
    stripes: PropTypes.object,
  };

  render() {
    const { metadataSource, stripes } = this.props;
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
        <>
          <Link to={{ pathname: `${urls.organizationView(organization.id)}` }}>
            {organization.name}
          </Link>
        </>
      );
    }

    return (
      <>
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
            <SelectAllCollections
              sourceId={sourceId}
              stripes={stripes}
            />
          </Col>
          <Col xs={6}>
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
      </>
    );
  }
}

export default withRouter(stripesConnect(SourceManagementView));

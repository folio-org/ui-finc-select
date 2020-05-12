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
  Row
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
    stripes: PropTypes.shape({
      connect: PropTypes.func.isRequired,
    }),
    id: PropTypes.string,
    resources: PropTypes.shape({
      org: PropTypes.object,
      failed: PropTypes.object,
    }).isRequired,
  };

  constructor(props) {
    super(props);

    this.connectedSelectAllCollections = this.props.stripes.connect(SelectAllCollections);
  }

  render() {
    const { metadataSource, stripes, id } = this.props;
    const sourceId = _.get(metadataSource, 'id', '-');
    const organization = _.get(this.props.metadataSource, 'organization', '-');

    let orgValue;
    if (this.props.resources.org && this.props.resources.org.failed) {
      if (organization.name) {
        orgValue = organization.name;
      } else {
        orgValue = '-';
      }
    } else {
      orgValue = (
        <React.Fragment>
          <Link to={{
            pathname: `${urls.organizationView(organization.id)}`,
          }}
          >
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
              {/* TODO: Select All Collections */}
              <this.connectedSelectAllCollections
                stripes={stripes}
                sourceId={sourceId}
              />
            </Col>
            <Col xs={6}>
              {/* showAllCollections as link */}
              {/* <Link to={{
                pathname: '/finc-select/metadata-collections',
                search: `?filters=mdSource.${sourceId}`
              }}
              >
                <span>
                  <FormattedMessage id="ui-finc-select.source.button.showAllCollections" />
                  {sourceId}
                </span>
              </Link> */}

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
              // value={_.get(metadataSource, 'organization.name', '-')}
              value={orgValue}
            />
          </Row>
          <Row>
            <KeyValue
              label={<FormattedMessage id="ui-finc-select.source.indexingLevel" />}
              value={_.get(metadataSource, 'indexingLevel', '-')}
            />
          </Row>
          <Row>
            <KeyValue
              label={<FormattedMessage id="ui-finc-select.source.generalNotes" />}
              value={_.get(metadataSource, 'generalNotes', '-')}
            />
          </Row>
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(stripesConnect(SourceManagementView));

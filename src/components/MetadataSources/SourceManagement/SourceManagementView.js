import PropTypes from 'prop-types';
import { get } from 'lodash';
import { withRouter, Link } from 'react-router-dom';
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

const SourceManagementView = ({
  history,
  metadataSource,
  resources,
  stripes,
}) => {
  const sourceId = get(metadataSource, 'id', '-');
  const organization = get(metadataSource, 'organization', <NoValue />);

  let orgValue;
  if (resources.org?.failed) {
    if (organization.name) {
      orgValue = organization.name;
    } else {
      orgValue = <NoValue />;
    }
  } else {
    orgValue = (
      <Link to={{ pathname: `${urls.organizationView(organization.id)}` }}>
        {organization.name}
      </Link>
    );
  }

  const doShowCollections = (showSelected = false) => {
    const filters = {
      state: {
        mdSource: [sourceId],
        ...(showSelected && { selected: ['yes'] })
      },
      string: showSelected ? `mdSource.${sourceId},selected.yes` : `mdSource.${sourceId}`
    };

    localStorage.removeItem('fincSelectCollectionFilters');
    localStorage.removeItem('fincSelectCollectionSearchString');
    localStorage.removeItem('fincSelectCollectionSearchIndex');

    localStorage.setItem('fincSelectCollectionFilters', JSON.stringify(filters));
    localStorage.setItem('fincSelectCollectionSearchString', JSON.stringify({}));

    return showSelected ? history.push(urls.showSelectedCollections(sourceId)) : history.push(urls.showAllCollections(sourceId));
  };

  return (
    <>
      <Row>
        <Col xs={6}>
          <Button
            buttonStyle="primary"
            id="showSelectedCollections"
            onClick={() => doShowCollections(true)}
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
            onClick={() => doShowCollections()}
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
          value={get(metadataSource, 'indexingLevel', <NoValue />)}
        />
      </Row>
      <Row>
        <KeyValue
          label={<FormattedMessage id="ui-finc-select.source.generalNotes" />}
          value={get(metadataSource, 'generalNotes', <NoValue />)}
        />
      </Row>
    </>
  );
};

SourceManagementView.manifest = Object.freeze({
  org: {
    type: 'okapi',
    path: 'organizations-storage/organizations/!{organizationId}',
    throwErrors: false
  },
  query: {},
});

SourceManagementView.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  metadataSource: PropTypes.object,
  resources: PropTypes.shape({
    org: PropTypes.object,
    failed: PropTypes.object,
  }).isRequired,
  stripes: PropTypes.object,
};

export default withRouter(stripesConnect(SourceManagementView));

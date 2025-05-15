import PropTypes from 'prop-types';
import { get } from 'lodash';
import { withRouter, Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { useQuery } from 'react-query';

import {
  Button,
  Col,
  KeyValue,
  NoValue,
  Row,
} from '@folio/stripes/components';
import { useOkapiKy } from '@folio/stripes/core';

import { ORGANIZATION_API } from '../../../util/constants';
import urls from '../../DisplayUtils/urls';
import SelectAllCollections from './SelectAllCollections';

const SourceManagementView = ({
  metadataSource,
  stripes,
}) => {
  const sourceId = get(metadataSource, 'id', '-');
  const organization = get(metadataSource, 'organization', <NoValue />);

  const useOrganization = () => {
    const ky = useOkapiKy();

    const { isError } = useQuery(
      [organization?.id],
      () => ky.get(ORGANIZATION_API(organization?.id)).json(),
      // The query will not execute until the id exists
      { enabled: Boolean(organization?.id) }
    );
    return ({ isError });
  };

  const { isError } = useOrganization();

  let orgValue;
  if (!organization?.name) {
    orgValue = <NoValue />;
  } else if (isError) {
    orgValue = organization.name;
  } else {
    orgValue = (
      <Link to={{ pathname: `${urls.organizationView(organization.id)}` }}>
        {organization.name}
      </Link>
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

SourceManagementView.propTypes = {
  metadataSource: PropTypes.object,
  stripes: PropTypes.object,
};

export default withRouter(SourceManagementView);

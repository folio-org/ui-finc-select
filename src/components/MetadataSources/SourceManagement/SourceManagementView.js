import PropTypes from 'prop-types';
import {
  get,
  isEmpty,
} from 'lodash';
import { withRouter, Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import { useOkapiKyQuery } from '@folio/stripes-leipzig-components';
import {
  Button,
  Col,
  KeyValue,
  NoValue,
  Row,
} from '@folio/stripes/components';

import {
  API_ORGANIZATIONS,
  QK_ORGANIZATIONS,
} from '../../../util/constants';
import urls from '../../DisplayUtils/urls';
import SelectAllCollections from './SelectAllCollections';

const SourceManagementView = ({
  metadataSource,
  organizationId,
  stripes,
}) => {
  let orgValue;
  const sourceId = get(metadataSource, 'id', '-');
  const sourcesOrganization = get(metadataSource, 'organization', <NoValue />);

  const { data: organization, isLoading: isLoadingOrganization, isError } = useOkapiKyQuery({
    queryKey: [QK_ORGANIZATIONS, organizationId],
    id: organizationId,
    api: API_ORGANIZATIONS,
  });

  if (!isEmpty(organizationId) && !isLoadingOrganization) {
    if (isError) {
      if (sourcesOrganization.name) {
        orgValue = sourcesOrganization.name;
      } else {
        orgValue = <NoValue />;
      }
    } else {
      orgValue = (
        <Link to={{ pathname: `${urls.organizationView(organization.id)}` }}>
          {sourcesOrganization.name}
        </Link>
      );
    }
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
  organizationId: PropTypes.string,
  stripes: PropTypes.object,
};

export default withRouter(SourceManagementView);

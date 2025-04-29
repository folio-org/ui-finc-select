import PropTypes from 'prop-types';
import { get } from 'lodash';

import ViewContainer from '../DisplayUtils/ViewContainer';
import SourceInfoView from './SourceInfo/SourceInfoView';
import SourceManagementView from './SourceManagement/SourceManagementView';
import SourceTechnicalView from './SourceTechnical/SourceTechnicalView';

const MetadataSourceView = (props) => {
  const { record } = props;
  const organizationId = get(record, 'organization.id', '');

  const accordionConfig = [
    {
      id: 'managementAccordion',
      labelId: 'ui-finc-select.source.accordion.management',
      Component: SourceManagementView,
    },
    {
      id: 'technicalAccordion',
      labelId: 'ui-finc-select.source.accordion.technical',
      Component: SourceTechnicalView,
    },
  ];

  return (
    <ViewContainer
      accordionConfig={accordionConfig}
      additionalProps={{ organizationId }}
      idPrefix="source"
      infoComponent={SourceInfoView}
      recordPropKey="metadataSource"
      {...props}
    />
  );
};

MetadataSourceView.propTypes = {
  record: PropTypes.object,
};

export default MetadataSourceView;

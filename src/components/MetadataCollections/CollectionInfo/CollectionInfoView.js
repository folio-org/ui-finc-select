import PropTypes from 'prop-types';
import { get } from 'lodash';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import {
  KeyValue,
  NoValue,
  Row,
} from '@folio/stripes/components';

import SelectUnselect from './SelectUnselect';
import urls from '../../DisplayUtils/urls';

const CollectionInfoView = ({ metadataCollection, stripes }) => {
  const getDataLable = (field) => {
    const fieldValue = get(metadataCollection, field, '');
    if (fieldValue !== '') {
      return <FormattedMessage id={`ui-finc-select.dataOption.${fieldValue}`} />;
    } else {
      return <NoValue />;
    }
  };

  const collectionId = get(metadataCollection, 'id', '-');
  const selectedInitial = get(metadataCollection, 'selected');
  const permittedLabel = getDataLable('permitted');
  // get id and name of the source out of the fields, saved in the current collection
  const sourceId = get(metadataCollection, 'mdSource.id', <NoValue />);
  const sourceName = get(metadataCollection, 'mdSource.name', <NoValue />);
  // set the complete source link with name and status
  const sourceLink = (
    <>
      <Link to={{ pathname: `${urls.sourceView(sourceId)}` }}>
        {sourceName}
      </Link>
    </>
  );

  return (
    <>
      <Row>
        <KeyValue
          label={<FormattedMessage id="ui-finc-select.collection.label" />}
          value={get(metadataCollection, 'label', <NoValue />)}
        />
      </Row>
      <Row>
        <KeyValue
          label={<FormattedMessage id="ui-finc-select.collection.mdSource" />}
          value={sourceLink}
        />
      </Row>
      <Row>
        <KeyValue
          label={<FormattedMessage id="ui-finc-select.collection.permitted" />}
          value={permittedLabel}
        />
      </Row>
      <Row>
        <SelectUnselect
          collectionId={collectionId}
          permitted={permittedLabel}
          selectedInitial={selectedInitial}
          stripes={stripes}
        />
      </Row>
    </>
  );
};

CollectionInfoView.propTypes = {
  metadataCollection: PropTypes.object,
  stripes: PropTypes.object,
};

export default CollectionInfoView;

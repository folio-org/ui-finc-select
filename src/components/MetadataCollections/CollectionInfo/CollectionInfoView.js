import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

// import { stripesConnect } from '@folio/stripes/core';
import {
  KeyValue,
  NoValue,
  Row,
} from '@folio/stripes/components';

import SelectUnselect from './SelectUnselect';
import urls from '../../DisplayUtils/urls';

class CollectionInfoView extends React.Component {
  static propTypes = {
    metadataCollection: PropTypes.object,
    stripes: PropTypes.object,
  };

  // constructor(props) {
  //   super(props);

  //   this.connectedSelectUnselect = stripesConnect(SelectUnselect);
  //   this.connectedSelectUnselect = this.props.stripes.connect(SelectUnselect);
  // }

  getDataLable(field) {
    const fieldValue = _.get(this.props.metadataCollection, field, '');
    if (fieldValue !== '') {
      return <FormattedMessage id={`ui-finc-select.dataOption.${fieldValue}`} />;
    } else {
      return <NoValue />;
    }
  }

  render() {
    const { metadataCollection, stripes } = this.props;
    const collectionId = _.get(metadataCollection, 'id', '-');
    const selectedInitial = _.get(metadataCollection, 'selected');
    const permittedLabel = this.getDataLable('permitted');

    // get id and name of the source out of the fields, saved in the current collection
    const sourceId = _.get(metadataCollection, 'mdSource.id', <NoValue />);
    const sourceName = _.get(metadataCollection, 'mdSource.name', <NoValue />);
    // set the complete source link with name and status
    const sourceLink = (
      <React.Fragment>
        <Link to={{ pathname: `${urls.sourceView(sourceId)}` }}>
          {sourceName}
        </Link>
      </React.Fragment>
    );

    return (
      <React.Fragment>
        <Row>
          <KeyValue
            label={<FormattedMessage id="ui-finc-select.collection.label" />}
            value={_.get(metadataCollection, 'label', <NoValue />)}
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
          {/* <this.connectedSelectUnselect */}
          <SelectUnselect
            collectionId={collectionId}
            permitted={permittedLabel}
            selectedInitial={selectedInitial}
            stripes={stripes}
          />
        </Row>
      </React.Fragment>
    );
  }
}

export default CollectionInfoView;

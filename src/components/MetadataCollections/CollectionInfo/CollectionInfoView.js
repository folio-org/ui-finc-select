import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import {
  KeyValue,
  List,
  NoValue,
  Row,
} from '@folio/stripes/components';

import SelectUnselect from './SelectUnselect';
import urls from '../../DisplayUtils/urls';

class CollectionInfoView extends React.Component {
  static propTypes = {
    metadataCollection: PropTypes.object,
    stripes: PropTypes.shape({
      connect: PropTypes.func.isRequired,
    }),
  };

  constructor(props) {
    super(props);

    this.connectedSelectUnselect = this.props.stripes.connect(SelectUnselect);
  }

  renderList = (values) => {
    const { metadataCollection } = this.props;
    const isEmptyMessage = <FormattedMessage id="ui-finc-select.renderList.isEmpty" />;

    if (!metadataCollection) {
      return isEmptyMessage;
    } else {
      const valueItems = metadataCollection[values];
      const valueFormatter = (valueItem) => (<li key={valueItem}>{valueItem}</li>);

      return (
        <List
          isEmptyMessage={isEmptyMessage}
          items={valueItems}
          itemFormatter={valueFormatter}
        />
      );
    }
  }

  render() {
    const { metadataCollection, stripes } = this.props;
    const collectionId = _.get(metadataCollection, 'id', '-');
    const permitted = _.get(metadataCollection, 'permitted', '-');
    const selectedInitial = _.get(metadataCollection, 'selected');

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
            value={_.upperFirst(permitted)}
          />
        </Row>
        <Row>
          <this.connectedSelectUnselect
            collectionId={collectionId}
            permitted={permitted}
            selectedInitial={selectedInitial}
            stripes={stripes}
          />
        </Row>
      </React.Fragment>
    );
  }
}

export default CollectionInfoView;

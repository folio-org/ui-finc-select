import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';

import ViewCollections from './FindCollections/ViewCollections';

class CollectionsView extends React.Component {
  static propTypes = {
    collectionIds: PropTypes.arrayOf(PropTypes.object),
    filter: PropTypes.object,
  };

  render() {
    const filterId = _.get(this.props.filter, 'id', '-');

    return (
      <React.Fragment>
        <div>
          <ViewCollections
            collectionIds={this.props.collectionIds}
            filterId={filterId}
            isEditable={false}
            name="collectionIds"
            {...this.props}
          />
        </div>
      </React.Fragment>
    );
  }
}

export default CollectionsView;

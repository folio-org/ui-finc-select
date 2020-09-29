import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';

import ViewCollections from './FindCollections/ViewCollections';

class CollectionsView extends React.Component {
  static propTypes = {
    collectionIds: PropTypes.arrayOf(PropTypes.object),
    filter: PropTypes.object,
    listedPermissions: PropTypes.arrayOf(PropTypes.object),
    stripes: PropTypes.shape({
      hasPerm: PropTypes.func.isRequired,
      config: PropTypes.shape({
        showPerms: PropTypes.bool,
        listInvisiblePerms: PropTypes.bool,
      }).isRequired,
    }).isRequired,
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
            stripes={this.props.stripes}
            {...this.props}
          />
        </div>
      </React.Fragment>
    );
  }
}

export default CollectionsView;

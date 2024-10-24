import PropTypes from 'prop-types';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  Col,
  Modal,
  Row,
} from '@folio/stripes/components';

import fetchWithDefaultOptions from '../../DisplayUtils/fetchWithDefaultOptions';

const SelectAllCollections = ({
  sourceId,
  stripes,
}) => {
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [modalText, setModalText] = useState('');

  const hasSelectAllCollectionsPerms = stripes.hasPerm('finc-select.metadata-sources.item.collections.select-all.put');

  const selectAllCollections = (id) => {
    const selectTrue = { select: true };
    const selectJson = JSON.stringify(selectTrue);

    fetchWithDefaultOptions(stripes.okapi, `/finc-select/metadata-sources/${id}/collections/select-all`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: selectJson
      })
      .then((response) => {
        if (response.status >= 400) {
          // show error
          setShowInfoModal(true);
          setModalText(<FormattedMessage id="ui-finc-select.source.modal.selectAllCollections.error" />);
        } else {
          // show success
          setShowInfoModal(true);
          setModalText(<FormattedMessage id="ui-finc-select.source.modal.selectAllCollections.success" />);
        }
      });
  };

  const handleClose = () => {
    setShowInfoModal(false);
  };

  return (
    <div>
      <Row>
        <Col xs={6}>
          <Button
            buttonStyle="primary"
            disabled={!hasSelectAllCollectionsPerms}
            id="selectAllCollections"
            onClick={() => selectAllCollections(sourceId)}
          >
            <FormattedMessage id="ui-finc-select.source.button.selectAllCollections" />
          </Button>
        </Col>
      </Row>
      <Modal
        label={<FormattedMessage id="ui-finc-select.source.button.selectAllCollections" />}
        open={showInfoModal}
      >
        <div>
          { modalText }
        </div>
        <Button onClick={handleClose}>
          <FormattedMessage id="ui-finc-select.button.ok" />
        </Button>
      </Modal>
    </div>
  );
};

SelectAllCollections.manifest = Object.freeze({
  selectAll: {
    type: 'okapi',
    fetch: false,
    accumulate: 'true',
    PUT: {
      path: 'finc-select/metadata-sources/!{sourceId}/collections/select-all'
    }
  }
});

SelectAllCollections.propTypes = {
  sourceId: PropTypes.string.isRequired,
  stripes: PropTypes.object,
};

export default SelectAllCollections;

import PropTypes from 'prop-types';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useMutation } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';
import {
  Button,
  Col,
  Modal,
  Row,
} from '@folio/stripes/components';

import { COLLECTIONS_SELECT_ALL_API } from '../../../util/constants';

const SelectAllCollections = ({
  sourceId,
  stripes,
}) => {
  const ky = useOkapiKy();
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [modalText, setModalText] = useState('');

  const hasSelectAllCollectionsPerms = stripes.hasPerm('finc-select.metadata-sources.item.collections.select-all.item.put');

  const { mutate: selectAllCollections } = useMutation({
    mutationFn: async (id) => {
      return ky.put(COLLECTIONS_SELECT_ALL_API(id), { json: { select: true } });
    },
    onSuccess: () => {
      setModalText(<FormattedMessage id="ui-finc-select.source.modal.selectAllCollections.success" />);
      setShowInfoModal(true);
    },
    onError: () => {
      setModalText(<FormattedMessage id="ui-finc-select.source.modal.selectAllCollections.error" />);
      setShowInfoModal(true);
    }
  });

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

SelectAllCollections.propTypes = {
  sourceId: PropTypes.string.isRequired,
  stripes: PropTypes.object,
};

export default SelectAllCollections;

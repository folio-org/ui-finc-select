import PropTypes from 'prop-types';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  Col,
  Modal,
  Row,
} from '@folio/stripes/components';
import { useOkapiKyMutation } from '@folio/stripes-leipzig-components';

import {
  API_COLLECTIONS_SELECT_ALL_BY_SOURCE_ID,
  QK_SOURCES,
} from '../../../util/constants';

const SelectAllCollections = ({
  sourceId,
  stripes,
}) => {
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [modalText, setModalText] = useState('');

  const hasSelectAllCollectionsPerms = stripes.hasPerm('ui-finc-select.edit');

  const { useUpdate } = useOkapiKyMutation({
    queryKey: [QK_SOURCES, sourceId],
    mutationKey: [API_COLLECTIONS_SELECT_ALL_BY_SOURCE_ID(sourceId)],
    api: API_COLLECTIONS_SELECT_ALL_BY_SOURCE_ID(sourceId),
    onSuccess: () => {
      setModalText(<FormattedMessage id="ui-finc-select.source.modal.selectAllCollections.success" />);
      setShowInfoModal(true);
    },
    onError: () => {
      setModalText(<FormattedMessage id="ui-finc-select.source.modal.selectAllCollections.error" />);
      setShowInfoModal(true);
    }
  });

  const { mutateAsync: selectAllCollections } = useUpdate();

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
            // onClick={() => selectAllCollections(sourceId)}
            onClick={() => selectAllCollections({ select: true })}
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

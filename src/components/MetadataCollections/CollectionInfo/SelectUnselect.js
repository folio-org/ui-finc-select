import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';

import {
  Col,
  Button,
  KeyValue,
  NoValue,
  Modal,
} from '@folio/stripes/components';

import fetchWithDefaultOptions from '../../DisplayUtils/fetchWithDefaultOptions';

const SelectUnselect = ({
  collectionId,
  permitted,
  selectedInitial,
  stripes,
}) => {
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [modalText, setModalText] = useState('');
  const [selected, setSelected] = useState(selectedInitial);

  // get button label from the saved yes or no value
  const getSelectedButtonLable = (sel) => {
    if (sel === 'no') {
      return <FormattedMessage id="ui-finc-select.collection.button.select" />;
    } else {
      return <FormattedMessage id="ui-finc-select.collection.button.unselect" />;
    }
  };

  const [selectedLabel, setSelectedLabel] = useState(getSelectedButtonLable(selectedInitial));

  // get initial-selected-value as a property
  // but need the selected-value also as a state for futher working and changing its value
  useEffect(() => {
    setSelected(selectedInitial);
  }, [selectedInitial]);

  const fetchSelected = () => {
    const selectedButtonLable = getSelectedButtonLable(selectedInitial);

    // change state for selected-values, if neccessary
    setSelected(selectedInitial);
    setSelectedLabel(selectedButtonLable);
  };

  const isUsagePermitted = () => {
    if (permitted === 'no') {
      return true;
    } else {
      return false;
    }
  };

  // if clicking on another collection, check, if selectedInitial will be up to date
  useEffect(() => {
    fetchSelected();
    isUsagePermitted();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionId]);

  // translate yes or no value into inverse boolean for json
  const inversJsonBoolean = () => {
    if (selected === 'no') {
      return { select: true };
    } else {
      return { select: false };
    }
  };

  const selectUnselect = () => {
    const selectedJson = JSON.stringify(inversJsonBoolean());

    let inverseSelected = '';

    if (selected === 'no') { inverseSelected = 'yes'; } else { inverseSelected = 'no'; }
    const invertSelectedButtonLable = getSelectedButtonLable(inverseSelected);

    fetchWithDefaultOptions(stripes.okapi, `/finc-select/metadata-collections/${collectionId}/select`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: selectedJson,
      })
      .then((response) => {
        if (response.status >= 400) {
          // show 400 error
          setShowInfoModal(true);
          setModalText(<FormattedMessage id="ui-finc-select.collection.modal.selectCollection.error.400" />);
        } else if (response.status < 400 && response.status >= 300) {
          // show 300 error
          setShowInfoModal(true);
          setModalText(<FormattedMessage id="ui-finc-select.collection.modal.selectCollection.error.300" />);
        } else if (response.status < 300 && response.status >= 200) {
          // show success
          setSelected(inverseSelected);
          setSelectedLabel(invertSelectedButtonLable);
        }
      });
  };

  const handleClose = () => {
    setShowInfoModal(false);
  };

  const getSelectedDataLable = () => {
    if (selected !== undefined) {
      const fieldValue = selected;
      if (fieldValue !== '') {
        return <FormattedMessage id={`ui-finc-select.dataOption.${fieldValue}`} />;
      } else {
        return <NoValue />;
      }
    }
    return null;
  };

  const selectedLabelValue = getSelectedDataLable();
  const hasSelectCollectionPerms = stripes.hasPerm('ui-finc-select.edit');

  return (
    <>
      <Col xs={3}>
        <KeyValue
          label={<FormattedMessage id="ui-finc-select.collection.selected" />}
          value={selectedLabelValue}
        />
      </Col>
      <Col xs={3}>
        <Button
          buttonStyle="primary"
          disabled={!hasSelectCollectionPerms || isUsagePermitted()}
          id="unselect"
          onClick={() => selectUnselect()}
        >
          {selectedLabel}
        </Button>
      </Col>
      <Modal
        label={<FormattedMessage id="ui-finc-select.collection.modal.selectCollection.label" />}
        open={showInfoModal}
      >
        <div>
          { modalText }
        </div>
        <Button onClick={handleClose}>
          <FormattedMessage id="ui-finc-select.button.ok" />
        </Button>
      </Modal>
    </>
  );
};

SelectUnselect.propTypes = {
  collectionId: PropTypes.string,
  permitted: PropTypes.object,
  selectedInitial: PropTypes.string,
  stripes: PropTypes.object,
};

export default SelectUnselect;

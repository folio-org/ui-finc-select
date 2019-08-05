import _ from 'lodash';
import React from 'react';
import {
  intlShape,
  injectIntl,
  FormattedMessage
} from 'react-intl';
import PropTypes from 'prop-types';
import {
  Button,
  Modal
} from '@folio/stripes/components';
import FileUploader from './FileUploader';

class FilterFileUpload extends React.Component {
  static manifest = Object.freeze({
    counterReports: {
      type: 'okapi',
      fetch: false,
      accumulate: 'true',
      POST: {
        // path: 'counter-reports/upload/provider/!{udpId}'
        path: 'finc-select/files'
      }
    }
  });

  static propTypes = {
    stripes: PropTypes.shape().isRequired,
    udpId: PropTypes.string,
    mutator: PropTypes.shape({
      counterReports: PropTypes.object,
    }),
    intl: intlShape.isRequired,
  }

  constructor(props) {
    super(props);
    const logger = props.stripes.logger;
    this.log = logger.log.bind(logger);
    this.okapiUrl = props.stripes.okapi.url;
    this.httpHeaders = Object.assign({}, {
      'X-Okapi-Tenant': props.stripes.okapi.tenant,
      'X-Okapi-Token': props.stripes.store.getState().okapi.token,
      'Content-Type': 'application/octet-stream'
    });
    this.state = {
      selectedFile: {},
      showInfoModal: false,
      modalInfoText: '',
      showOverwriteModal: false
    };
  }

  showErrorInfo = (response) => {
    response.text().then((text) => {
      if (text.includes('Report already exists')) {
        this.setState(
          {
            showOverwriteModal: true,
            showInfoModal: false,
          }
        );
      } else {
        this.setState(
          {
            showOverwriteModal: false,
            showInfoModal: true,
            modalInfoText: text,
          }
        );
      }
    });
  }

  doUpload = (data, doOverwrite) => {
    fetch(`${this.okapiUrl}/finc-select/files`,
      {
        headers: this.httpHeaders,
        method: 'POST',
        body: data
      })
      // .then(response => {
      // return response.json();
    // })
      // .then(json => {
      //   console.log(JSON.stringify(json));
      // })
      .then((response) => {
        console.log(response);
        if (response.status >= 400) {
          this.showErrorInfo(response);
        } else {
          const info = 'report.upload.success';
          this.setState(
            {
              showInfoModal: true,
              showOverwriteModal: false,
              modalInfoText: info,
              selectedFile: {}
            }
          );
        }
      })
      .catch(err => {
        const failText = 'report.upload.failed';
        const infoText = failText + ' ' + err.message;
        this.setState(
          {
            showInfoModal: true,
            showOverwriteModal: false,
            modalInfoText: infoText
          }
        );
      });
  }

  handleCloseInfoModal = () => {
    this.setState({ showInfoModal: false });
  }

  handleCloseOverwriteModal = () => {
    this.setState({ showOverwriteModal: false });
  }

  uploadFile = (doOverwrite = false) => {
    const selectedFile = this.state.selectedFile;
    if (!_.isEmpty(selectedFile)) {
      const fileReader = new FileReader();
      fileReader.onload = (event) => {
        this.doUpload(event.target.result, doOverwrite);
      };
      fileReader.readAsText(selectedFile);
    }
  }

  uploadFileForceOverwrite = () => {
    this.uploadFile(true);
  }

  selectFile = (acceptedFiles) => {
    const currentFile = acceptedFiles[0];
    this.setState({
      selectedFile: currentFile,
    });
  }

  render() {
    return (
      <React.Fragment>
        <FileUploader
          onSelectFile={this.selectFile}
          selectedFile={this.state.selectedFile}
          onClickUpload={this.uploadFile}
        />
        <Modal
          closeOnBackgroundClick
          open={this.state.showInfoModal}
          label="report.upload.modal.label"
        >
          <div>
            { this.state.modalInfoText }
          </div>
          <Button
            onClick={this.handleCloseInfoModal}
          >
            OK
          </Button>
        </Modal>
        <Modal
          closeOnBackgroundClick
          open={this.state.showOverwriteModal}
          label="report.upload.modal.label"
        >
          <div>
            report.upload.reportExists
          </div>
          <Button
            onClick={this.uploadFileForceOverwrite}
          >
            Yes
          </Button>
          <Button
            onClick={this.handleCloseOverwriteModal}
          >
            No
          </Button>
        </Modal>
      </React.Fragment>
    );
  }
}

export default FilterFileUpload;
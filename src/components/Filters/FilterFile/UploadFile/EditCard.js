import React from 'react';
import PropTypes from 'prop-types';

import {
  Button,
  Card,
  Icon,
} from '@folio/stripes/components';


export default class EditCard extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    deleteBtnProps: PropTypes.object,
    deletebuttonarialabel: PropTypes.string,
    header: PropTypes.node.isRequired,
    onDelete: PropTypes.func,
  }

  static defaultProps = {
    deleteBtnProps: {},
  }

  renderDeleteButton = () => (
    <Button
      aria-label={this.props.deletebuttonarialabel}
      buttonStyle="link slim"
      onClick={this.props.onDelete}
      style={{ margin: 0, padding: 0 }}
      {...this.props.deleteBtnProps}
    >
      <Icon icon="trash" />
    </Button>
  )

  render() {
    const {
      children,
      deleteBtnProps, // eslint-disable-line no-unused-vars
      header,
      onDelete,
      ...rest
    } = this.props;

    return (
      <Card
        headerStart={<strong>{header}</strong>}
        headerEnd={onDelete ? this.renderDeleteButton() : undefined}
        {...rest}
      >
        {children}
      </Card>
    );
  }
}

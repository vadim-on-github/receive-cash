import React, {Component} from "react";
import {OverlayTrigger, Tooltip} from "react-bootstrap";

export class CryptoIcon extends Component {
  state = {
    showTooltip: false
  }
  icon = React.createRef();

  render() {
    const tooltipPlacement = 'bottom';
    return (
      <OverlayTrigger
        placement={tooltipPlacement}
        overlay={
          <Tooltip id={`tooltip-${tooltipPlacement}`}>
            {this.props.name}
          </Tooltip>
        }
        trigger={['hover', 'focus']}>
        <img src={this.props.src}
             alt={this.props.name}
             className={'crypto'}
        />
      </OverlayTrigger>
    )
  }
}

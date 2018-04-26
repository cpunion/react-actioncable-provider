import React, {Component} from 'react';
import PropTypes from 'prop-types';
import actioncable from 'actioncable';

class ActionCableProvider extends Component {
  getChildContext() {
    return {
      cable: this.cable
    };
  }

  componentWillMount() {
    this.setupCable(this.props);
  }

  componentWillUnmount() {
    if (!this.props.cable && this.cable) {
      this.cable.disconnect()
    }
  }

  componentWillReceiveProps(nextProps) {
    // Props not changed
    if (this.props.cable === nextProps.cable &&
        this.props.url === nextProps.url) {
      return;
    }

    // cable is created by self, disconnect it
    this.componentWillUnmount();

    // create or assign cable
    this.setupCable(nextProps);
  }

  setupCable(props) {
    if (props.cable) {
      this.cable = props.cable;
    } else {
      this.cable = actioncable.createConsumer(props.url);
    }
  }
  
  render() {
    return this.props.children || null;
  }
}

ActionCableProvider.propTypes = {
  cable: PropTypes.object,
  url: PropTypes.string,
  children: PropTypes.any
}

ActionCableProvider.childContextTypes = {
  cable: PropTypes.object.isRequired
}

ActionCableProvider.displayName = 'ActionCableProvider';

export default ActionCableProvider;
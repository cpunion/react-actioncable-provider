import React, {Component} from 'react';
import PropTypes from 'prop-types';

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export default function cable(WrappedComponent, options) {
  class Cable extends Component {
    // setup all the event handler functions.
    // if these are defined on the child component then they will be automatically executed here
    componentDidMount() {
      this.setupCable(this.props);
    }

    componentWillReceiveProps(nextProps) {
      if (this.props.channel != nextProps.channel || this.props.room != nextProps.room) {
        this.unloadCable();
        this.setupCable(nextProps);
      }
    }

    componentWillUnmount() {
      this.unloadCable();
    }

    // initialize the cable instance
    // this must be a standalone function for support when props update
    setupCable(props) {
      const {channel, room} = props;
      
      const eventHandlers = {
        received: data => { this.callHandler(this.options.onChannelReceived, data) },
        initialized: () => { this.callHandler(this.options.onChannelInit); },
        connected: () => { this.callHandler(this.options.onChannelConnected); },
        disconnected: () => { this.callHandler(this.options.onChannelDisconnected); },
        rejected: () => { this.callHandler(this.options.onChannelRejected); }
      };

      const config = {
        channel: channel
      };

      // support for optional room parameter
      if (room != null) {
        config.room = room;
      }

      this.cable = this.context.cable.subscriptions.create(config, eventHandlers);
    }

    unloadCable() {
      if (this.cable) {
        this.context.cable.subscriptions.remove(this.cable)
        this.cable = null
      }
    }
  
    send(data) {
      if (!this.cable) {
        throw new Error('ActionCable component unloaded')
      }
  
      this.cable.send(data)
    }
  
    perform(action, data) {
      if (!this.cable) {
        throw new Error('ActionCable component unloaded')
      }
  
      this.cable.perform(action, data)
    }

    callHandler(fnName, arg = null) {
      const com = WrappedComponent;
      com.prototype[fnName] && 
        typeof com.prototype[fnName] == 'function' &&
        com.prototype[fnName](arg);
    }

    // fetches the options passed in, merged with the default options
    get options() {
      return {
        onChannelReceived: 'onChannelReceived',
        onChannelInit: 'onChannelInit',
        onChannelConnected: 'onChannelConnected',
        onChannelDisconnected: 'onChannelDisconnected',
        onChannelRejected: 'onChannelRejected',
        ...options
      };
    }

    render() {
      return (
        <WrappedComponent {...this.props} cable={this.cable} cableSend={this.send} cablePerform={this.perform} />
      )
    }
  }
  Cable.propTypes = {
    channel: PropTypes.string.isRequired,
    room: PropTypes.string
  };
  Cable.defaultProps = {
    room: null
  };
  Cable.contextTypes = {
    cable: PropTypes.object.isRequired
  };
  Cable.displayName = `Cable(${getDisplayName(WrappedComponent)})`;
  return Cable;
}
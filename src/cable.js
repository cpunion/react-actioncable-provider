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
      this.cable = this.context.cable.subscriptions.create(
        options.channel,
        {
          received: function (data) {
            WrappedComponent.prototype.onChannelReceived && WrappedComponent.prototype.onChannelReceived(data);
          },
          initialized: function () {
            WrappedComponent.prototype.onChannelInit && WrappedComponent.prototype.onChannelInit();
          },
          connected: function () {
            WrappedComponent.prototype.onChannelConnected && WrappedComponent.prototype.onChannelConnected();
          },
          disconnected: function () {
            WrappedComponent.prototype.onChannelDisconnected && WrappedComponent.prototype.onChannelDisconnected();
          },
          rejected: function () {
            WrappedComponent.prototype.onChannelRejected && WrappedComponent.prototype.onChannelRejected();
          }
        }
      );
    }

    componentWillUnmount() {
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

    render() {
      return (
        <WrappedComponent {...this.props} cable={this.cable} cableSend={this.send} cablePerform={this.perform} />
      )
    }
  }
  Cable.contextTypes = {
    cable: PropTypes.object.isRequired
  }
  Cable.displayName = `Cable(${getDisplayName(WrappedComponent)})`;
  return Cable;
}
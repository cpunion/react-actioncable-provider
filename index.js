"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var React = require('react')
var actioncable = require('actioncable')

var ActionCableProvider = React.createClass({
  getChildContext: function () {
    return {
      cable: this.cable
    }
  },

  componentWillMount: function () {
    if (this.props.cable) {
      this.cable = this.props.cable
    } else {
      this.cable = actioncable.createConsumer(this.props.url)
    }
  },

  componentWillUnmount: function () {
    if (!this.props.cable && this.cable) {
      this.cable.disconnect()
    }
  },

  componentWillReceiveProps: function (nextProps) {
    // Props not changed
    if (this.props.cable === nextProps.cable &&
        this.props.url === nextProps.url) {
      return
    }

    // cable is created by self, disconnect it
    this.componentWillUnmount()

    // create or assign cable
    this.componentWillMount()
  },

  render: function () {
    return this.props.children
  }
})

ActionCableProvider.propTypes = {
  cable: React.PropTypes.object,
  url: React.PropTypes.string,
  children: React.PropTypes.any
}

ActionCableProvider.childContextTypes = {
  cable: React.PropTypes.object.isRequired
}

var ActionCable = React.createClass({
  componentDidMount () {
    const self = this
    const {
      onReceive, onInitialized, onConnected, onDisconnected, onRejected
    } = this.props

    this.cable = this.context.cable.subscriptions.create(
      this.props.channel,
      {
        received (data) {
          onReceived && onReceived(data)
        },
        initialized () {
          onInitialized && onInitialized()
        },
        connected () {
          onConnected && onConnected()
        },
        disconnect () {
          onDisconnected && onDisconnected()
        },
        rejected () {
          onRejected && onRejected()
        }
      }
    )
  },

  componentWillUnmount () {
    if (this.cable) {
      this.context.cable.subscriptions.remove(this.cable)
      this.cable = null
    }
  },

  send (data) {
    if (!this.cable) {
      throw new Error('ActionCable component unloaded')
    }

    this.cable.send(data)
  },

  perform (action, data) {
    if (!this.cable) {
      throw new Error('ActionCable component unloaded')
    }

    this.cable.perform(action, data)
  },

  render: function () {
    return null
  }
})

ActionCable.propTypes = {
  onReceive: React.PropTypes.func,
  onInitialized: React.PropTypes.func,
  onConnected: React.PropTypes.func,
  onDisconnected: React.PropTypes.func,
  onRejected: React.PropTypes.func,
}
ActionCable.contextTypes = {
  cable: React.PropTypes.object.isRequired
}

exports.ActionCable = ActionCableProvider.ActionCable = ActionCable

exports.default = module.exports = ActionCableProvider

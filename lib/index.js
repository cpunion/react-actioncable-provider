"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var React = require('react')
var PropTypes = require('prop-types')
var actioncable = require('actioncable')
var createReactClass = require('create-react-class')
var _isEqual = require('lodash/isEqual')

var ActionCableProvider = createReactClass({
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
    return this.props.children || null
  }
})

ActionCableProvider.displayName = 'ActionCableProvider'

ActionCableProvider.propTypes = {
  cable: PropTypes.object,
  url: PropTypes.string,
  children: PropTypes.any
}

ActionCableProvider.childContextTypes = {
  cable: PropTypes.object.isRequired
}

var ActionCable = createReactClass({
  componentDidMount: function () {
    this.subscribe(this.props)
  },

  subscribe: function(props) {
    var onReceived = props.onReceived,
        onInitialized = props.onInitialized,
        onConnected = props.onConnected,
        onDisconnected = props.onDisconnected,
        onRejected = props.onRejected;

    this.cable = this.context.cable.subscriptions.create(
      props.channel,
      {
        received: function (data) {
          onReceived && onReceived(data)
        },
        initialized: function () {
          onInitialized && onInitialized()
        },
        connected: function () {
          onConnected && onConnected()
        },
        disconnected: function () {
          onDisconnected && onDisconnected()
        },
        rejected: function () {
          onRejected && onRejected()
        }
      }
    )
  },

  unsubscribe: function() {
    if (this.cable) {
      this.context.cable.subscriptions.remove(this.cable)
      this.cable = null
    }
  },

  componentWillUnmount: function () {
    this.unsubscribe()
  },

  componentWillReceiveProps: function (nextProps) {
    // recreate the subscription when channel changes
    if (_isEqual(this.props.channel, nextProps.channel)) {
      return
    }

    this.unsubscribe()
    this.subscribe(nextProps)
  },

  send: function (data) {
    if (!this.cable) {
      throw new Error('ActionCable component unloaded')
    }

    this.cable.send(data)
  },

  perform: function (action, data) {
    if (!this.cable) {
      throw new Error('ActionCable component unloaded')
    }

    this.cable.perform(action, data)
  },

  render: function () {
    return this.props.children || null
  }
})

ActionCable.displayName = 'ActionCable'

ActionCable.propTypes = {
  onReceived: PropTypes.func,
  onInitialized: PropTypes.func,
  onConnected: PropTypes.func,
  onDisconnected: PropTypes.func,
  onRejected: PropTypes.func,
  children: PropTypes.any,
}
ActionCable.contextTypes = {
  cable: PropTypes.object.isRequired
}

exports.ActionCable = ActionCable
exports.ActionCableProvider = ActionCableProvider

// Compatible old usage
exports.default = ActionCableProvider

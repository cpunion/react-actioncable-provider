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
    this.cable = this.context.cable.subscriptions.create(
      this.props.channel,
      {
        received (data) {
          if (self.cable) {
            self.props.onReceived(data)
          }
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

ActionCable.contextTypes = {
  cable: React.PropTypes.object.isRequired
}

exports.ActionCable = ActionCableProvider.ActionCable = ActionCable

exports.default = module.exports = ActionCableProvider

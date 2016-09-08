var React = require('react')
var ActionCable = require('actioncable')

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
      this.cable = ActionCable.createConsumer(this.props.url)
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

module.exports = ActionCableProvider

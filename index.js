var React = require('react')
var ActionCable = require('actioncable')
const { Component, PropTypes } = React

class ActionCableProvider extends Component {
  getChildContext () {
    return {
      cable: this.cable
    }
  }

  componentWillMount () {
    if (this.props.cable) {
      this.cable = this.props.cable
    } else {
      this.cable = ActionCable.createConsumer(this.props.url)
    }
  }

  componentWillUnmount () {
    if (!this.props.cable && this.cable) {
      this.cable.disconnect()
    }
  }

  componentWillReceiveProps (nextProps) {
    // Props not changed
    if (this.props.cable === nextProps.cable &&
        this.props.url === nextProps.url) {
      return
    }

    // cable is created by self, disconnect it
    this.componentWillUnmount()

    // create or assign cable
    this.componentWillMount()
  }

  render () {
    return this.props.children
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

module.exports = ActionCableProvider

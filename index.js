var React = require('react')
const { Component, PropTypes } = React

class ActionCableProvider extends Component {
  getChildContext () {
    return {
      cable: this.props.cable
    }
  }

  render () {
    return this.props.children
  }
}

ActionCableProvider.propTypes = {
  cable: PropTypes.object.isRequired,
  children: PropTypes.any
}

ActionCableProvider.childContextTypes = {
  cable: PropTypes.object.isRequired
}

module.exports = ActionCableProvider

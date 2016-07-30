import React, { Component, PropTypes } from 'react'

export default class ActionCableProvider extends Component {
  static propTypes = {
    cable: PropTypes.object.isRequired,
    children: PropTypes.any
  };

  static childContextTypes = {
    cable: PropTypes.object.isRequired
  };

  getChildContext () {
    return {
      cable: this.props.cable
    }
  }

  render () {
    return this.props.children
  }
}

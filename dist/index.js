"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var React = require("react");

var PropTypes = require("prop-types");

var actioncable = require("actioncable");

var createReactClass = require("create-react-class");

var _React$createContext = React.createContext(),
    Provider = _React$createContext.Provider,
    Consumer = _React$createContext.Consumer;

var ActionCableProvider = createReactClass({
  displayName: "ActionCableProvider",
  UNSAFE_componentWillMount: function UNSAFE_componentWillMount() {
    if (this.props.cable) {
      this.cable = this.props.cable;
    } else {
      this.cable = actioncable.createConsumer(this.props.url);
    }
  },
  componentWillUnmount: function componentWillUnmount() {
    if (!this.props.cable && this.cable) {
      this.cable.disconnect();
    }
  },
  UNSAFE_componentWillReceiveProps: function UNSAFE_componentWillReceiveProps(nextProps) {
    // Props not changed
    if (this.props.cable === nextProps.cable && this.props.url === nextProps.url) {
      return;
    } // cable is created by self, disconnect it


    this.componentWillUnmount(); // create or assign cable

    this.UNSAFE_componentWillMount();
  },
  render: function render() {
    return React.createElement(Provider, {
      value: {
        cable: this.cable
      }
    }, this.props.children || null);
  }
});
ActionCableProvider.displayName = "ActionCableProvider";
ActionCableProvider.propTypes = {
  cable: PropTypes.object,
  url: PropTypes.string,
  children: PropTypes.any
};
var ActionCableController = createReactClass({
  displayName: "ActionCableController",
  componentDidMount: function componentDidMount() {
    var self = this;
    var _props = this.props;
    var onReceived = _props.onReceived;
    var onInitialized = _props.onInitialized;
    var onConnected = _props.onConnected;
    var onDisconnected = _props.onDisconnected;
    var onRejected = _props.onRejected;
    this.cable = this.props.cable.subscriptions.create(this.props.channel, {
      received: function received(data) {
        onReceived && onReceived(data);
      },
      initialized: function initialized() {
        onInitialized && onInitialized();
      },
      connected: function connected() {
        onConnected && onConnected();
      },
      disconnected: function disconnected() {
        onDisconnected && onDisconnected();
      },
      rejected: function rejected() {
        onRejected && onRejected();
      }
    });
  },
  componentWillUnmount: function componentWillUnmount() {
    if (this.cable) {
      this.props.cable.subscriptions.remove(this.cable);
      this.cable = null;
    }
  },
  send: function send(data) {
    if (!this.cable) {
      throw new Error("ActionCable component unloaded");
    }

    this.cable.send(data);
  },
  perform: function perform(action, data) {
    if (!this.cable) {
      throw new Error("ActionCable component unloaded");
    }

    this.cable.perform(action, data);
  },
  render: function render() {
    return this.props.children || null;
  }
});
ActionCableController.displayName = "ActionCableController";
ActionCableController.propTypes = {
  cable: PropTypes.object,
  onReceived: PropTypes.func,
  onInitialized: PropTypes.func,
  onConnected: PropTypes.func,
  onDisconnected: PropTypes.func,
  onRejected: PropTypes.func,
  children: PropTypes.any
};
var ActionCableConsumer = React.forwardRef(function (props, ref) {
  var Component = createReactClass({
    displayName: "Component",
    render: function render() {
      var _this = this;

      return React.createElement(Consumer, null, function (_ref) {
        var cable = _ref.cable;
        return React.createElement(ActionCableController, _objectSpread({
          cable: cable
        }, _this.props, {
          ref: _this.props.forwardedRef
        }), _this.props.children || null);
      });
    }
  });
  Component.displayName = "ActionCableConsumer";
  Component.propTypes = {
    onReceived: PropTypes.func,
    onInitialized: PropTypes.func,
    onConnected: PropTypes.func,
    onDisconnected: PropTypes.func,
    onRejected: PropTypes.func,
    children: PropTypes.any
  };
  return React.createElement(Component, _objectSpread({}, props, {
    forwardedRef: ref
  }), props.children || null);
});
var ActionCable = createReactClass({
  displayName: "ActionCable",
  componentDidMount: function componentDidMount() {
    console.warn("DEPRECATION WARNING: The <ActionCable /> component has been deprecated and will be removed in a future release. Use <ActionCableConsumer /> instead.");
  },
  render: function render() {
    return React.createElement(ActionCableConsumer, _objectSpread({}, this.props), this.props.children || null);
  }
});
ActionCable.displayName = "ActionCable";
ActionCable.propTypes = {
  onReceived: PropTypes.func,
  onInitialized: PropTypes.func,
  onConnected: PropTypes.func,
  onDisconnected: PropTypes.func,
  onRejected: PropTypes.func,
  children: PropTypes.any
};
exports.ActionCable = ActionCable;
exports.ActionCableConsumer = ActionCableConsumer;
exports.ActionCableController = ActionCableController;
exports.ActionCableProvider = ActionCableProvider; // Compatible old usage

exports["default"] = ActionCableProvider;
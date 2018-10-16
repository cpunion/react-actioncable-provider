# ActionCable Provider for React

This package provides an ActionCable context provider and consumer to allow you to subscribe to ActionCable channels in your React components.

## Requirements

As this package uses React's new Context API, **React 16.3+ is required**.

## Install

```shell
npm install --save react-actioncable-provider
# OR
yarn add react-actioncable-provider
```

## Usage

The public API exports two components that you'll use: `<ActionCableProvider />` and `<ActionCableConsumer />`.

### `<ActionCableProvider />`

The provider is used in an outer container and wraps all of the components that may or may not consume the context. It accepts one of two props: `url` and `cable`. Passing `url` will result in the provider instantiating its own `ActionCable.Consumer` with that URL. Passing `cable` allows you to manually instantiate an `ActionCable.Consumer` on your own and pass it to the provider to be used by all descendent consumers.

#### With `url`

```jsx
<ActionCableProvider url="ws://test.example.com/cable">...</ActionCableProvider>
```

#### With `cable`

```jsx
import ActionCable from 'actioncable';

const cable = ActionCable.createConsumer('ws://test.example.com/cable');

<ActionCableProvider cable={cable}>...</ActionCableProvider>;
```

### `<ActionCableConsumer />`

The consumer will wrap an individual component. It accepts several props:

- `channel` [String] Name of the channel to which you want to subscribe.
- `channel` [Object] An object with a `channel` key which denotes the channel to which you want to subscribe. All other keys are passed to the channel as params.
- `onConnected` [Function] A handler function that is called when the channel connects.
- `onDisconnected` [Function] A handler function that is called when the channel disconnects.
- `onInitialized` [Function] A handler function that is called when the `ActionCable`.`Consumer` is initialized.
- `onRejected` [Function] A handler function that is called when the requested subscription is rejected.
- `onReceived` [Function] A handler function that is called when the channel transmits a message to the client.

```jsx
import React from 'react';
import PropTypes from 'prop-types';
import { ActionCableConsumer } from 'react-actioncable-provider';

export default class Widget extends React.Component {
  static propTypes = {
    message: PropTypes.string
  };

  constructor(...props) {
    super(...props);

    this.handleReceived = this.handleReceived.bind(this);

    this.state = {
      message: ''
    };
  }

  handleReceived(message) {
    this.setState(state => {
      return {
        message
      };
    });
  }

  render() {
    return (
      <ActionCableConsumer
        channel="WidgetChannel"
        onReceived={this.handleReceived}
      >
        <h1>{this.state.message}</h1>
      </ActionCableConsumer>
    );
  }
}
```

## Other Uses

### React Native

See https://github.com/cpunion/react-native-actioncable

### Server Side Rendering

See https://github.com/cpunion/react-actioncable-provider/issues/8

Example: https://github.com/cpunion/react-actioncable-ssr-example

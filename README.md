ActionCable Provider for React. Version 2.0

# Install

```
npm install --save react-actioncable-provider
```

# Usage

## In outer container:

```
<ActionCableProvider>
</ActionCableProvider>
```

You can also use following code to specify actioncable url:

```
<ActionCableProvider url='ws://localhost:3000/cable'>
</ActionCableProvider>
```

Or custom cable:

```jsx
import { ActionCableProvider } from 'react-actioncable-provider'
const cable = ActionCable.createConsumer('ws://localhost:3000/cable')

export default function Container (props) {
    return (
        <ActionCableProvider cable={cable}>
            <MyApp />
        </ActionCableProvider>
    )
}
```

## In some UI screen

### Recommended

You must wrap the component you wish to connect to ActionCable with the `cable` HOC.

```jsx
import React, { Component, PropTypes } from 'react'
import {cable} from 'react-actioncable-provider'

class ChatRoom extends Component {
    state = {
      messages: []
    };

    onChannelReceived(message) {
        this.setState({
            messages: [
                ...this.state.messages,
                message
            ]
        })
    }

    sendMessage() {
        const message = this.refs.newMessage.value
        // Call perform or send
        this.props.channelPerform('sendMessage', {message})
    }

    render() {
        return (
            <div>
                <ActionCable ref='roomChannel' channel={{channel: 'RoomChannel', room: '3'}} onReceived={this.onReceived} />
                <ul>
                    {this.state.messages.map((message) =>
                        <li key={message.id}>{message.body}</li>
                    )}
                </ul>
                // please don't fetch input value by ref, for example ONLY
                <input ref='newMessage' type='text' />
                <button onClick={this.sendMessage}>Send</button>
            </div>
        )
    }
}

export default cable(ChatRoom, {
	onChannelReceived: 'onChannelReceived'
});
```

You must then pass the `ChatRoom` component the props `channel` and optionally; `room`

```jsx
<ChatRoom channel="ChatRoomChannel" room="testing_room" />
```

### Not recommended
* **DEPRECATED**

You also can use this.context.cable to subscript channel, then you can receive or send data.

```jsx
import React, { Component, PropTypes } from 'react'
import ActionCable from 'actioncable'

export default class ChatRoom extends Component {
    static contextTypes = {
        cable: PropTypes.object.isRequired
    };

    componentDidMount () {
        this.subscription = this.context.cable.subscriptions.create(
            'ChatChannel',
            {
                received (data) {
                    console.log(data)
                }
            }
        )
    }

    componentWillUnmount () {
        this.subscription &&
            this.context.cable.subscriptions.remove(this.subscription)
    }

    // ... Other code
}
```

# API

The Following can be imported from `react-actioncable-provider`.

### Component: `ActionCableProvider`

A provider component to pass context down to any children for easier access.
This component must be included at the top level of your application, please see usage for details.

#### Props

| Prop Name | Description | Type | Required |
| --------- | ----------- | ---- | -------- |
| url       | URL of the Actioncable Endpoint | String | Yes |
| cable.    | Custom cable object | Object | No |

### Higher Order Component: `cable`

A [HOC](https://reactjs.org/docs/higher-order-components.html) to provide ActionCable event bindings to a component, as well as ActionCable `perform` and `send` functions. This HOC will automatically use event handler functions defined in your component class, if these are not present the event handlers will not be executed. Please refer to the options table for the event handlers default names.

#### Syntax

```jsx
import {cable} from 'react-actioncable-provider';

class ChatRoom extends React.Component {
  ... // Component definition
}

export default cable(ChatRoom, {
  ... options
});
```

#### Event Handlers

These event handlers are executed on the wrapped component class/function. If these event handlers are not defined, it will not throw an error, but no handler will be called. These must be defined on component class itself.

| Function Name | Description | Type | Arguments |
| ----------- | ----------- | ---- | ------- |
| onChannelReceived | Event handler called when new data is received from the subscribed channel | String | `data: Type object` |
| onChannelInit | Event handler called when the connection object is initialized | String | None |
| onChannelConnected | Event handler called when the channel was successfully connected to | String | None |
| onChannelDisconnected | Event handler called when the channel was successfully disconnected from | String | None |
| onChannelRejected | Event handler called when the channel connection was rejected | String | None |

##### Example

```jsx
import {cable} from 'react-actioncable-provider';

class ChatRoom extends React.Component {
  onChannelReceived(data) {
    console.log(data);
  }
	
  onChannelConnected() {
    console.log('successfully connected to cable! woohoo!');
  }
}

export default cable(ChatRoom);
```

#### Options

You can pass in some options to the HOC function to bind the event handlers, it will expect these names to be valid functions on your component class. All values are optional.

| Option Name | Description | Type | Default |
| ----------- | ----------- | ---- | ------- |
| onChannelReceived | Event handler called when new data is received from the subscribed channel | String | `onChannelReceived` |
| onChannelInit | Event handler called when the connection object is initialized | String | `onChannelInit` |
| onChannelConnected | Event handler called when the channel was successfully connected to | String | `onChannelConnected` |
| onChannelDisconnected | Event handler called when the channel was successfully disconnected from | String | `onChannelDisconnected` |
| onChannelRejected | Event handler called when the channel connection was rejected | String | `onChannelRejected` |

##### Example

```jsx
import {cable} from 'react-actioncable-provider';

class ChatRoom extends React.Component {
  fooBar(data) {
    console.log('A custom event handler function!');
  }
}

export default cable(ChatRoom, {
  onChannelReceived: 'fooBar'
});
```

#### Props

These props can be passed into the wrapped component

| Prop Name | Description | Type | Required |
| --------- | ----------- | ---- | -------- |
| channel   | Name of channel to connect to | String | Yes |
| room      | Name of room to connect to | String | No |

#### Provided Props

These props are provided to your wrapped component automatically.

| Prop Name | Description | Type | Arguments |
| --------- | ----------- | ---- | --------- |
| cable     | An ActionCable object instance | Object | N/A |
| cableSend | A function to send data to the cable connection | Function | `data: type Object` |
| cablePerform | A function to call a `perform` action on the cable connection | Function | `action: type String` `data: type Object` |



# Use in React Native

See https://github.com/cpunion/react-native-actioncable

# Server Side Rendering

See https://github.com/cpunion/react-actioncable-provider/issues/8

Example: https://github.com/cpunion/react-actioncable-ssr-example


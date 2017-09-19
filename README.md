ActionCable Provider for React.

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

* **Recommendation**

You can use ActionCable.

```jsx
import React, { Component, PropTypes } from 'react'
import {ActionCable} from 'react-actioncable-provider'

export default class ChatRoom extends Component {
    state = {
      messages: []
    };

    onReceived (message) {
        this.setState({
            messages: [
                ...this.state.messages,
                message
            ]
        })
    }

    sendMessage = () => {
        const message = this.refs.newMessage.value
        // Call perform or send
        this.refs.roomChannel.perform('sendMessage', {message})
    }

    render () {
        return (
            <div>
                <ActionCable ref='roomChannel' channel={{channel: 'RoomChannel', room: '3'}} onReceived={this.onReceived} />
                <ul>
                    {this.state.messages.map((message) =>
                        <li key={message.id}>{message.body}</li>
                    )}
                </ul>
                <input ref='newMessage' type='text' />
                <button onClick={this.sendMessage}>Send</button>
            </div>
        )
    }
}
```

* **No recommendation**

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

# Use in React Native

See https://github.com/cpunion/react-native-actioncable

# Server Side Rendering

See https://github.com/cpunion/react-actioncable-provider/issues/8

Example: https://github.com/cpunion/react-actioncable-ssr-example


ActionCable Provider for React.

# Install

```
npm install --save react-actioncable-provider
```

# Usage

In outer container:

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

You can also use like below:

```
<ActionCableProvider url='ws://localhost:3000/cable'>
</ActionCableProvider>
```

Or connection with default endpoint:

```
<ActionCableProvider>
</ActionCableProvider>
```

In some UI screen:

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

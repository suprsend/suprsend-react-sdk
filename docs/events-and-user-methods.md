# Events and User methods

### Prerequisites

- Integrate [SuprSendProvider](../README.md#integration) in your application.

### Call track and user update methods

```typescript
import { useSuprSendClient } from '@suprsend/react';

const suprSendClient = useSuprSendClient(); // get the client

suprSendClient.track('TEST_EVENT'); // trigger event
suprSendClient.user.addEmail('noone@example.com'); // user method
```

Detailed documentation of events and user methods is available [here](https://docs.suprsend.com/docs/js-events-and-user-methods).

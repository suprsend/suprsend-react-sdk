# Web Push

### Step 1: Integrate SuprSendProvider

Integrate [SuprSendProvider](../README.md#integration) in your application and pass `vapidKey` to `SuprSendProvider`. You can find it in _`SuprSend Dashboard --> Vendors --> WebPush`_.

### Step 2: Add ServiceWorker file

Create `serviceworker.js` file such that it should be publicly accessible from `https://<your_domain>/serviceworker.js`. To use a file name other than the default `serviceworker.js`, pass the `swFileName` prop to `SuprSendProvider`.

Add below code in that service worker file and replace `YOUR_PUBLIC_API_KEY` with key passed as `publicApiKey` to `SuprSendProvider`

```javascript
// serviceworker.js
importScripts(
  'https://cdn.jsdelivr.net/npm/@suprsend/web-sdk@4.0.0/public/serviceworker.min.js'
);

initSuprSend(YOUR_PUBLIC_API_KEY); // replace publicApiKey with your key
```

### Step 3: Register Push

Call `registerPush` in your code, which will perform following tasks:

- Ask for notification permission.

- Register push service and generate webpush token.

- Send webpush token to SuprSend.

```typescript
import { useSuprSendClient } from '@suprsend/react';

const suprSendClient = useSuprSendClient();

const response = await suprSendClient.webpush.registerPush();
```

> **Returns:** `Promise<ApiResponse>`

> [NOTE]\
> This method should be called on user action like button click for better UX. Don't call this on page load.

### Check for notification permission

```javascript
suprSendClient.webpush.notificationPermission():
```

This will return a string representing the current permission. The value can be:

| Value   | Description                                                                               |
| ------- | ----------------------------------------------------------------------------------------- |
| granted | The user has granted permission for the current origin to display notifications.          |
| denied  | The user has denied permission for the current origin to display notifications.           |
| default | The user's decision is unknown. This will be permission when user first lands on website. |

# SuprSend React SDK

We offer two SDKs for React applications:

- [@suprsend/react-core](https://github.com/suprsend/suprsend-react-core): Provides context providers and hooks to integrate SuprSend into your application. This is the better option if you want to use web push, user methods, and event tracking, or build your own UI for preferences and inbox using the provided methods. If you want ready-made components for inbox or preferences, use `@suprsend/react` instead.

- `@suprsend/react`: Built on top of `@suprsend/react-core`, so it includes all the hooks, context providers, and methods available there. In addition, it offers drop-in components like Inbox, NotificationFeed, and Preferences with prebuilt UI to ease integration.

## Documentation

- [WebPush](docs/webpush.md)
- [Events and User methods](docs/events-and-user-methods.md)
- [Preferences](docs/preferences.md)
- [InApp Feed](docs/in-app-feed.md)
  - [Toast Notifications](docs/toast-notifications.md)
  - [Customising Feed](docs/customising-feed.md)
- [Migration Guide](docs/migration-guide.md)

Refer type definitions for this library [here](src/Feed/interface.ts).

## Installation

```bash
npm install @suprsend/react # for npm

yarn add @suprsend/react # for yarn
```

## Integration

The `SuprSendProvider` context provider must wrap the components in which you want to use SuprSend functionality.

```javascript
import { SuprSendProvider } from '@suprsend/react';

function Example() {
  return (
    <SuprSendProvider publicApiKey={YOUR_KEY} distinctId={YOUR_DISTINCT_ID}>
      <MyComponent />
    </SuprSendProvider>
  );
}
```

```typescript
interface SuprSendProviderProps {
  publicApiKey: string;
  distinctId?: unknown;
  userToken?: string;
  tenantId?: string;
  pushTokenActionOnTenantChange?: 'none' | 'copy' | 'move';
  tenantChangeHandler?: ({
    tenantId,
    response,
  }: {
    tenantId?: string;
    response: ApiResponse;
  }) => void;
  host?: string;
  vapidKey?: string;
  swFileName?: string;
  refreshUserToken?: (
    oldUserToken: string,
    tokenPayload: Dictionary
  ) => Promise<string>;
  userAuthenticationHandler?: ({ response: ApiResponse }) => void;
}
```

| Parameter                     | Description                                                                                                                                                                                                                                                                                                                                        |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| publicApiKey                  | Mandatory. Public API key used to authenticate the SDK — `SuprSendProvider` throws an error if it is missing. You can get it from the SuprSend Dashboard.                                                                                                                                                                                          |
| distinctId                    | Unique identifier of the user. When a value is passed, the SDK creates and authenticates the user. Passing `null` clears the authenticated user's instance data in your application, similar to a logout.                                                                                                                                          |
| userToken                     | JWT token generated on your server, required only when enhanced security mode is turned on in the SuprSend Dashboard. Enhanced security mode adds an extra layer of authentication, recommended for production environments. Read more about it [here](https://docs.suprsend.com/docs/client-authentication).                                      |
| tenantId                      | Needed only when you use multi-tenant architecture. Scopes the identified user's events, preferences, and in-app feed to that tenant. Its value must match `scope.tenant_id` in the `userToken` payload, otherwise a scoping error is raised. Changing the `tenantId` prop switches the active tenant of the identified user.                      |
| pushTokenActionOnTenantChange | Defaults to `none`. Controls what happens to the existing webpush subscription when the `tenantId` prop changes. `none` leaves it attached to the current tenant, `copy` attaches it to the new tenant as well, `move` detaches it from the current tenant and attaches it to the new tenant. Only relevant if you use [WebPush](docs/webpush.md). |
| tenantChangeHandler           | Callback invoked with the response after a `tenantId` prop change switches the active tenant of the identified user. If `response.status` is `error`, the previous tenant remains active - revert or retry the `tenantId` prop.                                                                                                                    |
| refreshUserToken              | Callback invoked internally by the SDK to replace the `userToken` with a new one before it expires                                                                                                                                                                                                                                                 |
| userAuthenticationHandler     | Callback invoked after the SDK internally authenticates the user you pass via `distinctId`. It gives you the response of the user creation API call.                                                                                                                                                                                               |
| host                          | Customise the host URL.                                                                                                                                                                                                                                                                                                                            |
| vapidKey                      | Needed only if you are implementing WebPush notifications. You can find it in SuprSend Dashboard --> Vendors --> WebPush.                                                                                                                                                                                                                          |
| swFileName                    | Needed only if you are implementing WebPush notifications and want to replace the default `serviceworker.js` file name with your own service worker file name.                                                                                                                                                                                     |

> **Note**
>
> Changing the `tenantId` prop switches the active tenant of the identified user without re-authenticating. The `Inbox` and `NotificationFeed` components re-initialize on the new tenant unless pinned with their own `tenantId`. Previously fetched preferences keep the tenant they were fetched with - call `getPreferences` again to load the new tenant's data.

Once `SuprSendProvider` is in place, you can use all SuprSend features.

### Check for Authenticated User

The `useAuthenticateUser` hook returns the authenticated user and can be called anywhere in your application inside `SuprSendProvider`. You can also use it to check whether the user is authenticated before calling any SuprSend method.

```javascript
import { useAuthenticateUser } from '@suprsend/react';

function MyComponent() {
  const { authenticatedUser } = useAuthenticateUser();

  useEffect(() => {
    if (authenticatedUser) {
      console.log('User is authenticated', authenticatedUser);
    }
  }, [authenticatedUser]);

  return <p>Hello world</p>;
}
```

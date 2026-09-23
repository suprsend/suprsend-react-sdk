# Popover feed

## Inbox (Popover Feed)

```javascript
import { Inbox, SuprSendProvider } from '@suprsend/react';

function Example() {
  return (
    <SuprSendProvider>
      <Inbox />
    </SuprSendProvider>
  );
}
```

```typescript
interface InboxProps {
  tenantId?: string; // defaults to active tenant set in SuprSendProvider, else 'default' tenant
  stores?: IStore[] | null; // pass it if you want to use multiple tabs
  host?: {
    socketHost?: string;
    apiHost?: string;
  };
  pageSize?: number; // defined page size defaults to 20, max value that can be passed is 100
  reachability?: boolean; // defaults to true. Pass false to hide the connection status dot and banner. See "Connection status" below
  pagination?: boolean; // pass false to disable pagination
  theme?: ITheme; // used to customise css styles of existing component
  themeType?: ThemeType; // dark or light
  popperPosition?: Placement; // placement of inbox popover on click of bell
  hideAvatar?: boolean;
  showUnreadCountOnTabs?: boolean;
  notificationClickHandler?: (notification: IRemoteNotification) => void; // callback executed on click of notification card
  primaryActionClickHandler?: (notification: IRemoteNotification) => void; // callback executed on click of primary action button
  secondaryActionClickHandler?: (notification: IRemoteNotification) => void; // callback executed on click of secondary action button
  bellComponent?: React.FC; // custom component for bell
  badgeComponent?: React.FC<{ count: number }>; // custom component for badge
  loaderComponent?: React.FC; // custom component for loader
  noNotificationsComponent?: React.FC; // custom component when no notifications are present
  tabBadgeComponent?: React.FC<{ count: number }>;
  notificationComponent?: React.FC<CustomNotificationCard>; // custom notification card component
  headerRightComponent?: React.FC<{
    markAllRead: () => void;
    closeInboxPopover: () => void;
  }>; // custom right side header component to override mark all as read etc
}
```

Note: Refer [Customising Feed](customising-feed.md) for detailed explanation on customisation options available in feed components.

<img src="https://files.readme.io/8134005a504eceaeeba615a8d9189cdc363e99a62f51be601e23177f8651c166-Screenshot_2025-01-14_at_5.50.46_PM.png" alt="Inbox popover feed" width="400" />

## Full screen or Sidesheet feed

To render notifications in a full screen, side-sheet, or any other custom layout, use the `NotificationFeed` component wrapped inside [SuprSendFeedProvider](https://github.com/suprsend/suprsend-react-core/blob/main/docs/inbox.md#suprsendfeedprovider). Both these components must be rendered inside [SuprSendProvider](../README.md#integration). Internally, the `Inbox` popover component uses this same `NotificationFeed` component, wrapped inside a popover.

```javascript
import {
  SuprSendProvider,
  SuprSendFeedProvider,
  NotificationFeed,
} from '@suprsend/react';

function Example() {
  return (
    <SuprSendProvider>
      <SuprSendFeedProvider>
        <NotificationFeed />
      </SuprSendFeedProvider>
    </SuprSendProvider>
  );
}
```

```typescript
interface SuprSendFeedProviderProps {
  tenantId?: string; // defaults to active tenant set in SuprSendProvider, else 'default' tenant
  pageSize?: number;
  stores?: IStore[] | null;
  host?: { socketHost?: string; apiHost?: string };
  reachability?: boolean;
}

interface NotificationFeedProps {
  pagination?: boolean;
  showUnreadCountOnTabs?: boolean;
  hideAvatar?: boolean;
  themeType?: ThemeType;
  theme?: INotificationFeedTheme;
  notificationClickHandler?: (notification: IRemoteNotification) => void;
  primaryActionClickHandler?: (notification: IRemoteNotification) => void;
  secondaryActionClickHandler?: (notification: IRemoteNotification) => void;
  loaderComponent?: React.FC;
  noNotificationsComponent?: React.FC;
  tabBadgeComponent?: React.FC<{ count: number }>;
  notificationComponent?: React.FC<CustomNotificationCard>;
  headerRightComponent?: React.FC<{
    markAllRead: () => void;
    closeInboxPopover: () => void;
  }>;
}
```

> Please refer [Customising CSS styles](customising-feed.md#customising-css-styles) section to view typedefs for `INotificationFeedTheme`.

Infinite scroll is also included to fetch more pages in `NotificationFeed` component. Specifying height for the container is needed for infinite scroll to work properly.

```javascript
<NotificationFeed
  theme={{ notificationsContainer: { container: { height: '100vh' } } }}
/>
```

## Connection status

A feed that has silently stopped receiving notifications otherwise looks exactly like one with nothing new. `Inbox` surfaces the difference out of the box: the bell carries a small status dot next to the unread count, and the panel shows a banner whenever something is wrong.

```javascript
<Inbox /> // connection status is on

<Inbox reachability={false} /> // opt out
```


| State | Bell dot | Banner |
| --- | --- | --- |
| Feed is live | Green | None |
| Connection issue — realtime updates and/or fetching is down | Amber | "There seems to be a connection issue. New notifications may get delayed or missed." |
| Device has no internet | Hollow grey | "You're offline. Notifications will update when your connection is back." |

Every connection issue shows the same message regardless of which channel is down, since that distinction is yours to debug rather than the reader's to interpret.

The status dot and the unread count stay separate on purpose. The count badge only renders when something is unread, so it cannot report a problem on an empty inbox, which is exactly when a user is asking why nothing has arrived.

Nothing is shown until a connection outcome is actually observed, so the bell stays quiet on first paint. The offline banner has no "report" action, since the user's own network is not something you can act on.

When using `NotificationFeed` directly you own the provider, so opt in there. `SuprSendFeedProvider` defaults to `false`; `NotificationFeed` renders the status UI as soon as it is enabled:

```javascript
<SuprSendFeedProvider reachability>
  <NotificationFeed />
</SuprSendFeedProvider>
```

Note: `reachability` is read when the feed is created. Toggling it later has no effect, matching `stores`, `host` and `pageSize`.

Colors are themeable through `connectionDot` and `connectionBanner` — see [Customising CSS styles](customising-feed.md#customising-css-styles).

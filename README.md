# SuprSend React SDK

This library provides drop-in components to intergrate SuprSend features like InApp feed, Preferences etc in react applications. This library is built on top of [@suprsend/react-hooks](https://github.com/suprsend/suprsend-react-core). If you want to build UI from scratch, use [@suprsend/react-core](https://github.com/suprsend/suprsend-react-core).

## Installation

```bash
npm install @suprsend/react # for npm

yarn add @suprsend/react # for yarn
```

## Integration

**NOTE:** Refer [type definitions](https://github.com/suprsend/suprsend-react-sdk/blob/main/src/Feed/interface.ts) for this library.

### Inbox Popover

This components provides bell and inbox notifications popover. This is already wrapped in `SuprSendFeedProvider` components internally so you dont have to wrap this component inside `SuprSendFeedProvider` again.

```javascript
import { Inbox } from '@suprsend/react';

function Example() {
  return <Inbox pageSize={20} />;
}

// props for Inbox
interface InboxProps {
  tenantId?: string;
  stores?: IStore[] | null;
  host?: {
    socketHost?: string,
    apiHost?: string,
  };
  pageSize?: number;
  pagination?: boolean;
  theme?: ITheme;
  themeType?: ThemeType;
  popperPosition?: Placement;
  hideAvatar?: boolean;
  showUnreadCountOnTabs?: boolean;
  notificationClickHandler?: (notification: IRemoteNotification) => void;
  primaryActionClickHandler?: (notification: IRemoteNotification) => void;
  secondaryActionClickHandler?: (notification: IRemoteNotification) => void;
  bellComponent?: React.FC;
  badgeComponent?: React.FC<{ count: number }>;
  loaderComponent?: React.FC;
  noNotificationsComponent?: React.FC;
  tabBadgeComponent?: React.FC<{ count: number }>;
  notificationComponent?: React.FC<CustomNotificationCard>;
  headerRightComponent?: React.FC<{
    markAllRead: () => void,
    closeInboxPopover: () => void,
  }>;
}
```

### Adding Toast Notifications

From current version of SDK, toast notification is not longer included along with Inbox component. To show toast notification when new notification is arrived you have to listen for `feed.new_notification` event and use your toast library like `react-toastify` to show the notification.

```javascript
import { SuprSendFeedProvider, Inbox } from '@suprsend/react';

// if you use Inbox component show toast example
function Example() {
  return (
    <Inbox>
      <ToastNotification />
    </Inbox>
  );
}

// general setup to integrate toast
function HeadlessExample() {
  return (
    <SuprSendFeedProvider>
      <ToastNotification />
    </SuprSendFeedProvider>
  );
}

function ToastNotification() {
  const feedClient = useFeedClient();

  useEffect(() => {
    if (!feedClient) return;

    feedClient.emitter.on('feed.new_notification', (data) => {
      toast.custom(<ToastNotificationCard notificationData={data} />); // show toast with new notification data
      feedClient.markAsSeen(data.n_id); // marking seen
    });

    return () => {
      feedClient.emitter.off('feed.new_notification');
    };
  }, [feedClient]);

  return <Toaster />;
}
```

### Notifications Feed

If you want to render notifications in separate screen or in side modal or in any other way instead of popover, you can use this component. For this to work you have to wrap this component inside SuprSendFeedProvider.

```javascript
import { SuprSendFeedProvider, NotificationFeed } from '@suprsend/react';

function Example() {
  return (
    <SuprSendFeedProvider>
      <NotificationFeed />
    </SuprSendFeedProvider>
  );
}

// props for notification feed
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
    markAllRead: () => void,
    closeInboxPopover: () => void,
  }>;
}
```

Infinite sroll is also included to fetch more pages in this component. Specifying height for the container is needed for infinite scroll to work properly.

```typescript
import { NotificationFeed } from '@suprsend/react';

<NotificationFeed
  theme={{ notificationsContainer: { container: { height: '100vh' } } }}
/>;
```

### NotificationCard

This is single notification component item. It will be handy if you want to implement your own UI but want to use just notification card item.

```javascript
<NotificationCard notificationData={data} />;

// props for notification card
interface NotificationCardProps {
  notificationData: IRemoteNotification;
  notificationClickHandler?: (notificationData: IRemoteNotification) => void;
  notificationComponent?: React.FC<CustomNotificationCard>;
  hideAvatar?: boolean;
  themeType?: ThemeType;
  primaryActionClickHandler?: (notification: IRemoteNotification) => void;
  secondaryActionClickHandler?: (notification: IRemoteNotification) => void;
  theme?: INotificationCardTheme;
}
```

### ToastNotificationCard

This component is simplified version of notification card which can be used by your toast library to show toast notification.

```javascript
import { ToastNotificationCard } from '@suprsend/react';

<ToastNotificationCard notificationData={data} />;

// props for toast notification card
interface ToastNotificationProps {
  notificationData: IRemoteNotification;
  hideAvatar?: boolean;
  themeType?: ThemeType;
  theme?: ToastNotificationCardTheme;
}
```

### BodyMarkdown

This component is a paragraph field with support for rendering markdown language. Use this in case where you want to implement your custom notification card but dont want to handle adding markdown support on paragraph field, as it could be time consuming.

```javascript
import { BodyMarkdown } from '@suprsend/react';

<BodyMarkdown body={markdownText} />;

interface BodyMarkdownProps {
  body: string;
  handleActionClick?: HandleActionClick; // for links this callback will be executed on click
  style?: NotificationCardBodyTextThemeProps;
}
```

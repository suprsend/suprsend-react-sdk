# Toast Notifications

The SDK emits a `feed.new_notification` event on `feedClient` whenever a new notification arrives. You can listen for this event and show a toast using your preferred toast library. We also export the `ToastNotificationCard` component, a lighter version of the notification card, which you can render inside your toast. The example below uses [react-hot-toast](https://react-hot-toast.com/).

```javascript
import toast, { Toaster } from 'react-hot-toast';
import { SuprSendFeedProvider, Inbox, useFeedClient } from '@suprsend/react';

// drop-in Inbox component example
function Example() {
  return (
    <SuprSendProvider>
      <Inbox>
        <ToastNotification />
      </Inbox>
    </SuprSendProvider>
  );
}

// example when using SuprSendFeedProvider provider in headless or fullscreen feed
function HeadlessExample() {
  return (
    <SuprSendProvider>
      <SuprSendFeedProvider>
        <ToastNotification />
      </SuprSendFeedProvider>
    </SuprSendProvider>
  );
}

function ToastNotification() {
  const feedClient = useFeedClient();

  useEffect(() => {
    if (!feedClient) return;

    // event listener which return new notification data
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

```typescript
interface ToastNotificationProps {
  notificationData: IRemoteNotification;
  hideAvatar?: boolean;
  themeType?: ThemeType;
  theme?: ToastNotificationCardTheme;
}

interface ToastNotificationCardTheme {
  avatar?: React.CSSProperties;
  headerText?: React.CSSProperties;
  bodyText?: NotificationCardBodyTextThemeProps;
  container?: React.CSSProperties;
}

interface NotificationCardBodyTextThemeProps extends React.CSSProperties {
  color?: string;
  blockquoteColor?: string;
  tableBorderColor?: string;
  linkColor?: string;
}
```

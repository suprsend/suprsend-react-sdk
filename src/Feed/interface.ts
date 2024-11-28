import {
  IRemoteNotification,
  SuprSendFeedProviderProps,
  ApiResponse,
} from '@suprsend/react-hooks';
import { Placement } from '@popperjs/core';

export enum ThemeType {
  LIGHT = 'light',
  DARK = 'dark',
}

export interface BadgeThemeProps extends React.CSSProperties {
  backgroundColor?: string;
  color?: string;
}

export interface IconThemeProps {
  height?: number | string;
  width?: number | string;
  color?: string;
}

export interface TabsThemeProps {
  color?: string;
  unselectedColor?: string;
  bottomColor?: string;
  badgeColor?: string;
  badgeText?: string;
}

export interface LoaderThemeProps {
  color?: string;
}

export interface NotificationCardContainerThemeProps
  extends React.CSSProperties {
  borderBottom?: string | number;
  readBackgroundColor?: string;
  unreadBackgroundColor?: string;
  hoverBackgroundColor?: string;
}

export interface NotificationCardBodyTextThemeProps
  extends React.CSSProperties {
  color?: string;
  blockquoteColor?: string;
  tableBorderColor?: string;
  linkColor?: string;
}

export interface NotificationCardExpriesTextThemeProps
  extends React.CSSProperties {
  expiringBackgroundColor?: string;
  expiringColor?: string;
}

export interface NotificationCardActionButtonViewThemeProps
  extends React.CSSProperties {
  hoverBackgroundColor?: string;
}

export interface CardActionMenuIconThemeProps extends IconThemeProps {
  hoverBackgroundColor?: string;
}

export interface CardActionsMenuItem extends React.CSSProperties {
  hoverBackgroundColor?: string;
}

export interface CustomNotificationCard {
  notificationData: IRemoteNotification;
  markAsRead: (e?: Event) => Promise<ApiResponse> | undefined;
  markAsUnread: (e?: Event) => Promise<ApiResponse> | undefined;
  markAsArchived: (e?: Event) => Promise<ApiResponse> | undefined;
  markAsInteracted: (e?: Event) => Promise<ApiResponse> | undefined;
}

export interface NotificationFeedProps {
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
  pagination?: boolean;
  showUnreadCountOnTabs?: boolean;
  hideAvatar?: boolean;
  themeType?: ThemeType;
  theme?: INotificationFeedTheme;
}

export interface INotificationsContainerTheme {
  container?: React.CSSProperties;
  noNotificationsText?: React.CSSProperties;
  noNotificationsSubtext?: React.CSSProperties;
  loader?: LoaderThemeProps;
}

export interface IHeaderTheme {
  container?: React.CSSProperties;
  headerText?: React.CSSProperties;
  markAllReadText?: React.CSSProperties;
}

export interface INotificationCardTheme {
  container?: NotificationCardContainerThemeProps;
  pinnedIcon?: IconThemeProps;
  pinnedText?: React.CSSProperties;
  headerText?: React.CSSProperties;
  bodyText?: NotificationCardBodyTextThemeProps;
  unseenDot?: React.CSSProperties;
  avatar?: React.CSSProperties;
  createdOnText?: React.CSSProperties;
  subtext?: React.CSSProperties;
  expiresText?: NotificationCardExpriesTextThemeProps;
  actions?: Array<{
    container?: NotificationCardActionButtonViewThemeProps;
    text?: React.CSSProperties;
  }>;
  actionsMenuIcon?: CardActionMenuIconThemeProps;
  actionsMenu?: React.CSSProperties;
  actionsMenuItem?: CardActionsMenuItem;
  actionsMenuItemIcon?: IconThemeProps;
  actionsMenuItemText?: React.CSSProperties;
}

export interface INotificationFeedTheme {
  header?: IHeaderTheme;
  tabs?: TabsThemeProps;
  notificationsContainer?: INotificationsContainerTheme;
  notification?: INotificationCardTheme;
}

export interface ITheme extends INotificationFeedTheme {
  bell?: IconThemeProps;
  badge?: BadgeThemeProps;
}

export interface InboxPopoverProps extends NotificationFeedProps {
  bellComponent?: React.FC;
  badgeComponent?: React.FC<{ count: number }>;
  popperPosition?: Placement;
  theme?: ITheme;
}

export interface InboxProps
  extends SuprSendFeedProviderProps,
    InboxPopoverProps {}

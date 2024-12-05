import { Dictionary, useFeedClient } from '@suprsend/react-hooks';
import NotificationCard from './NotificationCard';
import { formatActionLink, mergeDeep } from '../utils';
import {
  INotificationCardTheme,
  ClickableNotificationProps,
  ThemeType,
  ClickHandlerPayload,
} from '../interface';
import { darkTheme } from '../utils/styles';

function getURLTarget(target?: boolean) {
  return target ? '_blank' : '_self';
}

function ClickableNotification({
  notificationData,
  notificationClickHandler,
  notificationComponent,
  hideAvatar,
  themeType,
  primaryActionClickHandler,
  secondaryActionClickHandler,
  theme,
}: ClickableNotificationProps) {
  const feedClient = useFeedClient();

  const cardClickNavigation = () => {
    if (typeof notificationClickHandler === 'function') {
      notificationClickHandler(notificationData);
    } else {
      const message = notificationData?.message;
      if (message?.url) {
        const actionUrlTarget = getURLTarget(message?.open_in_new_tab);
        window.open(formatActionLink(message.url), actionUrlTarget);
      }
    }
  };

  const markNotificationClicked = () => {
    return feedClient?.markAsInteracted(notificationData.n_id);
  };

  const handleCardClick = async (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.stopPropagation();
    await markNotificationClicked();
    cardClickNavigation();
  };

  const handleActionClick = async (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    clickData: ClickHandlerPayload
  ) => {
    e.stopPropagation();
    const actionUrlTarget = getURLTarget(clickData?.target);
    await markNotificationClicked();

    if (clickData.customClickHandler) {
      clickData.customClickHandler(notificationData);
    } else if (clickData?.url) {
      window.open(formatActionLink(clickData.url), actionUrlTarget);
    } else {
      cardClickNavigation();
    }
  };

  const modifiedTheme =
    themeType === ThemeType.DARK
      ? (mergeDeep(darkTheme, theme as Dictionary) as INotificationCardTheme)
      : theme || {};

  return (
    <div onClick={handleCardClick}>
      <NotificationCard
        notificationData={notificationData}
        handleActionClick={handleActionClick}
        notificationComponent={notificationComponent}
        hideAvatar={hideAvatar}
        themeType={themeType}
        primaryActionClickHandler={primaryActionClickHandler}
        secondaryActionClickHandler={secondaryActionClickHandler}
        theme={modifiedTheme}
      />
    </div>
  );
}

export default ClickableNotification;

import { Dictionary, useFeedClient } from '@suprsend/react-core';
import NotificationCard from './NotificationCard';
import { formatActionLink, mergeDeep } from '../utils';
import {
  INotificationCardTheme,
  ClickableNotificationProps,
  ThemeType,
  ClickHandlerPayload,
} from '../interface';
import { darkTheme } from '../utils/styles';
import useIntersectionObserver from '../utils/useIntersectionObserver';
import { useEffect } from 'react';

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
  scrollRef,
  setUnseenNotifications,
  unseenNotifications,
  enableIntersectionObserver,
}: ClickableNotificationProps) {
  const feedClient = useFeedClient();
  const [ref, entry] = useIntersectionObserver({
    threshold: 1,
    root: scrollRef.current,
    rootMargin: '0px',
    enable: enableIntersectionObserver,
  });

  useEffect(() => {
    if (
      entry?.isIntersecting &&
      !notificationData.seen_on &&
      unseenNotifications &&
      !unseenNotifications?.includes(notificationData.n_id)
    ) {
      setUnseenNotifications?.((prev) => [...prev, notificationData.n_id]);
    }
  }, [entry?.isIntersecting]);

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
    <div onClick={handleCardClick} ref={ref}>
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

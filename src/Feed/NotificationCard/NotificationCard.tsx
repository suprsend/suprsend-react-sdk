import { useEffect, useMemo, useState } from 'react';
import styled from '@emotion/styled';
import Markdown, { PluggableList } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import TimeAgo from 'react-timeago';
import { useFeedClient, useFeedData } from '@suprsend/react-core';
import { Pluggable } from 'unified';
import { CText, HelperText, lightColors } from '../utils/styles';
import {
  isImgUrl,
  getLongFormattedTime,
  getShortFormattedTime,
  isMobile,
} from '../utils';
import {
  ArchiveIcon,
  AvatarIcon,
  MoreIcon,
  PinnedNotificationIcon,
  ReadIcon,
  UnReadIcon,
} from './Icons';
import {
  NotificationCardProps,
  ExpiryTimerProps,
  BodyMarkdownProps,
} from '../interface';

function ExpiryTime({ dateInput, style }: ExpiryTimerProps) {
  const [, setTime] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setTime(Date.now()), 10000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  if (typeof dateInput !== 'number') return;

  const isExpiring = dateInput - Date.now() <= 3600000;
  const expiredAlready = Date.now() >= dateInput;

  return (
    <div>
      <ExpiresText
        style={{
          ...style,
          color: isExpiring
            ? style?.expiringColor || lightColors.error
            : style?.color || lightColors.secondaryText,
          backgroundColor: isExpiring
            ? style?.expiringBackgroundColor || 'rgba(217, 45, 32, 0.09)'
            : style?.backgroundColor || 'rgba(100, 116, 139, 0.09)',
        }}
      >
        Expires in{' '}
        {expiredAlready ? (
          'a minute'
        ) : (
          <TimeAgo
            date={dateInput}
            live={false}
            formatter={getLongFormattedTime}
          />
        )}
      </ExpiresText>
    </div>
  );
}

export function BodyMarkdown({
  body,
  handleActionClick,
  style,
  disableMarkdown,
}: BodyMarkdownProps) {
  const tableBorderColor =
    style?.tableBorderColor || 'rgba(100, 116, 139, 0.3)';
  const blockquoteColor = style?.blockquoteColor || 'rgba(100, 116, 139, 0.3)';
  const linkColor = style?.linkColor || lightColors.primary;

  return (
    <BodyText style={style}>
      {disableMarkdown ? (
        body
      ) : (
        <Markdown
          remarkPlugins={[remarkGfm as Pluggable] as PluggableList}
          rehypePlugins={[rehypeRaw as Pluggable] as PluggableList}
          components={{
            a({ children, href, style }) {
              return (
                <span
                  onClick={(e) => {
                    e.preventDefault();
                    handleActionClick?.(e, {
                      type: 'markdown_link',
                      url: href,
                    });
                  }}
                  style={{
                    color: linkColor,
                    textDecoration: 'none',
                    ...(style || {}),
                  }}
                >
                  {children}
                </span>
              );
            },
            p({ children, style }) {
              return (
                <p
                  style={{
                    margin: 0,
                    overflowWrap: 'anywhere',
                    ...(style || {}),
                  }}
                >
                  {children}
                </p>
              );
            },
            blockquote({ children, style }) {
              return (
                <blockquote
                  style={{
                    margin: 0,
                    paddingLeft: 10,
                    borderLeft: `3px ${blockquoteColor} solid`,
                    marginBottom: 5,
                    marginTop: 5,
                    ...(style || {}),
                  }}
                >
                  {children}
                </blockquote>
              );
            },
            ul({ children, style }) {
              return (
                <ul
                  style={{
                    whiteSpace: 'normal',
                    margin: 0,
                    paddingLeft: 10,
                    ...(style || {}),
                  }}
                >
                  {children}
                </ul>
              );
            },
            ol({ children, style }) {
              return (
                <ol
                  style={{
                    whiteSpace: 'normal',
                    margin: 0,
                    paddingLeft: 10,
                    ...(style || {}),
                  }}
                >
                  {children}
                </ol>
              );
            },
            img(props) {
              return (
                <img
                  style={{
                    maxWidth: '100%',
                    objectFit: 'contain',
                    ...(props?.style || {}),
                  }}
                  {...props}
                />
              );
            },
            table({ children, style }) {
              return (
                <table
                  style={{
                    overflowWrap: 'break-word',
                    borderCollapse: 'collapse',
                    ...(style || {}),
                  }}
                >
                  {children}
                </table>
              );
            },
            th({ children, style }) {
              return (
                <th
                  style={{
                    textAlign: 'left',
                    whiteSpace: 'nowrap',
                    border: `1px solid ${tableBorderColor}`,
                    padding: 5,
                    ...(style || {}),
                  }}
                >
                  {children}
                </th>
              );
            },
            td({ children, style }) {
              return (
                <td
                  style={{
                    border: `1px solid ${tableBorderColor}`,
                    padding: 5,
                    ...(style || {}),
                  }}
                >
                  {children}
                </td>
              );
            },
            h1({ children, style }) {
              return (
                <h1
                  style={{
                    margin: 0,
                    ...(style || {}),
                  }}
                >
                  {children}
                </h1>
              );
            },
            h2({ children, style }) {
              return (
                <h2
                  style={{
                    margin: 0,
                    ...(style || {}),
                  }}
                >
                  {children}
                </h2>
              );
            },
            h3({ children, style }) {
              return (
                <h3
                  style={{
                    margin: 0,
                    ...(style || {}),
                  }}
                >
                  {children}
                </h3>
              );
            },
            h4({ children, style }) {
              return (
                <h4
                  style={{
                    margin: 0,
                    ...(style || {}),
                  }}
                >
                  {children}
                </h4>
              );
            },
            h5({ children, style }) {
              return (
                <h5
                  style={{
                    margin: 0,
                    ...(style || {}),
                  }}
                >
                  {children}
                </h5>
              );
            },
            h6({ children, style }) {
              return (
                <h6
                  style={{
                    margin: 0,
                    ...(style || {}),
                  }}
                >
                  {children}
                </h6>
              );
            },
            script() {
              return null;
            },
            link() {
              return null;
            },
          }}
        >
          {body
            ?.replaceAll('\\\n', '&nbsp;')
            ?.replaceAll('\n', '  \n')
            ?.replaceAll('&nbsp;', '&nbsp;  \n')}
        </Markdown>
      )}
    </BodyText>
  );
}

export default function Notification({
  notificationData,
  handleActionClick,
  notificationComponent,
  hideAvatar,
  themeType,
  primaryActionClickHandler,
  secondaryActionClickHandler,
  theme,
  disableMarkdown,
}: NotificationCardProps) {
  const [validAvatar, setValidAvatar] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  const feedClient = useFeedClient();
  const feedData = useFeedData();

  const { message, read_on, created_on } = notificationData;

  const notificationsList = feedData?.notifications;
  const actionOne = message?.actions?.[0];
  const actionTwo = message?.actions?.[1];
  const hasButtons = actionOne || actionTwo;
  const lastNotification = notificationsList?.length
    ? notificationsList[notificationsList.length - 1]
    : null;
  const isLastNotification = lastNotification?.n_id === notificationData.n_id;

  useEffect(() => {
    const isValidAvatar = isImgUrl(message?.avatar?.avatar_url);
    isValidAvatar.then((res) => setValidAvatar(res));
  }, [notificationData]);

  const isPlatformMobile = useMemo(isMobile, []);

  if (notificationComponent) {
    const NotificationComponent = notificationComponent;
    return (
      <NotificationComponent
        notificationData={notificationData}
        markAsRead={(e?: Event) => {
          e?.stopPropagation?.();
          return feedClient?.markAsRead(notificationData.n_id);
        }}
        markAsUnread={(e?: Event) => {
          e?.stopPropagation?.();
          return feedClient?.markAsUnread(notificationData.n_id);
        }}
        markAsArchived={(e?: Event) => {
          e?.stopPropagation?.();
          return feedClient?.markAsArchived(notificationData.n_id);
        }}
        markAsInteracted={(e?: Event) => {
          e?.stopPropagation?.();
          return feedClient?.markAsInteracted(notificationData.n_id);
        }}
      />
    );
  }

  return (
    <Container
      style={theme?.container}
      read={!!read_on}
      onMouseEnter={() => {
        setShowMore(true);
        setMoreOpen(false);
      }}
      onMouseLeave={() => {
        setShowMore(false);
        setMoreOpen(false);
      }}
      onClick={(e) => {
        if (moreOpen) {
          e.stopPropagation();
          setMoreOpen(false);
        }
      }}
    >
      {notificationData.is_pinned && (
        <PinnedView hideAvatar={hideAvatar}>
          <PinnedNotificationIcon style={theme?.pinnedIcon} />
          <PinnedNotificationText style={theme?.pinnedText}>
            Pinned
          </PinnedNotificationText>
        </PinnedView>
      )}
      <NotificationView>
        <LeftView>
          <LeftAvatarView>
            <UnseenDot style={theme?.unseenDot} show={!read_on} />
            {!hideAvatar && (
              <AvatarView
                onClick={(e) => {
                  const avatarData = message?.avatar;
                  handleActionClick(e, {
                    type: 'avatar',
                    url: avatarData?.action_url,
                  });
                }}
              >
                {message?.avatar?.avatar_url && validAvatar ? (
                  <AvatarImage
                    src={message.avatar.avatar_url}
                    alt="avatar"
                    style={theme?.avatar}
                  />
                ) : (
                  <AvatarIcon type={themeType} />
                )}
              </AvatarView>
            )}
          </LeftAvatarView>
          <ContentView>
            {message.header && (
              <HeaderText style={theme?.headerText}>
                {message.header}
              </HeaderText>
            )}
            <BodyMarkdown
              body={message.text}
              handleActionClick={handleActionClick}
              style={theme?.bodyText}
              disableMarkdown={disableMarkdown}
            />
            {!!message?.subtext?.text && (
              <SubTextView
                link={message?.subtext?.action_url}
                onClick={(e) => {
                  const subTextData = message?.subtext;
                  handleActionClick(e, {
                    type: 'subtext',
                    url: subTextData?.action_url,
                  });
                }}
              >
                <SubText style={theme?.subtext}>{message.subtext.text}</SubText>
              </SubTextView>
            )}
            {notificationData.expiry && notificationData?.is_expiry_visible && (
              <ExpiryTime
                dateInput={notificationData.expiry}
                style={theme?.expiresText}
              />
            )}
            {hasButtons && (
              <ButtonContainer>
                {actionOne && (
                  <ButtonView
                    style={theme?.actions?.[0]?.container}
                    onClick={(e) => {
                      handleActionClick(e, {
                        type: 'primary_action_button',
                        url: actionOne.url,
                        target: actionOne.open_in_new_tab,
                        customClickHandler: primaryActionClickHandler,
                      });
                    }}
                  >
                    <ButtonText style={theme?.actions?.[0]?.text}>
                      {actionOne.name}
                    </ButtonText>
                  </ButtonView>
                )}
                {actionTwo && (
                  <ButtonOutlineView
                    style={theme?.actions?.[1]?.container}
                    onClick={(e) => {
                      handleActionClick(e, {
                        type: 'secondary_action_button',
                        url: actionTwo.url,
                        target: actionTwo.open_in_new_tab,
                        customClickHandler: secondaryActionClickHandler,
                      });
                    }}
                  >
                    <ButtonOutlineText style={theme?.actions?.[1]?.text}>
                      {actionTwo.name}
                    </ButtonOutlineText>
                  </ButtonOutlineView>
                )}
              </ButtonContainer>
            )}
          </ContentView>
        </LeftView>
        <RightView>
          <CreatedText style={theme?.createdOnText}>
            <TimeAgo
              date={created_on}
              live={false}
              formatter={getShortFormattedTime}
            />
          </CreatedText>
          <CMenuView showMore={showMore || isPlatformMobile}>
            <CMenuButton
              hoverBGColor={theme?.actionsMenuIcon?.hoverBackgroundColor}
              isPlatformMobile={isPlatformMobile}
              onClick={(e) => {
                e.stopPropagation();
                setMoreOpen((prev) => !prev);
              }}
            >
              <MoreIcon style={theme?.actionsMenuIcon} />
            </CMenuButton>
            <CMenuPopup
              moreOpen={moreOpen}
              style={theme?.actionsMenu}
              isLastNotification={isLastNotification}
            >
              {notificationData.read_on ? (
                <CMenuItem
                  style={theme?.actionsMenuItem}
                  onClick={async (e) => {
                    e.stopPropagation();
                    setMoreOpen(false);
                    return feedClient?.markAsUnread(notificationData.n_id);
                  }}
                >
                  <UnReadIcon style={theme?.actionsMenuItemIcon} />
                  <CMenuText style={theme?.actionsMenuItemText}>
                    Mark as unread
                  </CMenuText>
                </CMenuItem>
              ) : (
                <CMenuItem
                  style={theme?.actionsMenuItem}
                  onClick={(e) => {
                    e.stopPropagation();
                    setMoreOpen(false);
                    return feedClient?.markAsRead(notificationData.n_id);
                  }}
                >
                  <ReadIcon style={theme?.actionsMenuItemIcon} />
                  <CMenuText style={theme?.actionsMenuItemText}>
                    Mark as read
                  </CMenuText>
                </CMenuItem>
              )}
              {!notificationData?.archived && (
                <CMenuItem
                  style={theme?.actionsMenuItem}
                  onClick={(e) => {
                    e.stopPropagation();
                    return feedClient?.markAsArchived(notificationData.n_id);
                  }}
                >
                  <ArchiveIcon style={theme?.actionsMenuItemIcon} />
                  <CMenuText style={theme?.actionsMenuItemText}>
                    Archive
                  </CMenuText>
                </CMenuItem>
              )}
            </CMenuPopup>
          </CMenuView>
        </RightView>
      </NotificationView>
    </Container>
  );
}

const Container = styled.div<{
  read: boolean;
  style?: {
    readBackgroundColor?: string;
    unreadBackgroundColor?: string;
    hoverBackgroundColor?: string;
  };
}>`
  padding: 16px;
  cursor: pointer;
  background-color: ${(props) => {
    return props.read
      ? props?.style?.readBackgroundColor || lightColors.main
      : props?.style?.unreadBackgroundColor || '#edf3ff';
  }};
  border-bottom: 0.5px solid ${lightColors.border};
  &:hover {
    background-color: ${(props) =>
      props?.style?.hoverBackgroundColor || '#DBE7FF'}
`;

const PinnedView = styled.div<{ hideAvatar?: boolean }>`
  display: flex;
  align-items: center;
  margin-left: ${(props) => (props.hideAvatar ? '0px' : '52px')};
  gap: 4px;
`;

const PinnedNotificationText = styled(HelperText)``;

const SubText = styled(HelperText)`
  color: #64748b;
`;

const SubTextView = styled.div<{ link?: string }>`
  text-decoration: none;
  overflow-wrap: anywhere;
  display: inline-block;
  &:hover {
    text-decoration: ${(props) => (props.link ? 'underline' : 'none')};
    text-decoration-color: ${lightColors.secondaryText};
  }
`;

const ExpiresText = styled(HelperText)`
  margin-top: 8px;
  display: inline-block;
  padding: 1px 6px;
  border-radius: 4px;
`;

const NotificationView = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
`;

const HeaderText = styled(CText)`
  margin: 8px 0px 0px 0px;
  overflow-wrap: anywhere;
  line-height: 18px;
  font-weight: 700;
`;

const BodyText = styled.div`
  font-size: 14px;
  line-height: 20px;
  margin: 8px 0px 6px;
  font-weight: 400;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica,
    Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
  color: ${lightColors.secondaryText};
`;

const UnseenDot = styled.div<{ show: boolean }>`
  background-color: ${lightColors.primary};
  border-radius: 50%;
  width: 7px;
  height: 7px;
  visibility: ${(props) => (props.show ? 'visible' : 'hidden')};
`;

const CreatedText = styled(HelperText)``;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  margin-bottom: 6px;
  margin-top: 12px;
  overflow-wrap: anywhere;
`;

const ButtonView = styled.div<{ style?: { hoverBackgroundColor?: string } }>`
  max-width: 50%;
  background: ${lightColors.primary};
  border-radius: 5px;
  text-decoration: none;
  padding: 4px 16px;
  &:hover {
    background-color: ${(props) =>
      props.style?.hoverBackgroundColor || '#265cbf'} !important;
  }
`;

const ButtonText = styled(CText)`
  color: ${lightColors.main};
  text-align: center;
  word-break: break-all;
  font-weight: 600;
  font-size: 13px;
`;

const ButtonOutlineView = styled(ButtonView)`
  background: ${lightColors.main};
  border-color: ${lightColors.border};
  border-style: solid;
  border-width: 1.2px;
  &:hover {
    background-color: ${(props) =>
      props.style?.hoverBackgroundColor || '#f7f7f9'} !important;
  }
`;

const ButtonOutlineText = styled(ButtonText)`
  color: ${lightColors.secondaryText};
`;

const LeftView = styled.div`
  display: flex;
  overflow-wrap: anywhere;
  flex-grow: 1;
`;

const LeftAvatarView = styled.div`
  display: flex;
  margin-top: 8px;
  margin-right: 12px;
`;

const AvatarView = styled.div``;

const ContentView = styled.div`
  flex: 1;
`;

const RightView = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 5px;
  max-width: 40px;
  gap: 5px;
`;

const AvatarImage = styled.img`
  height: 36px;
  width: 36px;
  border-radius: 100px;
`;

const CMenuPopup = styled.div<{
  moreOpen: boolean;
  isLastNotification: boolean;
}>`
  position: absolute;
  right: ${(props) => (props.isLastNotification ? '25px' : '0px')};
  bottom: ${(props) => (props.isLastNotification ? '-12.5px' : 'auto')};
  display: ${(props) => (props.moreOpen ? 'block' : 'none')};
  min-width: 150px;
  padding: 2px;
  background-color: ${lightColors.main};
  border: 1px solid;
  border-color: ${lightColors.border};
  border-radius: 4px;
  box-shadow: 1px 1px 20px 1px rgba(0, 0, 0, 0.1);
  z-index: 100;
`;

const CMenuItem = styled.div<{ style?: { hoverBackgroundColor?: string } }>`
  padding: 7px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
  &:hover {
    background-color: ${(props) =>
      props?.style?.hoverBackgroundColor || 'rgba(100, 116, 139, 0.09)'};
  }
`;

const CMenuText = styled(CText)``;

const CMenuView = styled.div<{ showMore?: boolean }>`
  position: relative;
  visibility: ${(props) => (props?.showMore ? 'visible' : 'hidden')};
`;

const CMenuButton = styled.div<{
  hoverBGColor?: string;
  isPlatformMobile?: boolean;
}>`
  height: 20px;
  width: 20px;
  &:hover {
    border-radius: 50%;
    background-color: ${(props) =>
      props?.isPlatformMobile
        ? 'none'
        : props?.hoverBGColor || 'rgba(100, 116, 139, 0.09)'};
  }
`;

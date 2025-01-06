import styled from '@emotion/styled';
import { Dictionary } from '@suprsend/react-hooks';
import { AvatarIcon } from './Icons';
import { BodyMarkdown } from './NotificationCard';
import { CText, darkTheme, lightColors } from '../utils/styles';
import { mergeDeep } from '../utils';
import {
  ToastNotificationProps,
  ThemeType,
  INotificationCardTheme,
} from '../interface';

export default function ToastNotificationCard({
  notificationData,
  hideAvatar,
  themeType,
  theme,
}: ToastNotificationProps) {
  const message = notificationData.message;

  const modifiedTheme =
    themeType === ThemeType.DARK
      ? (mergeDeep(
          darkTheme.toast,
          theme as Dictionary
        ) as INotificationCardTheme)
      : theme || {};

  return (
    <Container style={modifiedTheme?.container}>
      <LeftAvatarView>
        {!hideAvatar && (
          <AvatarView>
            {message?.avatar?.avatar_url ? (
              <AvatarImage
                src={message.avatar.avatar_url}
                alt="avatar"
                style={modifiedTheme?.avatar}
              />
            ) : (
              <AvatarIcon type={themeType} />
            )}
          </AvatarView>
        )}
      </LeftAvatarView>
      <ContentView>
        {message.header && (
          <HeaderText style={modifiedTheme?.headerText}>
            {message.header}
          </HeaderText>
        )}
        <BodyMarkdown
          body={notificationData?.message?.text || ''}
          style={modifiedTheme?.bodyText}
        />
      </ContentView>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  overflow-wrap: anywhere;
  flex-grow: 1;
  background-color: ${lightColors.main};
`;

const LeftAvatarView = styled.div`
  display: flex;
  margin-top: 8px;
  margin-right: 12px;
`;

const AvatarView = styled.div``;

const AvatarImage = styled.img`
  height: 36px;
  width: 36px;
  border-radius: 100px;
`;

const ContentView = styled.div`
  flex: 1;
`;

const HeaderText = styled(CText)`
  margin: 8px 0px 0px 0px;
  overflow-wrap: anywhere;
  line-height: 18px;
  font-weight: 700;
`;

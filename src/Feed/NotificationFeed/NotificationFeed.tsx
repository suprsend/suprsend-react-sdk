import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import {
  useFeedClient,
  useFeedData,
  ApiResponseStatus,
} from '@suprsend/react-hooks';
import InfiniteScroll from 'react-infinite-scroll-component';
import NotificationFeedHeader from './NotificationFeedHeader';
import { CText, HeadingText, lightColors } from '../utils/styles';
import {
  INotificationsContainerTheme,
  NotificationFeedProps,
} from '../interface';
import { NotificationCard } from '../NotificationCard';

interface LoaderProps {
  style?: React.CSSProperties;
  size?: string;
}

function Loader({ style, size }: LoaderProps) {
  const color = style?.color as string;

  return (
    <SpinnerContainer>
      <Spinner style={style} color={color} size={size} />
    </SpinnerContainer>
  );
}

interface EmptyFeedProps {
  noNotificationsComponent?: React.FC;
  notificationsContainer?: INotificationsContainerTheme;
}

function EmptyFeed({
  noNotificationsComponent,
  notificationsContainer,
}: EmptyFeedProps) {
  if (noNotificationsComponent) {
    const NoNotificationsComponent = noNotificationsComponent;
    return <NoNotificationsComponent />;
  }

  return (
    <EmptyNotificationsContainer>
      <EmptyText style={notificationsContainer?.noNotificationsText}>
        No notifications yet
      </EmptyText>
      <EmptySubText style={notificationsContainer?.noNotificationsSubtext}>
        We'll let you know when we've got something new for you.
      </EmptySubText>
    </EmptyNotificationsContainer>
  );
}

export default function NotificationFeed(config: NotificationFeedProps) {
  const notificationsContainer = config.theme?.notificationsContainer;
  const feedData = useFeedData();
  const feedClient = useFeedClient();
  const pagination = config.pagination ?? true;

  if (!feedData) return null;

  const CustomLoader = config?.loaderComponent;
  return (
    <Container
      style={notificationsContainer?.container}
      id="ss-notification-container"
    >
      <NotificationFeedHeader
        style={{ header: config.theme?.header, tabs: config?.theme?.tabs }}
        headerRightComponent={config.headerRightComponent}
        showUnreadCountOnTabs={config.showUnreadCountOnTabs}
        tabBadgeComponent={config.tabBadgeComponent}
      />

      {feedData?.apiStatus === ApiResponseStatus.LOADING && (
        <InitialLoader>
          <Loader size="large" style={notificationsContainer?.loader} />
        </InitialLoader>
      )}

      {(feedData?.apiStatus === ApiResponseStatus.ERROR ||
        (feedData?.apiStatus === ApiResponseStatus.SUCCESS &&
          !feedData?.notifications.length)) && (
        <EmptyFeed
          noNotificationsComponent={config?.noNotificationsComponent}
          notificationsContainer={notificationsContainer}
        />
      )}

      {feedData?.notifications.length > 0 && (
        <ScrollDiv>
          <InfiniteScroll
            scrollableTarget="ss-notification-container"
            dataLength={feedData?.notifications.length}
            next={() => feedClient?.fetchNextPage()}
            hasMore={
              pagination &&
              feedData?.pageInfo.currentPage < feedData?.pageInfo.totalPages
            }
            loader={
              CustomLoader ? (
                <CustomLoader />
              ) : (
                <Loader style={notificationsContainer?.loader} />
              )
            }
          >
            {feedData.notifications.map((notification) => (
              <NotificationCard
                key={notification.n_id}
                notificationData={notification}
                notificationClickHandler={config.notificationClickHandler}
                primaryActionClickHandler={config.primaryActionClickHandler}
                secondaryActionClickHandler={config.secondaryActionClickHandler}
                theme={config.theme?.notification}
                hideAvatar={config.hideAvatar}
                notificationComponent={config.notificationComponent}
                themeType={config.themeType}
              />
            ))}
          </InfiniteScroll>
        </ScrollDiv>
      )}
    </Container>
  );
}

const Container = styled.div`
  height: 500px;
  width: 450px;
  margin: 0px 15px;
  border-radius: 5px;
  background-color: ${lightColors.main};
  border: 1px solid ${lightColors.border};
  display: inline-block;
  overflow: scroll;
  box-shadow: 0 0px 7px 0 rgba(0, 0, 0, 0.1);
  @media (max-width: 425px) {
    width: 99.5vw;
    margin: 0px;
    border-radius: 0px;
  }
`;

const EmptyNotificationsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin: 32px;
  margin-top: 40px;
`;

const EmptyText = styled(HeadingText)`
  font-weight: 600;
  text-align: center;
  background-color: transparent;
  margin: 20px 0px;
  margin-bottom: 16px;
  color: ${lightColors.primaryText};
`;

const EmptySubText = styled(CText)`
  color: ${lightColors.secondaryText};
  text-align: center;
`;

const ScrollDiv = styled.div``;

const spin = keyframes`
0% {
  transform: rotate(0deg);
}
100% {
  transform: rotate(360deg);
}
`;

const Spinner = styled.div<{ size?: string; color?: string }>`
  border: ${(props) =>
    props.size === 'large'
      ? `5px solid ${lightColors.border}`
      : `3px solid ${lightColors.border}`};
  border-top: ${(props) =>
    props.size === 'large' ? '5px solid' : '3px solid'};
  border-top-color: ${(props) =>
    props.color ? props.color : lightColors.primary};
  border-radius: 50%;
  width: ${(props) => (props.size === 'large' ? '20px' : '10px')};
  height: ${(props) => (props.size === 'large' ? '20px' : '10px')};
  animation: ${spin} 1s linear infinite;
  margin: 5px;
`;

const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const InitialLoader = styled.div`
  margin-top: 32px;
`;

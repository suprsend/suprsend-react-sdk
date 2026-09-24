import { Dispatch, SetStateAction } from 'react';
import styled from '@emotion/styled';
import {
  IStore,
  useFeedClient,
  useFeedData,
  ApiResponse,
  useTranslations,
  useFeed,
  ReachabilityStatus,
} from '@suprsend/react-core';
import {
  CText,
  HeadingText,
  lightColors,
  lightStatusColors,
} from '../utils/styles';
import { ConnectionBanner, ConnectionDot } from '../ConnectionStatus';
import { getConnectionMessageKey } from '../utils/connection';
import {
  TabsThemeProps,
  IHeaderTheme,
  IConnectionBannerTheme,
  IConnectionDotThemeProps,
} from '../interface';

interface InternalHeaderRightComponentProps {
  header?: IHeaderTheme;
  markAllRead: () => Promise<ApiResponse> | undefined;
  disabled?: boolean;
}

function InternalHeaderRightComponent({
  header,
  markAllRead,
  disabled,
}: InternalHeaderRightComponentProps) {
  const { t } = useTranslations();
  return (
    <AllReadButton
      style={{
        ...header?.markAllReadText,
        ...(disabled
          ? { color: lightStatusColors.neutral, cursor: 'default' }
          : null),
      }}
      className="ss-feed-mark-all-read-button"
      aria-disabled={disabled || undefined}
      onClick={(e) => {
        e.stopPropagation();
        if (disabled) return;
        markAllRead();
      }}
    >
      {t('markAllAsRead')}
    </AllReadButton>
  );
}

interface IHeaderProps {
  style?: {
    header?: {
      container?: React.CSSProperties;
      headerText?: React.CSSProperties;
      markAllReadText?: React.CSSProperties;
    };
    tabs?: TabsThemeProps;
    connectionDot?: IConnectionDotThemeProps;
    connectionBanner?: IConnectionBannerTheme;
  };
  tabBadgeComponent?: React.FC<{ count: number }>;
  showUnreadCountOnTabs?: boolean;
  headerRightComponent?: React.FC<{
    markAllRead: () => void;
    closeInboxPopover: () => void;
  }>;
  setPopoverOpen?: Dispatch<SetStateAction<boolean>>;
}

export default function Header({
  style,
  tabBadgeComponent,
  headerRightComponent,
  showUnreadCountOnTabs = true,
  setPopoverOpen,
}: IHeaderProps) {
  const feedClient = useFeedClient();
  const feedData = useFeedData();
  const feed = useFeed();
  const { t } = useTranslations();

  const stores = feedClient?.feedOptions.stores;
  const hasStores = !!(stores && stores.length > 0);
  const TabBadgeComponent = tabBadgeComponent;
  const HeaderRightComponent = headerRightComponent;
  const header = style?.header;
  const tabs = style?.tabs;

  const reachabilityStatus = feed?.reachability?.status;
  const hasBanner = !!getConnectionMessageKey(reachabilityStatus);
  const offline = reachabilityStatus === ReachabilityStatus.OFFLINE;

  return (
    <Container className="ss-feed-header" style={header?.container}>
      <TopContainer hasStores={hasStores} hasBanner={hasBanner}>
        <TitleContainer className="ss-feed-header-title-container">
          <HeaderText
            className="ss-feed-header-text"
            style={header?.headerText}
          >
            {t('notifications')}
          </HeaderText>
          <ConnectionDot
            status={reachabilityStatus}
            size={9}
            style={style?.connectionDot}
          />
        </TitleContainer>
        {HeaderRightComponent ? (
          <HeaderRightComponent
            markAllRead={() => feedClient?.markAllAsRead()}
            closeInboxPopover={() => {
              setPopoverOpen?.(false);
            }}
          />
        ) : (
          <InternalHeaderRightComponent
            header={header}
            markAllRead={() => feedClient?.markAllAsRead()}
            disabled={offline}
          />
        )}
      </TopContainer>
      {hasBanner && (
        <BannerContainer
          className="ss-feed-connection-banner-container"
          hasStores={hasStores}
        >
          <ConnectionBanner
            status={reachabilityStatus}
            style={style?.connectionBanner}
          />
        </BannerContainer>
      )}
      {hasStores && (
        <TabsContainer className="ss-feed-tabs-container">
          {stores.map((store: IStore, index: number) => {
            const isActiveTab = feedData?.store.storeId === store.storeId;
            const tabUnreadCount = feedData?.meta[store.storeId] || 0;
            const showBadge = showUnreadCountOnTabs && tabUnreadCount > 0;
            const selectedTabBottomColor = isActiveTab
              ? tabs?.bottomColor
              : 'none';
            const textColor = isActiveTab
              ? tabs?.color
              : tabs?.unselectedColor || tabs?.color;
            const label =
              feed?.stores?.find(
                (storeItem) => storeItem.storeId === store.storeId
              )?.label || store.label;

            return (
              <TabContainer
                className="ss-feed-tab"
                style={{ borderBottomColor: selectedTabBottomColor }}
                key={index}
                selected={isActiveTab}
                onClick={() => {
                  feedClient?.changeActiveStore(store.storeId);
                }}
              >
                <TabText
                  selected={isActiveTab}
                  style={{
                    ...tabs,
                    color: textColor,
                  }}
                  className="ss-feed-tab-text"
                >
                  {label}
                </TabText>
                {showBadge &&
                  (TabBadgeComponent ? (
                    <TabBadgeComponent count={tabUnreadCount} />
                  ) : (
                    <TabBadge
                      className="ss-feed-tab-badge"
                      style={{
                        backgroundColor: tabs?.badgeColor,
                        color: tabs?.badgeText,
                      }}
                    >
                      <TabBadgeText
                        className="ss-feed-tab-badge-text"
                        count={tabUnreadCount}
                      >
                        {tabUnreadCount}
                      </TabBadgeText>
                    </TabBadge>
                  ))}
              </TabContainer>
            );
          })}
        </TabsContainer>
      )}
    </Container>
  );
}

const Container = styled.div`
  position: sticky;
  top: 0;
  padding: 16px;
  padding-bottom: 0px;
  z-index: 1000;
  background-color: ${lightColors.main};
  box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.1);
`;

const TopContainer = styled.div<{ hasStores: boolean; hasBanner: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${(props) => {
    if (props.hasBanner) return '12px';
    return props.hasStores ? '16px' : '0px';
  }};
  padding-bottom: ${(props) =>
    props.hasStores || props.hasBanner ? '0px' : '16px'};
`;

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const BannerContainer = styled.div<{ hasStores: boolean }>`
  margin-left: -16px;
  margin-right: -16px;
  margin-bottom: ${(props) => (props.hasStores ? '12px' : '0px')};
`;

const TabsContainer = styled.div`
  display: flex;
  overflow-x: scroll;
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const TabContainer = styled.div<{ selected: boolean }>`
  padding: 5px 15px 3px 15px;
  border-bottom: ${(props) => {
    return props.selected ? `2px solid ${lightColors.primary}` : 'none';
  }};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const TabText = styled(CText)<{ selected: boolean }>`
  font-size: 14px;
  font-weight: 600;
  color: ${(props) => {
    return props.selected
      ? lightColors.primaryText
      : lightColors.secondaryText + 'D9';
  }};
`;

const HeaderText = styled(HeadingText)`
  font-weight: 600;
  font-size: 16px;
`;

const AllReadButton = styled(HeadingText)`
  color: ${lightColors.primary};
  font-size: 12px;
  cursor: pointer;
`;

const TabBadge = styled.div`
  height: 18px;
  width: 20px;
  border-radius: 50%;
  background-color: rgba(100, 116, 139, 0.09);
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${lightColors.primaryText};
`;

const TabBadgeText = styled.p<{ count: number }>`
  margin: 0px;
  padding: 0px;
  font-size: ${(props) => {
    return props?.count > 99 ? '8px' : '10px';
  }};
  font-weight: 600;
  line-height: 1;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica,
    Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
`;

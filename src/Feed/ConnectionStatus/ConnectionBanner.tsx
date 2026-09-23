import styled from '@emotion/styled';
import {
  IFeedReachability,
  ReachabilityStatus,
  useTranslations,
} from '@suprsend/react-core';
import {
  IconProps,
  IConnectionBannerTheme,
  IConnectionBannerToneTheme,
} from '../interface';
import { getConnectionMessageKey } from '../utils/connection';
import { CText, lightStatusColors } from '../utils/styles';

interface ConnectionBannerProps {
  status?: ReachabilityStatus;
  reachability?: IFeedReachability;
  style?: IConnectionBannerTheme;
}

const toneDefaults = {
  warning: {
    background: lightStatusColors.warningBackground,
    text: lightStatusColors.warningText,
    icon: lightStatusColors.warningIcon,
    iconPath:
      'M8 6v3M8 11.5h.01M7.1 2.6 1.6 12a1 1 0 0 0 .9 1.5h11a1 1 0 0 0 .9-1.5L8.9 2.6a1 1 0 0 0-1.8 0Z',
  },
  offline: {
    background: lightStatusColors.neutralBackground,
    text: lightStatusColors.neutralText,
    icon: lightStatusColors.neutralText,
    iconPath:
      'M2 2l12 12M6.4 3.5A6.5 6.5 0 0 1 14 8M4 5.6A6.5 6.5 0 0 0 2 8m2.6 2.1A3.5 3.5 0 0 1 8 9.2m2.6 1.9L8 13.8',
  },
};

function BannerIcon({ path, style }: IconProps & { path: string }) {
  const height = style?.height || 16;
  const width = style?.width || 16;
  const color = style?.color || lightStatusColors.warningIcon;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d={path}
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function reportIssue(reachability?: IFeedReachability) {
  console.log('[SuprSend] inbox connection issue reported', reachability);
}

export default function ConnectionBanner({
  status,
  reachability,
  style,
}: ConnectionBannerProps) {
  const { t } = useTranslations();
  const messageKey = getConnectionMessageKey(status);

  if (!messageKey) return null;

  const offline = status === ReachabilityStatus.OFFLINE;
  const defaults = offline ? toneDefaults.offline : toneDefaults.warning;
  const tone: IConnectionBannerToneTheme | undefined = offline
    ? style?.offline
    : style?.warning;

  const iconStyle = { color: defaults.icon, ...tone?.icon };
  const textColor = tone?.text?.color || defaults.text;

  return (
    <Container
      className="ss-feed-connection-banner"
      role="status"
      offline={offline}
      style={{
        backgroundColor: defaults.background,
        ...style?.container,
        ...tone?.container,
      }}
    >
      <IconContainer offline={offline}>
        <BannerIcon path={defaults.iconPath} style={iconStyle} />
      </IconContainer>
      <Content>
        <BannerText
          className="ss-feed-connection-banner-text"
          style={{ color: defaults.text, ...tone?.text }}
        >
          {t(messageKey)}
        </BannerText>
        {!offline && (
          <BannerAction
            className="ss-feed-connection-banner-action"
            style={{ color: textColor, ...tone?.actionText }}
            onClick={(e) => {
              e.stopPropagation();
              reportIssue(reachability);
            }}
          >
            {t('reportIssue')}
          </BannerAction>
        )}
      </Content>
    </Container>
  );
}

const Container = styled.div<{ offline: boolean }>`
  display: flex;
  align-items: ${(props) => (props.offline ? 'center' : 'flex-start')};
  gap: 8px;
  padding: 10px 16px;
`;

const IconContainer = styled.span<{ offline: boolean }>`
  display: flex;
  flex-shrink: 0;
  margin-top: ${(props) => (props.offline ? '0px' : '1px')};
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  flex-grow: 1;
`;

const BannerText = styled(CText)`
  font-size: 13px;
  line-height: 1.45;
`;

const BannerAction = styled(BannerText)`
  font-weight: 600;
  text-decoration: underline;
  cursor: pointer;
`;

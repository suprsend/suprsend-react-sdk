import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import {
  ReachabilityStatus,
  useFeedClient,
  useTranslations,
} from '@suprsend/react-core';
import {
  IconProps,
  IConnectionBannerTheme,
  IConnectionBannerVariantTheme,
} from '../interface';
import { getConnectionMessageKey } from '../utils/connection';
import { CText, lightStatusColors } from '../utils/styles';
import ConnectionSpinner from './ConnectionSpinner';

type ReportState = 'idle' | 'reporting' | 'reported' | 'limitExceeded';

const RATE_LIMIT_STATUS_CODE = 429;

interface ConnectionBannerProps {
  status?: ReachabilityStatus;
  style?: IConnectionBannerTheme;
}

interface VariantDefaults {
  background: string;
  text: string;
  icon: string;
  iconPath?: string;
}

type VariantKey = 'warning' | 'authError' | 'offline' | 'reconnecting';

const warningDefaults: VariantDefaults = {
  background: lightStatusColors.warningBackground,
  text: lightStatusColors.warningText,
  icon: lightStatusColors.warningIcon,
  iconPath:
    'M8 6v3M8 11.5h.01M7.1 2.6 1.6 12a1 1 0 0 0 .9 1.5h11a1 1 0 0 0 .9-1.5L8.9 2.6a1 1 0 0 0-1.8 0Z',
};

const variantDefaults: Record<VariantKey, VariantDefaults> = {
  warning: warningDefaults,
  authError: warningDefaults,
  offline: {
    background: lightStatusColors.neutralBackground,
    text: lightStatusColors.neutralText,
    icon: lightStatusColors.neutralText,
    iconPath:
      'M2 2l12 12M6.4 3.5A6.5 6.5 0 0 1 14 8M4 5.6A6.5 6.5 0 0 0 2 8m2.6 2.1A3.5 3.5 0 0 1 8 9.2m2.6 1.9L8 13.8',
  },
  reconnecting: {
    background: lightStatusColors.neutralBackground,
    text: lightStatusColors.neutralText,
    icon: lightStatusColors.neutralText,
  },
};

const reportIconPaths = {
  reported: 'M3 8.5 6.5 12 13 4.5',
  limitExceeded:
    'M8 4.5V8l2.25 1.5M14.5 8a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z',
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

export default function ConnectionBanner({
  status,
  style,
}: ConnectionBannerProps) {
  const { t } = useTranslations();
  const feedClient = useFeedClient();
  const messageKey = getConnectionMessageKey(status);
  const [reportState, setReportState] = useState<ReportState>('idle');

  // allow reporting again once the current connection issue clears
  useEffect(() => {
    if (!messageKey) setReportState('idle');
  }, [messageKey]);

  const handleReportIssue = async () => {
    if (!feedClient || reportState !== 'idle') return;

    setReportState('reporting');
    try {
      const response = await feedClient.reportIssue();
      setReportState(
        response?.statusCode === RATE_LIMIT_STATUS_CODE
          ? 'limitExceeded'
          : 'reported'
      );
    } catch {
      setReportState('idle');
    }
  };

  if (!messageKey) return null;

  const variantKey: VariantKey =
    status === ReachabilityStatus.OFFLINE
      ? 'offline'
      : status === ReachabilityStatus.RECONNECTING
        ? 'reconnecting'
        : status === ReachabilityStatus.AUTH_ERROR
          ? 'authError'
          : 'warning';
  const reconnecting = variantKey === 'reconnecting';
  // refreshing or reporting can't fix offline, reconnecting or a bad token
  const showActions = variantKey === 'warning';
  // offline and reconnecting show a single line
  const compact = variantKey === 'offline' || reconnecting;
  const defaults = variantDefaults[variantKey];
  const variant: IConnectionBannerVariantTheme | undefined =
    style?.[variantKey];

  const iconStyle = { color: defaults.icon, ...variant?.icon };
  const textColor = variant?.text?.color || defaults.text;

  return (
    <Container
      className="ss-feed-connection-banner"
      role="status"
      compact={compact}
      style={{
        backgroundColor: defaults.background,
        ...style?.container,
        ...variant?.container,
      }}
    >
      <IconContainer compact={compact}>
        {reconnecting || !defaults.iconPath ? (
          <ConnectionSpinner
            size={iconStyle.width || 16}
            color={iconStyle.color}
            trackColor={variant?.spinnerTrackColor}
          />
        ) : (
          <BannerIcon path={defaults.iconPath} style={iconStyle} />
        )}
      </IconContainer>
      <Content>
        <BannerText
          className="ss-feed-connection-banner-text"
          style={{ color: defaults.text, ...variant?.text }}
        >
          {t(messageKey)}
        </BannerText>
        {showActions && (
          <Actions className="ss-feed-connection-banner-actions">
            <BannerAction
              className="ss-feed-connection-banner-refresh-action"
              style={{ color: textColor, ...variant?.actionText }}
              onClick={(e) => {
                e.stopPropagation();
                window.location.reload();
              }}
            >
              {t('refreshPage')}
            </BannerAction>
            <BannerText
              aria-hidden="true"
              style={{ color: textColor, ...variant?.actionText }}
            >
              •
            </BannerText>
            {reportState === 'reported' || reportState === 'limitExceeded' ? (
              <ReportResult
                className="ss-feed-connection-banner-report-result"
                style={{ color: textColor, ...variant?.actionText }}
              >
                <BannerIcon
                  path={reportIconPaths[reportState]}
                  style={{ color: textColor, height: 14, width: 14 }}
                />
                {t(
                  reportState === 'reported'
                    ? 'issueReported'
                    : 'reportLimitExceeded'
                )}
              </ReportResult>
            ) : (
              <BannerAction
                className="ss-feed-connection-banner-action"
                style={{ color: textColor, ...variant?.actionText }}
                busy={reportState === 'reporting'}
                onClick={(e) => {
                  e.stopPropagation();
                  handleReportIssue();
                }}
              >
                {t('reportIssue')}
              </BannerAction>
            )}
          </Actions>
        )}
      </Content>
    </Container>
  );
}

const Container = styled.div<{ compact: boolean }>`
  display: flex;
  align-items: ${(props) => (props.compact ? 'center' : 'flex-start')};
  gap: 8px;
  padding: 10px 16px;
`;

const IconContainer = styled.span<{ compact: boolean }>`
  display: flex;
  flex-shrink: 0;
  margin-top: ${(props) => (props.compact ? '0px' : '1px')};
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

const Actions = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
`;

const BannerAction = styled(BannerText)<{ busy?: boolean }>`
  font-weight: 600;
  text-decoration: underline;
  cursor: ${(props) => (props.busy ? 'default' : 'pointer')};
  opacity: ${(props) => (props.busy ? 0.6 : 1)};
`;

const ReportResult = styled(BannerText)`
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
`;

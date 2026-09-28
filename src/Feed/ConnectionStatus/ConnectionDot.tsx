import styled from '@emotion/styled';
import { ReachabilityStatus } from '@suprsend/react-core';
import { IConnectionDotThemeProps } from '../interface';
import { lightColors, lightStatusColors } from '../utils/styles';
import ConnectionSpinner from './ConnectionSpinner';

interface ConnectionDotProps {
  status?: ReachabilityStatus;
  size?: number;
  ring?: boolean;
  label?: string;
  style?: IConnectionDotThemeProps;
}

export default function ConnectionDot({
  status,
  size = 10,
  ring = false,
  label,
  style,
}: ConnectionDotProps) {
  const surfaceColor = style?.ringColor || lightColors.main;

  if (status === ReachabilityStatus.CONNECTING) {
    return (
      <ConnectionSpinner
        size={size}
        color={style?.connectingColor}
        trackColor={style?.connectingTrackColor}
        label={label}
        style={{
          backgroundColor: ring ? surfaceColor : undefined,
          boxShadow: ring ? `0 0 0 2px ${surfaceColor}` : undefined,
        }}
      />
    );
  }

  let color: string;
  switch (status) {
    case ReachabilityStatus.ONLINE:
      color = style?.connectedColor || lightStatusColors.ok;
      break;
    case ReachabilityStatus.DEGRADED:
    case ReachabilityStatus.AUTH_ERROR:
      color = style?.warningColor || lightStatusColors.warning;
      break;
    case ReachabilityStatus.OFFLINE:
      color = style?.offlineColor || lightStatusColors.neutral;
      break;
    default:
      return null;
  }

  const hollow = status === ReachabilityStatus.OFFLINE;

  return (
    <Dot
      className="ss-feed-connection-dot"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : 'true'}
      style={{
        height: size,
        width: size,
        backgroundColor: hollow ? surfaceColor : color,
        borderColor: color,
        boxShadow: ring ? `0 0 0 2px ${surfaceColor}` : undefined,
      }}
    />
  );
}

const Dot = styled.span`
  display: inline-block;
  box-sizing: border-box;
  border-radius: 50%;
  border-style: solid;
  border-width: 1.5px;
  flex-shrink: 0;
`;

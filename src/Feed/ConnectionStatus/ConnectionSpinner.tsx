import styled from '@emotion/styled';
import { lightStatusColors, spin } from '../utils/styles';

interface ConnectionSpinnerProps {
  size?: number | string;
  color?: string;
  trackColor?: string;
  label?: string;
  style?: React.CSSProperties;
}

export default function ConnectionSpinner({
  size = 16,
  color = lightStatusColors.neutralText,
  trackColor = lightStatusColors.neutralTrack,
  label,
  style,
}: ConnectionSpinnerProps) {
  return (
    <Spinner
      className="ss-feed-connection-spinner"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : 'true'}
      style={{
        height: size,
        width: size,
        borderWidth: typeof size === 'number' && size < 12 ? 1.5 : 2,
        borderColor: trackColor,
        borderTopColor: color,
        ...style,
      }}
    />
  );
}

const Spinner = styled.span`
  display: inline-block;
  box-sizing: border-box;
  border-radius: 50%;
  border-style: solid;
  flex-shrink: 0;
  animation: ${spin} 0.9s linear infinite;
`;

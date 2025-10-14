import styled from '@emotion/styled';
import { lightColors, CText } from '../../utils/styles';
import { BadgeProps } from '../../interface';

export default function Badge({ count, badgeComponent, style }: BadgeProps) {
  if (count <= 0) return null;

  if (badgeComponent) {
    const BagdeComponent = badgeComponent;
    return <BagdeComponent count={count} />;
  }
  return (
    <CountText className="ss-badge-text" style={style}>
      {count}
    </CountText>
  );
}

const CountText = styled(CText)`
  position: absolute;
  right: -3px;
  top: -7px;
  display: inline-block;
  font-size: 10px;
  line-height: 1;
  padding: 3px 6px;
  border-radius: 50%;
  background-color: ${lightColors.primary};
  color: ${lightColors.main};
  text-align: center;
`;

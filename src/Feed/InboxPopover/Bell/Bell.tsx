import BellIcon from './BellIcon';
import { IconThemeProps } from '../../interface';

interface BellProps {
  bellComponent?: React.FC;
  style?: IconThemeProps;
}

export default function Bell({ bellComponent, style }: BellProps) {
  if (bellComponent) {
    const BellComponent = bellComponent;
    return <BellComponent />;
  }

  return <BellIcon style={style} />;
}

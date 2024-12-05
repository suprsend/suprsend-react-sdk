import BellIcon from './BellIcon';
import { BellProps } from '../../interface';

export default function Bell({ bellComponent, style }: BellProps) {
  if (bellComponent) {
    const BellComponent = bellComponent;
    return <BellComponent />;
  }

  return <BellIcon style={style} />;
}

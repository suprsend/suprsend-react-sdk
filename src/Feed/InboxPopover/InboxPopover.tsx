import { useRef, useState } from 'react';
import { usePopper } from 'react-popper';
import styled from '@emotion/styled';
import { useFeedClient, useFeedData } from '@suprsend/react-hooks';
import { Bell } from './Bell';
import { Badge } from './Badge';
import { NotificationFeed } from '../NotificationFeed';
import useClickOutside from '../utils/useClickOutside';
import { InboxPopoverProps } from '../interface';

export default function InboxPopover({
  bellComponent,
  badgeComponent,
  popperPosition = 'bottom',
  theme,
  ...feedConfig
}: InboxPopoverProps) {
  const referenceElement = useRef<HTMLDivElement>(null);
  const popperElement = useRef<HTMLDivElement>(null);
  const feedClient = useFeedClient();
  const notificationData = useFeedData();
  const [popoverOpened, setPopoverOpen] = useState<boolean>(false);

  useClickOutside(popperElement, () => {
    setPopoverOpen((prev) => !prev);
  });

  const { styles, attributes } = usePopper(
    referenceElement.current,
    popperElement.current,
    {
      placement: popperPosition,
      modifiers: [
        {
          name: 'offset',
          options: {
            offset: [0, 5],
          },
        },
      ],
    }
  );

  const handleBellClick = () => {
    setPopoverOpen((prev) => !prev);
    feedClient?.resetBadgeCount();
  };

  return (
    <Container>
      <BellContainer onClick={handleBellClick} ref={referenceElement}>
        <Badge
          count={notificationData?.meta?.badge || 0}
          badgeComponent={badgeComponent}
          style={theme?.badge}
        />
        <Bell bellComponent={bellComponent} style={theme?.bell} />
      </BellContainer>

      {popoverOpened && (
        <div
          ref={popperElement}
          style={{ ...styles.popper, zIndex: 999 }}
          {...attributes.popper}
        >
          <NotificationFeed {...feedConfig} />
        </div>
      )}
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  display: inline-block;
  background-color: transparent;
  line-height: 1;
`;

const BellContainer = styled.div`
  position: relative;
  margin-top: 12px;
  margin-right: 12px;
  cursor: pointer;
`;

import { LegacyRef, useState } from 'react';
import { usePopper } from 'react-popper';
import styled from '@emotion/styled';
import { Dictionary, useFeedClient, useFeedData } from '@suprsend/react-core';
import { Bell } from './Bell';
import { Badge } from './Badge';
import { NotificationFeed } from '../NotificationFeed';
import useClickOutside from '../utils/useClickOutside';
import { InboxPopoverProps, ITheme, ThemeType } from '../interface';
import { mergeDeep } from '../utils';
import { darkTheme } from '../utils/styles';

export default function InboxPopover({
  bellComponent,
  badgeComponent,
  popperPosition = 'bottom',
  theme,
  ...feedConfig
}: InboxPopoverProps) {
  const [referenceElement, setReferenceElement] = useState<HTMLElement | null>(
    null
  );
  const [popperElement, setPopperElement] = useState<HTMLElement | null>(null);

  const feedClient = useFeedClient();
  const notificationData = useFeedData();
  const [popoverOpened, setPopoverOpen] = useState<boolean>(false);

  useClickOutside({ current: popperElement }, () => {
    setPopoverOpen((prev) => !prev);
  });

  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: popperPosition,
    modifiers: [
      {
        name: 'offset',
        options: {
          offset: [0, 5],
        },
      },
    ],
  });

  const handleBellClick = () => {
    setPopoverOpen((prev) => !prev);
    feedClient?.resetBadgeCount();
  };

  const modifiedTheme =
    feedConfig?.themeType === ThemeType.DARK
      ? (mergeDeep(darkTheme, theme as Dictionary) as ITheme)
      : theme || {};

  return (
    <Container className="ss-feed-container">
      <BellContainer
        onClick={handleBellClick}
        ref={setReferenceElement}
        className="ss-feed-bell-container"
      >
        <Badge
          count={notificationData?.meta?.badge || 0}
          badgeComponent={badgeComponent}
          style={modifiedTheme?.badge}
        />
        <Bell bellComponent={bellComponent} style={modifiedTheme?.bell} />
      </BellContainer>

      {popoverOpened && (
        <div
          ref={setPopperElement as LegacyRef<HTMLDivElement> | undefined}
          style={{ ...styles.popper, zIndex: 999 }}
          {...attributes.popper}
        >
          <NotificationFeed
            {...feedConfig}
            theme={modifiedTheme}
            popover
            setPopoverOpen={setPopoverOpen}
          />
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

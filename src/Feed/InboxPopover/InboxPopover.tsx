import { LegacyRef, useState } from 'react';
import { usePopper } from 'react-popper';
import styled from '@emotion/styled';
import {
  Dictionary,
  useFeed,
  useFeedClient,
  useFeedData,
  useTranslations,
} from '@suprsend/react-core';
import { Bell } from './Bell';
import { Badge } from './Badge';
import { ConnectionDot } from '../ConnectionStatus';
import { NotificationFeed } from '../NotificationFeed';
import useClickOutside from '../utils/useClickOutside';
import { InboxPopoverProps, ITheme, ThemeType } from '../interface';
import { mergeDeep } from '../utils';
import { getConnectionMessageKey } from '../utils/connection';
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
  const { reachability } = useFeed();
  const { t } = useTranslations();
  const [popoverOpened, setPopoverOpen] = useState<boolean>(false);
  const reachabilityStatus = reachability?.status;
  const connectionMessageKey = getConnectionMessageKey(reachabilityStatus);

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
        hasDot={!!reachabilityStatus}
      >
        <Badge
          count={notificationData?.meta?.badge || 0}
          badgeComponent={badgeComponent}
          style={modifiedTheme?.badge}
        />
        <Bell bellComponent={bellComponent} style={modifiedTheme?.bell} />
        <BellDotContainer className="ss-feed-bell-dot-container">
          <ConnectionDot
            status={reachabilityStatus}
            ring
            label={connectionMessageKey ? t(connectionMessageKey) : undefined}
            style={modifiedTheme?.connectionDot}
          />
        </BellDotContainer>
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

const BellContainer = styled.div<{ hasDot: boolean }>`
  position: relative;
  margin-top: 12px;
  margin-right: 12px;
  cursor: pointer;
  display: ${(props) => (props.hasDot ? 'flex' : 'block')};
`;

const BellDotContainer = styled.span`
  position: absolute;
  right: -2px;
  bottom: -2px;
  display: flex;
  line-height: 0;
`;

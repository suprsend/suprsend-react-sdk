import { SuprSendFeedProvider } from '@suprsend/react-core';
import InboxPopover from './InboxPopover';
import { InboxProps } from '../interface';

export default function Inbox(config: InboxProps) {
  const {
    tenantId,
    pageSize = 20,
    stores,
    host,
    reachability = true,
    children,
  } = config;

  const providerConfig = {
    tenantId,
    pageSize,
    stores,
    host,
    reachability,
  };

  return (
    <SuprSendFeedProvider {...providerConfig}>
      <div>
        <InboxPopover {...config} />
        {children}
      </div>
    </SuprSendFeedProvider>
  );
}

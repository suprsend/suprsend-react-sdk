import { SuprSendFeedProvider } from '@suprsend/react-hooks';
import InboxPopover from './InboxPopover';
import { InboxProps } from '../interface';

function Inbox(config: InboxProps) {
  const {
    tenantId = 'default',
    pageSize = 20,
    stores,
    host,
    children,
  } = config;

  const providerConfig = {
    tenantId,
    pageSize,
    stores,
    host,
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

export default Inbox;

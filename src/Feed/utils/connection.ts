import { ITranslations, ReachabilityStatus } from '@suprsend/react-core';

const CONNECTION_MESSAGE_KEYS: Partial<
  Record<ReachabilityStatus, keyof ITranslations>
> = {
  [ReachabilityStatus.DEGRADED]: 'connectionIssue',
  [ReachabilityStatus.OFFLINE]: 'offlineMessage',
};

export function getConnectionMessageKey(status?: ReachabilityStatus) {
  return status ? CONNECTION_MESSAGE_KEYS[status] : undefined;
}

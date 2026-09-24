import { ITranslations, ReachabilityStatus } from '@suprsend/react-core';

const CONNECTION_MESSAGE_KEYS: Partial<
  Record<ReachabilityStatus, keyof ITranslations>
> = {
  [ReachabilityStatus.RECONNECTING]: 'connecting',
  [ReachabilityStatus.DEGRADED]: 'connectionIssue',
  [ReachabilityStatus.AUTH_ERROR]: 'authError',
  [ReachabilityStatus.OFFLINE]: 'offlineMessage',
};

export function getConnectionMessageKey(status?: ReachabilityStatus) {
  return status ? CONNECTION_MESSAGE_KEYS[status] : undefined;
}

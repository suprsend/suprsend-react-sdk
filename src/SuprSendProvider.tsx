import {
  SuprSendProvider as CoreSuprSendProvider,
  SuprSendProviderProps,
} from '@suprsend/react-core';
import { name as SDK_NAME, version as SDK_VERSION } from '../package.json';

export default function SuprSendProvider({
  clientUserAgent,
  ...rest
}: SuprSendProviderProps) {
  return (
    <CoreSuprSendProvider
      {...rest}
      clientUserAgent={{
        sdk: SDK_NAME,
        sdk_version: SDK_VERSION,
        ...clientUserAgent,
      }}
    />
  );
}

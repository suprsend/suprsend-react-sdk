# Changelog

All notable changes to `@suprsend/react` will be documented in this file.

## [1.2.0] - 2026-09-03

### Added

- `SuprSendProvider` now accepts a `pushTokenActionOnTenantChange` prop (`'none' | 'copy' | 'move'`, defaults to `'none'`). It controls what happens to the existing webpush subscription when the `tenantId` prop changes: `copy` attaches it to the new tenant as well, `move` detaches it from the current tenant and attaches it to the new tenant. If the device has no push subscription, the tenant switch still succeeds. See [WebPush](docs/webpush.md#push-subscription-on-tenant-change) for details.
- `SuprSendProvider` now accepts a `tenantChangeHandler` callback, invoked with the `changeTenant` response whenever a `tenantId` prop change switches the active tenant of the identified user. Use it to detect a failed switch, in which case the previous tenant stays active.

### Changed

- Upgraded `@suprsend/react-core` dependency to `^2.2.0`, which in turn upgrades `@suprsend/web-sdk` to `^5.2.0`. See the [react-core 2.2.0 changelog](https://github.com/suprsend/suprsend-react-core/blob/main/CHANGELOG.md#220) and [web-sdk 5.2.0 changelog](https://github.com/suprsend/suprsend-web-sdk/blob/main/CHANGELOG.md#520) for details.

### Notes

- No changes are needed if you don't use webpush with multiple tenants.

## [1.1.0] - 2026-08-20

### Changed

- Upgraded `@suprsend/react-core` dependency to `^2.1.0`, which in turn upgrades `@suprsend/web-sdk` to `^5.1.0`. The changes in this release come from the web-sdk, see the [web-sdk 5.1.0 changelog](https://github.com/suprsend/suprsend-web-sdk/blob/main/CHANGELOG.md#510) for details.

### Notes

- No integration changes are needed.

## [1.0.0] - 2026-08-07

### Added

- Tenant scoping support for multi-tenant workspaces. No changes are needed if your workspace doesn't use multiple tenants.
- `SuprSendProvider` now accepts a `tenantId` prop that scopes the identified user's events, preferences and feed to that tenant. The `tenantId` must match `scope.tenant_id` in the `userToken` payload, else authentication raises a scoping error. Changing the `tenantId` prop switches the active tenant of the identified user.

### Changed

- Upgraded `@suprsend/react-core` to `^2.0.0`, adding the tenant scoping support. See its [changelog](https://github.com/suprsend/suprsend-react-core/blob/main/CHANGELOG.md) for details.
- `Inbox` no longer defaults its `tenantId` prop to `default`. When `tenantId` is not passed, the inbox feed now follows the active tenant set on `SuprSendProvider` (falling back to the `default` tenant) and re-initializes automatically whenever the active tenant changes. Passing `tenantId` to `Inbox` pins the feed to that tenant — it takes priority over the active tenant and the feed ignores later tenant changes on the provider.

### Notes

- Previously fetched preferences keep the tenant they were fetched with. Call `getPreferences` again after a tenant change to load the new tenant's data.

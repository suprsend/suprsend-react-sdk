# Changelog

All notable changes to `@suprsend/react` will be documented in this file.

## [1.0.0] - 2026-08-07

### Added

- Tenant scoping support for multi-tenant workspaces. No changes are needed if your workspace doesn't use multiple tenants.
- `SuprSendProvider` now accepts a `tenantId` prop that scopes the identified user's events, preferences and feed to that tenant. The `tenantId` must match `scope.tenant_id` in the `userToken` payload, else authentication raises a scoping error. Changing the `tenantId` prop switches the active tenant of the identified user.

### Changed

- Upgraded `@suprsend/react-core` to `^2.0.0`, adding the tenant scoping support. See its [changelog](https://github.com/suprsend/suprsend-react-core/blob/main/CHANGELOG.md) for details.
- `Inbox` no longer defaults its `tenantId` prop to `default`. When `tenantId` is not passed, the inbox feed now follows the active tenant set on `SuprSendProvider` (falling back to the `default` tenant) and re-initializes automatically whenever the active tenant changes. Passing `tenantId` to `Inbox` pins the feed to that tenant — it takes priority over the active tenant and the feed ignores later tenant changes on the provider.

### Notes

- Previously fetched preferences keep the tenant they were fetched with. Call `getPreferences` again after a tenant change to load the new tenant's data.

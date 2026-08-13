# Changelog

All notable changes to this project will be documented in this file. See [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) for commit guidelines.

## [1.3.0](https://github.com/agustinusnathaniel/savorsanctum/compare/v1.2.3...v1.3.0) (2026-08-13)

### Features

* add JSON-LD ItemList structured data and centralize site metadata ([#37](https://github.com/agustinusnathaniel/savorsanctum/issues/37)) ([5ef92b9](https://github.com/agustinusnathaniel/savorsanctum/commit/5ef92b9ccc4ae8aeb69c20c6da29bb410813ad46))
* add per-item share links with highlight deep-linking ([#39](https://github.com/agustinusnathaniel/savorsanctum/issues/39)) ([3a806d5](https://github.com/agustinusnathaniel/savorsanctum/commit/3a806d524b52f1a464cb3143e691a7ff465f4bae))
* add saved items bookmarking with localStorage persistence ([#41](https://github.com/agustinusnathaniel/savorsanctum/issues/41)) ([a12551c](https://github.com/agustinusnathaniel/savorsanctum/commit/a12551cc32be54ed0bb34fa20b3bf0658770291d))

### Bug Fixes

* gate card actions behind pointer-fine to stop invisible tap interception ([#43](https://github.com/agustinusnathaniel/savorsanctum/issues/43)) ([2724591](https://github.com/agustinusnathaniel/savorsanctum/commit/2724591bafe5c9da6a40dd3e538af0feae168637))
* handle background cache refresh rejection to prevent unhandled promise rejection ([#28](https://github.com/agustinusnathaniel/savorsanctum/issues/28)) ([5c7b8f7](https://github.com/agustinusnathaniel/savorsanctum/commit/5c7b8f795e11d58eedb8a822b9f2edec0fba1745))
* handle linkless item cards and remove fake image srcset ([#29](https://github.com/agustinusnathaniel/savorsanctum/issues/29)) ([3361188](https://github.com/agustinusnathaniel/savorsanctum/commit/3361188987e0f1827e1b1ccad157fb0b4ca5e1f9))
* make useSavedItems hydration-safe with useSyncExternalStore ([#44](https://github.com/agustinusnathaniel/savorsanctum/issues/44)) ([9b094b9](https://github.com/agustinusnathaniel/savorsanctum/commit/9b094b9974e7f732cd7cd6ade68b9dbca38bfe42))
* pin patched js-yaml and nanoid chains ([#38](https://github.com/agustinusnathaniel/savorsanctum/issues/38)) ([e1102c1](https://github.com/agustinusnathaniel/savorsanctum/commit/e1102c13efd3d2b819a4f4bcdc3f53d9a91a528c))
* pin patched seroval chain and bump react-devtools ([#30](https://github.com/agustinusnathaniel/savorsanctum/issues/30)) ([46dc240](https://github.com/agustinusnathaniel/savorsanctum/commit/46dc240bfe9b2dce978c0bba3982f2c36f51d098))
* pin patched undici, fast-uri, and postcss chains ([#34](https://github.com/agustinusnathaniel/savorsanctum/issues/34)) ([e34fdb5](https://github.com/agustinusnathaniel/savorsanctum/commit/e34fdb5bb5207f24cd3590b9bb54b69e185117ef))
* serve stale data to concurrent requests during failed cache refresh ([#32](https://github.com/agustinusnathaniel/savorsanctum/issues/32)) ([7830bc8](https://github.com/agustinusnathaniel/savorsanctum/commit/7830bc8e272ff77830427bd8edbbf6080cff91e7))
* strip saved filter from per-item share links ([#42](https://github.com/agustinusnathaniel/savorsanctum/issues/42)) ([151d8f8](https://github.com/agustinusnathaniel/savorsanctum/commit/151d8f82251157f5d0116ef5f81a2d2e715d822f))
* surface Notion load error instead of misleading empty state ([#33](https://github.com/agustinusnathaniel/savorsanctum/issues/33)) ([7d0711c](https://github.com/agustinusnathaniel/savorsanctum/commit/7d0711c2b94b402cb100e8dfe0459f057cf3488e))
* update PWA manifest branding while keeping PWA disabled ([#26](https://github.com/agustinusnathaniel/savorsanctum/issues/26)) ([da69ede](https://github.com/agustinusnathaniel/savorsanctum/commit/da69ede8915353b84de194a9175be1efac3e2451))
## [1.2.3](https://github.com/agustinusnathaniel/savorsanctum/compare/v1.2.2...v1.2.3) (2026-06-19)

## [1.2.2](https://github.com/agustinusnathaniel/savorsanctum/compare/v1.2.1...v1.2.2) (2026-06-11)


### Bug Fixes

* serve fresh data on home page reload and navigation ([ec78b89](https://github.com/agustinusnathaniel/savorsanctum/commit/ec78b893e57ae63b7d0b6e99364d759265e8a32a))

## [1.2.1](https://github.com/agustinusnathaniel/foodies-db/compare/v1.2.0...v1.2.1) (2026-06-10)


### Features

* add umami analytics tracking for user interactions and performance ([794f152](https://github.com/agustinusnathaniel/foodies-db/commit/794f152aed9c7f30f26f611b0d7f71bb44fa0656))
* add user-facing changelog page ([02fcf52](https://github.com/agustinusnathaniel/foodies-db/commit/02fcf529d8f7a59ef49b9a2b04f3e5290216ad97))


### Bug Fixes

* harden CSP and add platform-level security headers ([3871caf](https://github.com/agustinusnathaniel/foodies-db/commit/3871caffff93e03d37524a88583fc0e55af44dc5))
* improve accessibility and theming consistency ([a2ffd43](https://github.com/agustinusnathaniel/foodies-db/commit/a2ffd43e6498538e23da2bf44c67c943e9348e9c))
* polish UI details ([7b20aad](https://github.com/agustinusnathaniel/foodies-db/commit/7b20aad070220a61ebe2f381d095653de8859d5e))
* replace bounce animations with ease-out-quart and add reduced-motion ([8aaeddf](https://github.com/agustinusnathaniel/foodies-db/commit/8aaeddf297851242ddb14ea6cd2a2286d0951fce))
* simplify security headers to match pahamidulu.id pattern ([551a635](https://github.com/agustinusnathaniel/foodies-db/commit/551a63523953d0502e7dd89e683506c94f4ac9d9))
* use Nitro routeRules for Vercel security headers ([b3e6f7e](https://github.com/agustinusnathaniel/foodies-db/commit/b3e6f7e868831532383d9e4b4458125272320c8b)), closes [TanStack/router#4021](https://github.com/TanStack/router/issues/4021) [vercel/vercel#6123](https://github.com/vercel/vercel/issues/6123)

## [1.2.0](https://github.com/agustinusnathaniel/foodies-db/compare/v1.1.0...v1.2.0) (2026-05-28)


### Features

* add share button to copy current view link ([3a4531b](https://github.com/agustinusnathaniel/foodies-db/commit/3a4531b994887b9307409fdf51579bb650881279))
* add surprise me button for random item discovery ([39abb1b](https://github.com/agustinusnathaniel/foodies-db/commit/39abb1beac0082bb8046f2173df46d2053c15bfb))
* add tag and location filters with URL params ([f0bf4af](https://github.com/agustinusnathaniel/foodies-db/commit/f0bf4af2aafbc05ac3a87ad06b29ac781937fc01))
* attach umami analytics ([076d035](https://github.com/agustinusnathaniel/foodies-db/commit/076d035b994919bcf4f83f418fdfe6422c7bf8d6))
* show item count in header subtitle ([99cf6a7](https://github.com/agustinusnathaniel/foodies-db/commit/99cf6a710c557ea9bd3afc50aebbddf45c83a92f))


### Bug Fixes

* adjust ISR by patching deps ([#2](https://github.com/agustinusnathaniel/foodies-db/issues/2)) ([71eeb43](https://github.com/agustinusnathaniel/foodies-db/commit/71eeb43e251842980f7d9b5cf3b932fe38df44de)), closes [/github.com/TanStack/router/issues/6275#issuecomment-3709657631](https://github.com/agustinusnathaniel//github.com/TanStack/router/issues/6275/issues/issuecomment-3709657631)
* image with loader to not use aspect ratio ([ad32d52](https://github.com/agustinusnathaniel/foodies-db/commit/ad32d52d0d81bd4b1e10b43dad6f966d9e38ff73))
* isr cache control issue ([f2919ce](https://github.com/agustinusnathaniel/foodies-db/commit/f2919ce965c1c1e06bb1066ce989e4a898651f63))
* lol I use wrong key name, supposedly s-maxage for vercel ([95a1497](https://github.com/agustinusnathaniel/foodies-db/commit/95a14973611f2b3442e2a1c720d5bfb33412ca72))
* provider still not working in root for prerender ([d3d3a9a](https://github.com/agustinusnathaniel/foodies-db/commit/d3d3a9a2db1870d9b00a9f89837ff599b339b6f8))
* reset category to all when tag/location filter changes ([861bce6](https://github.com/agustinusnathaniel/foodies-db/commit/861bce6de154bfbb16b0d24f5a9be32cfc0f6974))
* surprise me only picks items with valid links ([6c31934](https://github.com/agustinusnathaniel/foodies-db/commit/6c31934c289f535bbe515a6cebfac607da8df1af))

## 1.1.0 (2025-12-03)


### Features

* add products data source ([641b443](https://github.com/agustinusnathaniel/foodies-db/commit/641b443bcf494f52bac702fc7f5dcab5798262e1))
* enhance filtering ([550981a](https://github.com/agustinusnathaniel/foodies-db/commit/550981a483938ff4acf0dd90366417cadec0234e))
* migrate to tanstack start and setup notion sdk ([a22cdf5](https://github.com/agustinusnathaniel/foodies-db/commit/a22cdf59f138ddd1846b3a42e02c489ca6951d6d))
* revamp functional ([f33b910](https://github.com/agustinusnathaniel/foodies-db/commit/f33b910269407b30f0652518c5e52c5c6636db36))


### Bug Fixes

* pin tsr version to 1.136.18 ([55e3802](https://github.com/agustinusnathaniel/foodies-db/commit/55e3802872a4f344ba6cbb15da5d47e4d4c24a50)), closes [/github.com/TanStack/router/issues/5967#issuecomment-3580524406](https://github.com/agustinusnathaniel//github.com/TanStack/router/issues/5967/issues/issuecomment-3580524406)
* search bar ([6892d6b](https://github.com/agustinusnathaniel/foodies-db/commit/6892d6b21b70839ec14dc96a71e3385929850d5a))

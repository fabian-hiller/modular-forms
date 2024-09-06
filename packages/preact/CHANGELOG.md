# Changelog

All notable changes to the library will be documented in this file.

## v0.10.0 (September 06, 2024)

- Add support for async validation with Zod (issue #233)
- Add `validateOn` and `revalidateOn` option to `Field` and `FieldArray` component (pull request #247)
- Change `onSubmit` property of `Form` component to be optional (issue #237)

## v0.9.1 (June 27, 2024)

- Fix missing default for generic of `FormStore` type (issue #219)

## v0.9.0 (June 25, 2024)

- Upgrade Valibot dependency to >=v0.33.0

## v0.8.0 (June 06, 2024)

- Upgrade `valiField` and `valiForm` adapter for Valibot v0.31.0
- Improve `zodForm` adapter

## v0.7.0 (September 30, 2023)

- Add `submit` method (issue #130, pull request #136)

## v0.6.2 (August 23, 2023)

- Fix `valiField` and `valiForm` adapter for Valibot v0.13.0

## v0.6.1 (July 31, 2023)

- Fix `valiField` and `valiForm` adapter for Valibot v0.7.0

## v0.6.0 (July 13, 2023)

- Add support for Valibot with `valiField` and `valiForm` adapter

## v0.5.4 (June 25, 2023)

- Fix date support for `insert` and `replace` method

## v0.5.3 (June 23, 2023)

- Refactor `getFilteredNames` util
- Refactor path index sorting in `insert`, `move` and `remove` method
- Fix bug by removing invalid field array items (issue #85)

## v0.5.2 (June 17, 2023)

- Allow `noValidate` prop of `Form` to be overwritten (issue #92)

## v0.5.1 (June 05, 2023)

- Fix start value bug when using radio inputs (issue #83)

## v0.5.0 (May 29, 2023)

- Add `FormError` class for simpler error handling
- Add `FormError` support to `Form` component

## v0.4.0 (May 21, 2023)

- Add `toTrimmed`, `toLowerCase` and `toUpperCase` transformation function

## v0.3.0 (May 20, 2023)

- Add `getErrors` method (issue #72)
- Fix bug in `validate` method when using form level validation (issue #73)

## v0.2.1 (May 19, 2023)

- Fix bug when using dynamic field arrays

## v0.2.0 (May 14, 2023)

- Delay cleanup in `useLifecycle` hook with timeout

## v0.1.1 (May 07, 2023)

- Remove Preacts JSX runtime from library bundle

## v0.1.0 (May 02, 2023)

- Initial release

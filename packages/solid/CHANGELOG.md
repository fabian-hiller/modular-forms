# Changelog

All notable changes to the library will be documented in this file.

## vX.X.X (Month DD, YYYY)

- Upgrade Valibot dependency to >=v0.33.0

## v0.21.0 (June 06, 2024)

- Upgrade `valiField` and `valiForm` adapter for Valibot v0.31.0
- Improve `zodForm` adapter

## v0.20.0 (September 30, 2023)

- Add `submit` method (issue #130, pull request #136)

## v0.19.2 (August 23, 2023)

- Fix `valiField$` and `valiForm$` adapter for Valibot v0.13.0

## v0.19.1 (July 31, 2023)

- Fix `valiField` and `valiForm` adapter for Valibot v0.7.0

## v0.19.0 (July 13, 2023)

- Add support for Valibot with `valiField` and `valiForm` adapter

## v0.18.1 (June 25, 2023)

- Fix date support for `insert` and `replace` method
- Fix invalid `of` attribute in `Form` component (issue #98)

## v0.18.0 (June 23, 2023)

- Rename `autoFocus` in `Field` component to `autofocus` (issue #92)
- Rename `noValidate` in `Form` component to `novalidate` (issue #92)
- Refactor `getFilteredNames` util
- Refactor path index sorting in `insert`, `move` and `remove` method
- Fix bug by removing invalid field array items (issue #85)

## v0.17.2 (June 17, 2023)

- Allow `noValidate` prop of `Form` to be overwritten (issue #92)

## v0.17.1 (June 05, 2023)

- Fix start value bug when using radio inputs (issue #83)

## v0.17.0 (May 29, 2023)

- Add `FormError` class for simpler error handling
- Add `FormError` support to `Form` component

## v0.16.0 (May 21, 2023)

- Add `toTrimmed`, `toLowerCase` and `toUpperCase` transformation function

## v0.15.0 (May 20, 2023)

- Add `getErrors` method (issue #72)
- Fix bug in `validate` method when using form level validation (issue #73)

## v0.14.0 (May 14, 2023)

- Delay cleanup in `createLifecycle` primitive with timeout

## v0.13.2 (May 07, 2023)

- Refactor internal signals to reduce bundle size

## v0.13.1 (May 01, 2023)

- Fix bug by adding missing `transform` property to `initializeFieldStore` util

## v0.13.0 (May 01, 2023)

- Add `transform` prop to `Field` component (issue #40)
- Add `toCustom` transformation function
- Remove unused `InitialValues` and `MaybeFunction` utility type

## v0.12.2 (April 29, 2023)

- Fix sorting bug in `insert`, `move` and `remove` method (issue #61)

## v0.12.1 (April 29, 2023)

- Fix update bug in `getValues` method when adding new fields or array items (issue #60)

## v0.12.0 (April 18, 2023)

> Note: The package has been revised and refactored and it would be too complicated to mention every change here. Please look at the [release notes](https://github.com/fabian-hiller/modular-forms/releases/tag/v0.12.0-solid) and create an [issue](https://github.com/fabian-hiller/modular-forms/issues/new) if you encounter problems.

- Rename `createForm` primitive to `createFormStore`
- Add `createForm` primitive with linked components
- Change `children` property of `Field` component
- Add `type` property to `Field` component
- Change behaviour of controlled `<input type="number" />`
- Make `value` required on `insert` and `replace` method
- Remove `minFiles`, `maxFiles`, `minNumber` and `maxNumber` validation function

## v0.11.0 (March 16, 2023)

- Rename `Response` type to `FormResponse`
- Add `SubmitHandler` and `FormValues` type
- Add export for `FormProps`, `FieldProps` and `FieldArrayProps` type (issue #23)

## v0.10.0 (January 10, 2023)

- Improve type of submit event at `Form` and `handleSubmit` (issue #18)
- Change build step from tsup to Rollup and update exports (issue #16)
- Change validation strategy and add `'touched'` and `'blur'` mode (issue #14)
- Rename parameter of `getFieldArrayState` util

## v0.9.5 (January 07, 2023)

- Fix type at `zodForm` and `zodField` adapter (issue #17)

## v0.9.4 (January 07, 2023)

- Fix initial validation when `validateOn` is set to `'input'` (issue #15)

## v0.9.3 (December 21, 2022)

- Reset file inputs at `reset` method manually (issue #11)

## v0.9.2 (December 16, 2022)

- Fix initial value of radio inputs

## v0.9.1 (December 05, 2022)

- Change `Response` type to be more flexible and easier to use (issue #6)

## v0.9.0 (December 03, 2022)

- Add support for scheme validation with Zod
- Add support for validation of optional fields (issue #5)
- Change type of `custom`, `required` and `value` validation function

## v0.8.4 (November 29, 2022)

- Fix circular reference type error (issue #4)

## v0.8.3 (November 28, 2022)

- Try to fix circular reference type error

## v0.8.2 (November 23, 2022)

- Change type of field props event handlers
- Improve compatibility with components libraries

## v0.8.1 (November 14, 2022)

- Fix bug when form is reset

## v0.8.0 (November 08, 2022)

- Add `shouldFocus` option to `setValue` method

## v0.7.0 (November 08, 2022)

- Add `validateIfNecessary` util and refactor code
- Fix missing validation at `insert` and `remove` method
- Add support for field arrays to `required` validation
- Add support for deeply nested field arrays

## v0.6.0 (November 06, 2022)

- Rename TypeScript types and export more of them
- Fix typo that causes bugs when using field arrays

## v0.5.0 (November 06, 2022)

- Reset form response at `handleSubmit` and `reset` method
  - Add `keepResponse` property to `Form` component
  - Add `keepResponse` option to `handleSubmit` and `reset` method
  - Refactor `reset` method
- Add `keepItems` and `keepDirtyItems` option to `reset` method

## v0.4.0 (November 02, 2022)

- Add `clearResponse`, `hasField` and `hasFieldArray` method
- Improve and refactor `getValues`, `reset` and `validate` method
- Add missing export of `setError` and `setValue` method
- Fix invalid state of form (field arrays were not considered before)

## v0.3.0 (October 30, 2022)

- Change form response object
  - Rename key `variant` to `status`
  - Fix typo in `success` literal type

## v0.2.0 (October 24, 2022)

- Add `clearError` and `getError` method
- Refactor `setError` and `validate` method
- Fix focus bug at `setError` method

## v0.1.2 (October 21, 2022)

- Fix typos at README.md

## v0.1.1 (October 19, 2022)

- Add README.md

## v0.1.0 (October 19, 2022)

- Initial release

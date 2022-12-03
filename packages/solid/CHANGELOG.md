# Changelog

All notable changes to the library will be documented in this file.

## vX.X.X (Month DD, YYYY)

- Change type of `value` validation function
- Add support for validation of optional fields (issue #5)
- Add support for scheme validation with Zod

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

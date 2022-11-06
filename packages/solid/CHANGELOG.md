# Changelog

All notable changes to the library will be documented in this file.

## vX.X.X (Month DD, YYYY)

- Rename TypeScript types and export more of them

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

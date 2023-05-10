# Changelog

All notable changes to the library will be documented in this file.

## v0.13.0 (May 10, 2023)

- Fix redirect behavior in `formAction$` (issue #59)
- Upgrade Qwik and Qwik City peer dependency to v1.1

## v0.12.0 (May 05, 2023)

- Fix bug when `formAction$` is used multiple times (issue #62)
- Upgrade Qwik and Qwik City peer dependency to v1 🎉

## v0.11.0 (May 01, 2023)

- Add `transform` prop to `Field` component (issue #40)
- Add `toCustom` transformation function

## v0.10.1 (April 29, 2023)

- Fix sorting bug in `insert`, `move` and `remove` method (issue #61)

## v0.10.0 (April 27, 2023)

- Upgrade Qwik and Qwik City peer dependency

## v0.9.0 (April 18, 2023)

> Note: The package has been refactored and not every change is listed here. Please create an [issue](https://github.com/fabian-hiller/modular-forms/issues/new) if you encounter problems.

- Remove `active` property from RawFieldState and RawFieldArrayState type
- Remove unnecessary code from `Field` component
- Add log statement for unknown errors to `formAction$` (issue #50)
- Remove deprecated `custom`, `minFiles`, `maxFiles`, `minNumber` and `maxNumber` validation function
- Refactor `getValues` and remove `getArrayValues` method

## v0.8.1 (April 07, 2023)

- Downgrade Qwik and Qwik City peer dependency due to a bug in Qwik

## v0.8.0 (April 06, 2023)

- Fix date support at `updateFieldDirty` util
- Fix and refactor `getInitialStores` util
- Add `setValues` and improve `setValue` method (issue #35)
- Upgrade Qwik and Qwik City peer dependency (issue #45)

## v0.7.0 (April 02, 2023)

- Add `type` property to `Field` component
- Change implementation of `getElementInput` util
- Add `Date` to `FieldValue` type (issue #34)
- Add date support to `getFormDataValues` util
- Add number and date support to `minRange` and `maxRange` validation function
- Deprecate `minFiles`, `maxFiles`, `minNumber` and `maxNumber` validation function

## v0.6.0 (March 31, 2023)

- Upgrade Qwik and Qwik City to v1 release candidate (issue #45)

## v0.5.0 (March 26, 2023)

- Improve types for optional properties and parameters
- Add generic to type `data` of `FormResponse` type (issue #37)

## v0.4.0 (March 25, 2023)

- Extend parameter of `zodField$` and `zodForm$` to allow passing a function (issue #38)
- Add `data` property to `FormResponse` type (issue #37)

## v0.3.1 (March 24, 2023)

- Refactor processing of numbers in `getElementInput` util (issue #34)

## v0.3.0 (March 23, 2023)

- Add `reloadDocument` prop to `Form` component (issue #31)

## v0.2.0 (March 23, 2023)

- Change return type of first argument of `formAction$`
- Add `custom$` validation function and deprecate `custom` (issue #32)

## v0.1.1 (March 22, 2023)

- Fix Vite config and package.json

## v0.1.0 (March 21, 2023)

- Initial release

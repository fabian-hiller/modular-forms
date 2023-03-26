import type {
  FieldArrayPath,
  FieldPath,
  FieldPathValue,
  FieldValues,
  FormStore,
  InitialValues,
  Maybe,
} from '../types';
import {
  getFieldArrayStore,
  getFieldStore,
  getOptions,
  updateFormState,
  getFilteredNames,
  getPathValue,
  getUniqueId,
} from '../utils';

type ResetOptions<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues>
> = Partial<{
  initialValue: FieldPathValue<TFieldValues, TFieldName>;
  initialValues: InitialValues<TFieldValues>;
  keepResponse: boolean;
  keepSubmitCount: boolean;
  keepSubmitted: boolean;
  keepValues: boolean;
  keepDirtyValues: boolean;
  keepItems: boolean;
  keepDirtyItems: boolean;
  keepErrors: boolean;
  keepTouched: boolean;
  keepDirty: boolean;
}>;

/**
 * Resets the entire form, several fields and field arrays or a singel field or
 * field array.
 *
 * @param form The form to be reset.
 * @param arg2 The names to be reset or the reset options.
 * @param arg3 The reset options.
 */
export function reset<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues>,
  TFieldArrayName extends FieldArrayPath<TFieldValues>
>(
  form: FormStore<TFieldValues, TFieldName, TFieldArrayName>,
  arg2?: Maybe<
    | TFieldName
    | TFieldArrayName
    | (TFieldName | TFieldArrayName)[]
    | ResetOptions<TFieldValues, TFieldName>
  >,
  arg3?: Maybe<ResetOptions<TFieldValues, TFieldName>>
): void {
  // Filter names between field and field arrays
  const [fieldNames, fieldArrayNames] = getFilteredNames(form, arg2);

  // Check if only a single field should be reset
  const resetSingleField = typeof arg2 === 'string' && fieldNames.length === 1;

  // Check if entire form shoukd be reset
  const resetEntireForm = !resetSingleField && !Array.isArray(arg2);

  // Get options object
  const options = getOptions(arg2, arg3);

  // Destructure options and set default values
  const {
    initialValue,
    initialValues,
    keepResponse = false,
    keepSubmitCount = false,
    keepSubmitted = false,
    keepValues = false,
    keepDirtyValues = false,
    keepItems = false,
    keepDirtyItems = false,
    keepErrors = false,
    keepTouched = false,
    keepDirty = false,
  } = options;

  // Reset state of each field
  fieldNames.forEach((name) => {
    // Get store of specified field
    const field = getFieldStore(form, name);

    // Reset initial value if necessary
    if (resetSingleField ? 'initialValue' in options : initialValues) {
      field.internal.initialValue = resetSingleField
        ? initialValue
        : getPathValue(name, initialValues!);
    }

    // Check if dirty value should be kept
    const keepDirtyValue = keepDirtyValues && field.dirty;

    // Reset input if it is not to be kept
    if (!keepValues && !keepDirtyValue) {
      field.internal.startValue = field.internal.initialValue;
      field.value = field.internal.initialValue;

      // Reset file inputs manually, as they can't be controlled
      field.internal.elements.forEach((element) => {
        if (element.type === 'file') {
          element.value = '';
        }
      });
    }

    // Reset touched if it is not to be kept
    if (!keepTouched) {
      field.touched = false;
    }

    // Reset dirty if it is not to be kept
    if (!keepDirty && !keepValues && !keepDirtyValue) {
      field.dirty = false;
    }

    // Reset error if it is not to be kept
    if (!keepErrors) {
      field.error = '';
    }
  });

  // Reset state of each field array
  fieldArrayNames.forEach((name) => {
    // Get store of specified field array
    const fieldArray = getFieldArrayStore(form, name);

    // Check if current dirty items should be kept
    const keepCurrentDirtyItems = keepDirtyItems && fieldArray.dirty;

    // Reset initial items and items if it is not to be kept
    if (!keepItems && !keepCurrentDirtyItems) {
      if (initialValues) {
        fieldArray.internal.initialItems =
          getPathValue(name, initialValues)?.map(() => getUniqueId()) || [];
      }
      fieldArray.internal.startItems = [...fieldArray.internal.initialItems];
      fieldArray.items = [...fieldArray.internal.initialItems];
    }

    // Reset touched if it is not to be kept
    if (!keepTouched) {
      fieldArray.touched = false;
    }

    // Reset dirty if it is not to be kept
    if (!keepDirty && !keepItems && !keepCurrentDirtyItems) {
      fieldArray.dirty = false;
    }

    // Reset error if it is not to be kept
    if (!keepErrors) {
      fieldArray.error = '';
    }
  });

  // Reset state of form if necessary
  if (resetEntireForm) {
    // Reset response if it is not to be kept
    if (!keepResponse) {
      form.response = {};
    }

    // Reset submit count if it is not to be kept
    if (!keepSubmitCount) {
      form.submitCount = 0;
    }

    // Reset submitted if it is not to be kept
    if (!keepSubmitted) {
      form.submitted = false;
    }
  }

  // Update touched, dirty and invalid state of form
  updateFormState(form);
}

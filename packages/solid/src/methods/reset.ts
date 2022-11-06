import { batch } from 'solid-js';
import {
  DeepPartial,
  FieldArrayPath,
  FieldPath,
  FieldPathValue,
  FieldValues,
  FormState,
} from '../types';
import {
  getField,
  getInitialItems,
  getInitialValue,
  getOptions,
  updateState,
  getFilteredNames,
  getFieldArray,
} from '../utils';
import { setInitialValue } from '../utils';

type ResetOptions<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues>
> = Partial<{
  initialValue: [FieldPathValue<TFieldValues, TFieldName>];
  initialValues: DeepPartial<TFieldValues>;
  keepResponse: boolean;
  keepSubmitCount: boolean;
  keepSubmitted: boolean;
  keepValues: boolean;
  keepDirtyValues: boolean;
  keepErrors: boolean;
  keepTouched: boolean;
  keepDirty: boolean;
}>;

/**
 * Resets the entire form, several fields and field arrays or a singel field or
 * field array.
 *
 * @param form The form to be reset.
 * @param arg2 The name of the fields or field arrays to be reset or the reset
 * options.
 * @param arg3 The reset options.
 */
export function reset<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues>,
  TFieldArrayName extends FieldArrayPath<TFieldValues>
>(
  form: FormState<TFieldValues>,
  arg2?:
    | TFieldName
    | TFieldArrayName
    | (TFieldName | TFieldArrayName)[]
    | ResetOptions<TFieldValues, TFieldName>,
  arg3?: ResetOptions<TFieldValues, TFieldName>
): void {
  // Filter names between field and field arrays
  let [fieldNames, fieldArrayNames] = getFilteredNames(form, arg2);

  // Check if only a single field should be reset
  const resetSingleField = typeof arg2 === 'string' && fieldNames.length === 1;

  // Check if entire form shoukd be reset
  const resetEntireForm = !resetSingleField && !Array.isArray(arg2);

  // Destructure options and set default values
  const {
    initialValue,
    initialValues,
    keepResponse = false,
    keepSubmitCount = false,
    keepSubmitted = false,
    keepValues = false,
    keepDirtyValues = false,
    keepErrors = false,
    keepTouched = false,
    keepDirty = false,
  } = getOptions(arg2, arg3);

  // Set initial value of a single field if specified
  if (resetSingleField) {
    if (initialValue) {
      setInitialValue(form, fieldNames[0] as TFieldName, initialValue[0]);
    }

    // Or replace or shallow merge initial values of form if specified
  } else if (initialValues) {
    if (resetEntireForm) {
      form.internal.initialValues = initialValues;
    } else {
      form.internal.initialValues = {
        ...form.internal.initialValues,
        ...initialValues,
      };
    }
  }

  // Sync state updates and prevent unnecessary recalculation
  batch(() => {
    // Reset state of each field
    fieldNames.forEach((name) => {
      // Get specified field
      const field = getField(form, name);

      // Get initial input
      const initialInput = getInitialValue(form, name);

      // Reset initial input
      field.setInitialInput(() => initialInput);

      // Check if dirty value should be kept
      const keepDirtyValue = keepDirtyValues && field.getDirty();

      // Reset input if it is not to be kept
      if (!keepValues && !keepDirtyValue) {
        field.setInput(() => initialInput);
      }

      // Reset touched if it is not to be kept
      if (!keepTouched) {
        field.setTouched(false);
      }

      // Reset dirty if it is not to be kept
      if (!keepDirty && !keepValues && !keepDirtyValue) {
        field.setDirty(false);
      }

      // Reset error if it is not to be kept
      if (!keepErrors) {
        field.setError('');
      }
    });

    // Reset state of each field array
    fieldArrayNames.forEach((name) => {
      // Get specified field array
      const fieldArray = getFieldArray(form, name);

      // Check if dirty value should be kept
      const keepDirtyValue = keepDirtyValues && fieldArray.getDirty();

      // Reset initial items and items if it is not to be kept
      if (!keepValues && !keepDirtyValue) {
        const initialItems = getInitialItems(form, name);
        fieldArray.setInitialItems(initialItems);
        fieldArray.setItems(initialItems);
      }

      // Reset touched if it is not to be kept
      if (!keepTouched) {
        fieldArray.setTouched(false);
      }

      // Reset dirty if it is not to be kept
      if (!keepDirty && !keepValues && !keepDirtyValue) {
        fieldArray.setDirty(false);
      }

      // Reset error if it is not to be kept
      if (!keepErrors) {
        fieldArray.setError('');
      }
    });

    // Reset form state if necessary
    if (resetEntireForm) {
      // Reset response if it is not to be kept
      if (!keepResponse) {
        form.internal.setResponse({});
      }

      // Reset form if values should not be kept
      if (!keepValues) {
        form.element?.reset();
      }

      // Reset submit count if it is not to be kept
      if (!keepSubmitCount) {
        form.internal.setSubmitCount(0);
      }

      // Reset submitted if it is not to be kept
      if (!keepSubmitted) {
        form.internal.setSubmitted(false);
      }
    }

    // Update touched, dirty and invalid state of form
    updateState(form);
  });
}

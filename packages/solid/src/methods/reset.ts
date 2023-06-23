import { batch, untrack } from 'solid-js';
import type {
  FieldValues,
  FieldPath,
  FieldPathValue,
  ResponseData,
  FormStore,
  Maybe,
  FieldArrayPath,
  PartialValues,
} from '../types';
import {
  getFilteredNames,
  getOptions,
  getFieldStore,
  getPathValue,
  getFieldArrayStore,
  getUniqueId,
  updateFormState,
} from '../utils';

/**
 * Value type of the reset options.
 */
export type ResetOptions<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues>
> = Partial<{
  initialValue: FieldPathValue<TFieldValues, TFieldName>;
  initialValues: PartialValues<TFieldValues>;
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
 * @param options The reset options.
 */
export function reset<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData
>(
  form: FormStore<TFieldValues, TResponseData>,
  options?: Maybe<ResetOptions<TFieldValues, FieldPath<TFieldValues>>>
): void;

/**
 * Resets the entire form, several fields and field arrays or a singel field or
 * field array.
 *
 * @param form The form to be reset.
 * @param name The field or field array to be reset.
 * @param options The reset options.
 */
export function reset<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData,
  TFieldName extends FieldPath<TFieldValues>
>(
  form: FormStore<TFieldValues, TResponseData>,
  name: TFieldName | FieldArrayPath<TFieldValues>,
  options?: Maybe<ResetOptions<TFieldValues, TFieldName>>
): void;

/**
 * Resets the entire form, several fields and field arrays or a singel field or
 * field array.
 *
 * @param form The form to be reset.
 * @param names The fields and field arrays to be reset.
 * @param options The reset options.
 */
export function reset<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData
>(
  form: FormStore<TFieldValues, TResponseData>,
  names: (FieldPath<TFieldValues> | FieldArrayPath<TFieldValues>)[],
  options?: Maybe<ResetOptions<TFieldValues, FieldPath<TFieldValues>>>
): void;

export function reset<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData,
  TFieldName extends FieldPath<TFieldValues>
>(
  form: FormStore<TFieldValues, TResponseData>,
  arg2?: Maybe<
    | TFieldName
    | FieldArrayPath<TFieldValues>
    | (FieldPath<TFieldValues> | FieldArrayPath<TFieldValues>)[]
    | ResetOptions<TFieldValues, TFieldName>
  >,
  arg3?: Maybe<ResetOptions<TFieldValues, TFieldName>>
): void {
  // Filter names between field and field arrays
  const [fieldNames, fieldArrayNames] = getFilteredNames(form, arg2, false);

  // Check if only a single field should be reset
  const resetSingleField = typeof arg2 === 'string' && fieldNames.length === 1;

  // Check if entire form should be reset
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

  batch(() =>
    untrack(() => {
      // Reset state of each field
      fieldNames.forEach((name) => {
        // Get store of specified field
        const field = getFieldStore(form, name)!;

        // Reset initial value if necessary
        if (resetSingleField ? 'initialValue' in options : initialValues) {
          field.initialValue.set(() =>
            resetSingleField ? initialValue : getPathValue(name, initialValues!)
          );
        }

        // Check if dirty value should be kept
        const keepDirtyValue = keepDirtyValues && field.dirty.get();

        // Reset input if it is not to be kept
        if (!keepValues && !keepDirtyValue) {
          field.startValue.set(field.initialValue.get);
          field.value.set(field.initialValue.get);

          // Reset file inputs manually, as they can't be controlled
          field.elements.get().forEach((element) => {
            if (element.type === 'file') {
              element.value = '';
            }
          });
        }

        // Reset touched if it is not to be kept
        if (!keepTouched) {
          field.touched.set(false);
        }

        // Reset dirty if it is not to be kept
        if (!keepDirty && !keepValues && !keepDirtyValue) {
          field.dirty.set(false);
        }

        // Reset error if it is not to be kept
        if (!keepErrors) {
          field.error.set('');
        }
      });

      // Reset state of each field array
      fieldArrayNames.forEach((name) => {
        // Get store of specified field array
        const fieldArray = getFieldArrayStore(form, name)!;

        // Check if current dirty items should be kept
        const keepCurrentDirtyItems = keepDirtyItems && fieldArray.dirty.get();

        // Reset initial items and items if it is not to be kept
        if (!keepItems && !keepCurrentDirtyItems) {
          if (initialValues) {
            fieldArray.initialItems.set(
              getPathValue(name, initialValues)?.map(() => getUniqueId()) || []
            );
          }
          fieldArray.startItems.set([...fieldArray.initialItems.get()]);
          fieldArray.items.set([...fieldArray.initialItems.get()]);
        }

        // Reset touched if it is not to be kept
        if (!keepTouched) {
          fieldArray.touched.set(false);
        }

        // Reset dirty if it is not to be kept
        if (!keepDirty && !keepItems && !keepCurrentDirtyItems) {
          fieldArray.dirty.set(false);
        }

        // Reset error if it is not to be kept
        if (!keepErrors) {
          fieldArray.error.set('');
        }
      });

      // Reset state of form if necessary
      if (resetEntireForm) {
        // Reset response if it is not to be kept
        if (!keepResponse) {
          form.internal.response.set({});
        }

        // Reset submit count if it is not to be kept
        if (!keepSubmitCount) {
          form.internal.submitCount.set(0);
        }

        // Reset submitted if it is not to be kept
        if (!keepSubmitted) {
          form.internal.submitted.set(false);
        }
      }

      // Update touched, dirty and invalid state of form
      updateFormState(form);
    })
  );
}

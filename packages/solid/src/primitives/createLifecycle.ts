import {
  FieldValues,
  FieldPath,
  ValidateField,
  FieldPathValue,
  FieldArrayPath,
  ValidateFieldArray,
  ResponseData,
} from '@modular-forms/shared';
import { FieldValue, FieldStore, FieldArrayStore } from '../types';
import { createEffect, onCleanup } from 'solid-js';
import { getUniqueId, updateFormState } from '../utils';
import { reset } from '../methods';
import { FieldArrayProps, FieldProps } from '../components';

type LifecycleProps<
  TFieldValues extends FieldValues<FieldValue>,
  TResponseData extends ResponseData,
  TFieldName extends FieldPath<TFieldValues, FieldValue>,
  TFieldArrayName extends FieldArrayPath<TFieldValues, FieldValue>
> = Pick<
  | FieldProps<TFieldValues, TResponseData, TFieldName, TFieldArrayName>
  | FieldArrayProps<TFieldValues, TResponseData, TFieldName, TFieldArrayName>,
  'of' | 'validate' | 'keepActive' | 'keepState'
>;

/**
 * Primitive that handles the lifecycle dependent state of a field or field
 * array.
 */
export function createLifecycle<
  TFieldValues extends FieldValues<FieldValue>,
  TResponseData extends ResponseData,
  TFieldName extends FieldPath<TFieldValues, FieldValue>,
  TFieldArrayName extends FieldArrayPath<TFieldValues, FieldValue>
>(
  props: LifecycleProps<
    TFieldValues,
    TResponseData,
    TFieldName,
    TFieldArrayName
  >,
  getStore: () =>
    | FieldStore<TFieldValues, TFieldName>
    | FieldArrayStore<TFieldValues, TFieldArrayName>
): void {
  createEffect(() => {
    // Destructure props and set default values
    const { of: form, validate, keepActive = false, keepState = true } = props;

    // Get store of field or field array
    const store = getStore();

    // Add validation functions
    store.internal.validate = validate
      ? Array.isArray(validate)
        ? validate
        : ([validate] as
            | ValidateFieldArray<number[]>[]
            | ValidateField<
                FieldPathValue<TFieldValues, TFieldName, FieldValue>
              >[])
      : [];

    // Create unique consumer ID
    const consumer = getUniqueId();

    // Add consumer to field
    store.internal.consumers.add(consumer);

    // Mark field as active and update form state if necessary
    if (!store.active) {
      store.internal.setActive(true);
      updateFormState(form);
    }

    // On cleanup, remove consumer from field
    onCleanup(() => {
      store.internal.consumers.delete(consumer);

      // Mark field as inactive if there is no other consumer
      if (!keepActive && !store.internal.consumers.size) {
        store.internal.setActive(false);

        // Reset state if it is not to be kept
        if (!keepState) {
          reset(form, store.name);

          // Otherwise just update form state
        } else {
          updateFormState(form);
        }
      }

      // Remove unmounted elements
      if ('value' in store) {
        setTimeout(() => {
          store.internal.setElements((elements) =>
            elements.filter((element) => element.isConnected)
          );
        });
      }
    });
  });
}

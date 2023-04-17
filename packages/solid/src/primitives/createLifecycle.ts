import { batch, createEffect, onCleanup, untrack } from 'solid-js';
import { reset } from '../methods';
import type {
  FieldArrayPath,
  FieldPath,
  FieldPathValue,
  FieldValues,
  FormStore,
  InternalFieldArrayStore,
  InternalFieldStore,
  Maybe,
  MaybeArray,
  ResponseData,
  ValidateField,
  ValidateFieldArray,
} from '../types';
import { getUniqueId, updateFormState } from '../utils';

/**
 * Value type of the lifecycle properties.
 */
type LifecycleProps<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData,
  TFieldName extends FieldPath<TFieldValues>
> = {
  of: FormStore<TFieldValues, TResponseData>;
  name: TFieldName | FieldArrayPath<TFieldValues>;
  getStore: () =>
    | InternalFieldStore<TFieldValues, TFieldName>
    | InternalFieldArrayStore;
  validate?: Maybe<
    | MaybeArray<ValidateField<FieldPathValue<TFieldValues, TFieldName>>>
    | MaybeArray<ValidateFieldArray<number[]>>
  >;
  keepActive?: Maybe<boolean>;
  keepState?: Maybe<boolean>;
};

/**
 * Handles the lifecycle dependent state of a field or field array.
 *
 * @param props The lifecycle properties.
 */
export function createLifecycle<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData,
  TFieldName extends FieldPath<TFieldValues>
>({
  of: form,
  name,
  getStore,
  validate,
  keepActive = false,
  keepState = true,
}: LifecycleProps<TFieldValues, TResponseData, TFieldName>) {
  createEffect(() => {
    // Get store of field or field array
    const store = getStore();

    // Add validation functions
    store.validate = validate
      ? Array.isArray(validate)
        ? validate
        : ([validate] as
            | ValidateFieldArray<number[]>[]
            | ValidateField<FieldPathValue<TFieldValues, TFieldName>>[])
      : [];

    // Create unique consumer ID
    const consumer = getUniqueId();

    // Add consumer to field
    store.consumers.add(consumer);

    // Mark field as active and update form state if necessary
    if (!untrack(store.getActive)) {
      batch(() => {
        store.setActive(true);
        updateFormState(form);
      });
    }

    // On cleanup, remove consumer from field
    onCleanup(() => {
      store.consumers.delete(consumer);

      // Mark field as inactive if there is no other consumer
      batch(() => {
        if (!keepActive && !store.consumers.size) {
          store.setActive(false);

          // Reset state if it is not to be kept
          if (!keepState) {
            reset(form, name);

            // Otherwise just update form state
          } else {
            updateFormState(form);
          }
        }
      });

      // Remove unmounted elements
      if ('setElements' in store) {
        setTimeout(() => {
          store.setElements((elements) =>
            elements.filter((element) => element.isConnected)
          );
        });
      }
    });
  });
}

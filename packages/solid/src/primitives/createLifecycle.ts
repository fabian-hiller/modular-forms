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
  TransformField,
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
  transform?: Maybe<
    MaybeArray<TransformField<FieldPathValue<TFieldValues, TFieldName>>>
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
  transform,
  keepActive = false,
  keepState = true,
}: LifecycleProps<TFieldValues, TResponseData, TFieldName>) {
  createEffect(() => {
    // Get store of field or field array
    const store = getStore();

    // Add validation functions
    // @ts-ignore FIXME: Resolve type error
    store.validate = validate
      ? Array.isArray(validate)
        ? validate
        : [validate]
      : [];

    // Add transformation functions
    if ('transform' in store) {
      store.transform = transform
        ? Array.isArray(transform)
          ? transform
          : [transform]
        : [];
    }

    // Create unique consumer ID
    const consumer = getUniqueId();

    // Add consumer to field
    store.consumers.add(consumer);

    // Mark field as active and update form state if necessary
    if (!untrack(store.active.get)) {
      batch(() => {
        store.active.set(true);
        updateFormState(form);
      });
    }

    // On cleanup, remove consumer from field
    onCleanup(() =>
      setTimeout(() => {
        store.consumers.delete(consumer);

        // Mark field as inactive if there is no other consumer
        batch(() => {
          if (!keepActive && !store.consumers.size) {
            store.active.set(false);

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
        if ('elements' in store) {
          store.elements.set((elements) =>
            elements.filter((element) => element.isConnected)
          );
        }
      })
    );
  });
}

import { batch } from '@preact/signals-react';
import { useEffect } from 'react';
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
  store: InternalFieldStore<TFieldValues, TFieldName> | InternalFieldArrayStore;
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
export function useLifecycle<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData,
  TFieldName extends FieldPath<TFieldValues>
>({
  of: form,
  name,
  store,
  validate,
  transform,
  keepActive = false,
  keepState = true,
}: LifecycleProps<TFieldValues, TResponseData, TFieldName>) {
  useEffect(() => {
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
  }, [store, transform, validate]);

  useEffect(() => {
    // Create unique consumer ID
    const consumer = getUniqueId();

    // Add consumer to field
    store.consumers.add(consumer);

    // Mark field as active and update form state if necessary
    if (!store.active.peek()) {
      batch(() => {
        store.active.value = true;
        updateFormState(form);
      });
    }

    // On cleanup, remove consumer from field
    return () => {
      setTimeout(() => {
        store.consumers.delete(consumer);

        // Mark field as inactive if there is no other consumer
        batch(() => {
          if (!keepActive && !store.consumers.size) {
            store.active.value = false;

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
          store.elements.value = store.elements
            .peek()
            .filter((element) => element.isConnected);
        }
      });
    };
  }, [form, name, store, keepActive, keepState]);
}

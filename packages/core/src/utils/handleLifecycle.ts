import { reset } from '../methods';
import type {
  FieldValues,
  ResponseData,
  FieldPath,
  FieldArrayPath,
  ValidateFieldArray,
  ValidateField,
  FieldPathValue,
  MaybeQRL,
  FieldArrayStore,
  FieldStore,
  FormStore,
  Maybe,
  MaybeArray,
  ReactivityDeps,
} from '../types';
import { getUniqueId } from './getUniqueId';
import { updateFormState } from './updateFormState';

/**
 * Value type of the lifecycle properties.
 */
type LifecycleProps<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData,
  TFieldName extends FieldPath<TFieldValues>,
  TFieldArrayName extends FieldArrayPath<TFieldValues>
> = {
  of: FormStore<TFieldValues, TResponseData>;
  store:
    | FieldStore<TFieldValues, TFieldName>
    | FieldArrayStore<TFieldValues, TFieldArrayName>;
  validate?: Maybe<
    | MaybeArray<
        MaybeQRL<ValidateField<FieldPathValue<TFieldValues, TFieldName>>>
      >
    | MaybeArray<MaybeQRL<ValidateFieldArray<number[]>>>
  >;
  keepActive?: Maybe<boolean>;
  keepState?: Maybe<boolean>;
};

/**
 * Handles the lifecycle dependent state of a field or field array.
 *
 * @param props The lifecycle properties.
 * @param deps The function dependencies.
 */
export function handleLifecycle<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData,
  TFieldName extends FieldPath<TFieldValues>,
  TFieldArrayName extends FieldArrayPath<TFieldValues>
>(
  {
    batch = (fn) => fn(),
    untrack = (fn) => fn(),
    cleanup,
  }: ReactivityDeps & { cleanup: (fn: () => void) => void },
  {
    of: form,
    store,
    validate,
    keepActive = false,
    keepState = true,
  }: LifecycleProps<TFieldValues, TResponseData, TFieldName, TFieldArrayName>
) {
  // Add validation functions
  store.internal.validate = validate
    ? Array.isArray(validate)
      ? validate
      : ([validate] as
          | MaybeQRL<ValidateFieldArray<number[]>>[]
          | MaybeQRL<ValidateField<FieldPathValue<TFieldValues, TFieldName>>>[])
    : [];

  // Create unique consumer ID
  const consumer = getUniqueId();

  // Add consumer to field
  store.internal.consumers.push(consumer);

  // Mark field as active and update form state if necessary
  batch(() =>
    untrack(() => {
      if (!store.active) {
        store.active = true;
        updateFormState(form);
      }
    })
  );

  // On cleanup, remove consumer from field
  cleanup(() => {
    store.internal.consumers.splice(
      store.internal.consumers.indexOf(consumer),
      1
    );

    // Mark field as inactive if there is no other consumer
    batch(() =>
      untrack(() => {
        if (!keepActive && !store.internal.consumers.length) {
          store.active = false;

          // Reset state if it is not to be kept
          if (!keepState) {
            reset(form, store.name);

            // Otherwise just update form state
          } else {
            updateFormState(form);
          }
        }
      })
    );

    // Remove unmounted elements
    if ('value' in store) {
      setTimeout(() => {
        store.internal.elements = store.internal.elements.filter(
          (element) => element.isConnected
        );
      });
    }
  });
}

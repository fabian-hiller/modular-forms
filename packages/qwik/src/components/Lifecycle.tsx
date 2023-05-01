import {
  component$,
  Slot,
  useVisibleTask$,
  type PublicProps,
  type JSXNode,
  type QRL,
} from '@builder.io/qwik';
import type { JSX } from '@builder.io/qwik/jsx-runtime';
import { reset } from '../methods';
import type {
  FieldArrayPath,
  FieldArrayStore,
  FieldPath,
  FieldPathValue,
  FieldStore,
  FieldValues,
  FormStore,
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
  TFieldName extends FieldPath<TFieldValues>,
  TFieldArrayName extends FieldArrayPath<TFieldValues>
> = {
  key: string | number;
  of: FormStore<TFieldValues, TResponseData>;
  store:
    | FieldStore<TFieldValues, TFieldName>
    | FieldArrayStore<TFieldValues, TFieldArrayName>;
  validate?: Maybe<
    | MaybeArray<QRL<ValidateField<FieldPathValue<TFieldValues, TFieldName>>>>
    | MaybeArray<QRL<ValidateFieldArray<number[]>>>
  >;
  transform?: Maybe<
    MaybeArray<QRL<TransformField<FieldPathValue<TFieldValues, TFieldName>>>>
  >;
  keepActive?: Maybe<boolean>;
  keepState?: Maybe<boolean>;
};

/**
 * Component that handles the lifecycle dependent state of a field or field
 * array.
 */
export const Lifecycle: <
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData,
  TFieldName extends FieldPath<TFieldValues>,
  TFieldArrayName extends FieldArrayPath<TFieldValues>
>(
  props: PublicProps<
    LifecycleProps<TFieldValues, TResponseData, TFieldName, TFieldArrayName>
  >,
  key: string | null,
  flags: number
) => JSXNode | null = component$(
  <
    TFieldValues extends FieldValues,
    TResponseData extends ResponseData,
    TFieldName extends FieldPath<TFieldValues>,
    TFieldArrayName extends FieldArrayPath<TFieldValues>
  >({
    of: form,
    store,
    validate,
    transform,
    keepActive,
    keepState,
  }: LifecycleProps<
    TFieldValues,
    TResponseData,
    TFieldName,
    TFieldArrayName
  >): JSX.Element => {
    // TODO: Switch back to `useTask$` once issue #3193 is fixed
    useVisibleTask$(({ cleanup }) => {
      // Add validation functions
      store.internal.validate = validate
        ? Array.isArray(validate)
          ? validate
          : ([validate] as
              | QRL<ValidateFieldArray<number[]>>[]
              | QRL<ValidateField<FieldPathValue<TFieldValues, TFieldName>>>[])
        : [];

      // Add transformation functions
      if ('value' in store) {
        store.internal.transform = transform
          ? Array.isArray(transform)
            ? transform
            : [transform]
          : [];
      }

      // Create unique consumer ID
      const consumer = getUniqueId();

      // Add consumer to field
      store.internal.consumers.push(consumer);

      // Mark field as active and update form state if necessary
      if (!store.active) {
        store.active = true;
        updateFormState(form);
      }

      // On cleanup, remove consumer from field
      cleanup(() => {
        store.internal.consumers.splice(
          store.internal.consumers.indexOf(consumer),
          1
        );

        // Mark field as inactive if there is no other consumer
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

        // Remove unmounted elements
        if ('value' in store) {
          setTimeout(() => {
            store.internal.elements = store.internal.elements.filter(
              (element) => element.isConnected
            );
          });
        }
      });
    });

    return <Slot />;
  }
);

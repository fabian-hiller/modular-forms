import {
  component$,
  Slot,
  useBrowserVisibleTask$,
  type PublicProps,
  type JSXNode,
} from '@builder.io/qwik';
import type { JSX } from '@builder.io/qwik/jsx-runtime';
import type {
  FieldArrayPath,
  FieldArrayStore,
  FieldPath,
  FieldPathValue,
  FieldStore,
  FieldValues,
  FormStore,
  ValidateField,
  ValidateFieldArray,
} from '../types';
import { getUniqueId, updateFormState } from '../utils';
import { reset } from '../methods';

type FieldProps<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues>
> = {
  store: FieldStore<TFieldValues, TFieldName>;
  validate?:
    | ValidateField<FieldPathValue<TFieldValues, TFieldName>>
    | ValidateField<FieldPathValue<TFieldValues, TFieldName>>[];
};

type FieldArrayProps<
  TFieldValues extends FieldValues,
  TFieldArrayName extends FieldArrayPath<TFieldValues>
> = {
  store: FieldArrayStore<TFieldValues, TFieldArrayName>;
  validate?: ValidateFieldArray<number[]> | ValidateFieldArray<number[]>[];
};

type LifecycleProps<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues>,
  TFieldArrayName extends FieldArrayPath<TFieldValues>
> = (
  | FieldProps<TFieldValues, TFieldName>
  | FieldArrayProps<TFieldValues, TFieldArrayName>
) & {
  key: string | number;
  of: FormStore<TFieldValues, TFieldName, TFieldArrayName>;
  keepActive?: boolean;
  keepState?: boolean;
};

/**
 * Component that handles the lifecycle dependent state of a field or field
 * array.
 */
export const Lifecycle: <
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues>,
  TFieldArrayName extends FieldArrayPath<TFieldValues>
>(
  props: PublicProps<LifecycleProps<TFieldValues, TFieldName, TFieldArrayName>>,
  key: string | null
) => JSXNode | null = component$(
  <
    TFieldValues extends FieldValues,
    TFieldName extends FieldPath<TFieldValues>,
    TFieldArrayName extends FieldArrayPath<TFieldValues>
  >({
    of: form,
    store,
    validate,
    keepActive = false,
    keepState = true,
  }: LifecycleProps<
    TFieldValues,
    TFieldName,
    TFieldArrayName
  >): JSX.Element => {
    // Track active state of file
    // TODO: Switch back to `useTask$` once issue #3178 and #3193 is fixed
    useBrowserVisibleTask$(({ cleanup }) => {
      // Add validation functions
      store.internal.validate = (
        validate ? (Array.isArray(validate) ? validate : [validate]) : []
      ) as
        | ValidateField<FieldPathValue<TFieldValues, TFieldName>>[]
        | ValidateFieldArray<number[]>[];

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

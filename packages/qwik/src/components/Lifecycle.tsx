import {
  component$,
  Slot,
  useVisibleTask$,
  type PublicProps,
  type JSXNode,
  type QRL,
} from '@builder.io/qwik';
import type { JSX } from '@builder.io/qwik/jsx-runtime';
import type {
  FieldArrayPath,
  FieldPath,
  FieldPathValue,
  FieldValues,
  Maybe,
  MaybeArray,
  ResponseData,
  ValidateField,
  ValidateFieldArray,
} from '@modular-forms/shared';
import type {
  FieldArrayStore,
  FieldStore,
  FieldValue,
  FormStore,
} from '../types';
import { getUniqueId, updateFormState } from '../utils';
import { reset } from '../methods';

type FieldProps<
  TFieldValues extends FieldValues<FieldValue>,
  TFieldName extends FieldPath<TFieldValues, FieldValue>
> = {
  store: FieldStore<TFieldValues, TFieldName>;
  validate?: Maybe<
    MaybeArray<
      QRL<ValidateField<FieldPathValue<TFieldValues, TFieldName, FieldValue>>>
    >
  >;
};

type FieldArrayProps<
  TFieldValues extends FieldValues<FieldValue>,
  TFieldArrayName extends FieldArrayPath<TFieldValues, FieldValue>
> = {
  store: FieldArrayStore<TFieldValues, TFieldArrayName>;
  validate?: Maybe<MaybeArray<QRL<ValidateFieldArray<number[]>>>>;
};

type LifecycleProps<
  TFieldValues extends FieldValues<FieldValue>,
  TResponseData extends ResponseData,
  TFieldName extends FieldPath<TFieldValues, FieldValue>,
  TFieldArrayName extends FieldArrayPath<TFieldValues, FieldValue>
> = (
  | FieldProps<TFieldValues, TFieldName>
  | FieldArrayProps<TFieldValues, TFieldArrayName>
) & {
  key: string | number;
  of: FormStore<TFieldValues, TResponseData, TFieldName, TFieldArrayName>;
  keepActive?: Maybe<boolean>;
  keepState?: Maybe<boolean>;
};

/**
 * Component that handles the lifecycle dependent state of a field or field
 * array.
 */
export const Lifecycle: <
  TFieldValues extends FieldValues<FieldValue>,
  TResponseData extends ResponseData,
  TFieldName extends FieldPath<TFieldValues, FieldValue>,
  TFieldArrayName extends FieldArrayPath<TFieldValues, FieldValue>
>(
  props: PublicProps<
    LifecycleProps<TFieldValues, TResponseData, TFieldName, TFieldArrayName>
  >,
  key: string | null,
  flags: number
) => JSXNode | null = component$(
  <
    TFieldValues extends FieldValues<FieldValue>,
    TResponseData extends ResponseData,
    TFieldName extends FieldPath<TFieldValues, FieldValue>,
    TFieldArrayName extends FieldArrayPath<TFieldValues, FieldValue>
  >({
    of: form,
    store,
    validate,
    keepActive = false,
    keepState = true,
  }: LifecycleProps<
    TFieldValues,
    TResponseData,
    TFieldName,
    TFieldArrayName
  >): JSX.Element => {
    // Track active state of file
    // TODO: Switch back to `useTask$` once issue #3193 is fixed
    useVisibleTask$(({ cleanup }) => {
      // Add validation functions
      // @ts-ignore FIXME: Unknown bug since TypeScript 5.0
      store.internal.validate = validate
        ? Array.isArray(validate)
          ? validate
          : [validate]
        : [];

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

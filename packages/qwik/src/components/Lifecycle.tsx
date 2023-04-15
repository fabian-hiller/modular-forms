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
  FieldArrayStore,
  FieldPath,
  FieldPathValue,
  FieldValues,
  Maybe,
  MaybeArray,
  ResponseData,
  ValidateField,
  ValidateFieldArray,
} from '@modular-forms/core';
import { handleLifecycle } from '@modular-forms/core';
import type { FieldStore, FormStore } from '../types';

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
  >(
    props: LifecycleProps<
      TFieldValues,
      TResponseData,
      TFieldName,
      TFieldArrayName
    >
  ): JSX.Element => {
    // TODO: Switch back to `useTask$` once issue #3193 is fixed
    useVisibleTask$((deps) => handleLifecycle(deps, props));
    return <Slot />;
  }
);

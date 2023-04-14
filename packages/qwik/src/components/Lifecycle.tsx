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
  FieldStore,
  FieldValues,
  FormStore,
  Maybe,
  MaybeArray,
  ResponseData,
  ValidateField,
  ValidateFieldArray,
} from '@modular-forms/shared';
import { handleLifecycle } from '@modular-forms/shared';

/**
 * Value type of the field specific properties.
 */
type FieldProps<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues>
> = {
  store: FieldStore<TFieldValues, TFieldName>;
  validate?: Maybe<
    MaybeArray<QRL<ValidateField<FieldPathValue<TFieldValues, TFieldName>>>>
  >;
};

/**
 * Value type of the field array specific properties.
 */
type FieldArrayProps<
  TFieldValues extends FieldValues,
  TFieldArrayName extends FieldArrayPath<TFieldValues>
> = {
  store: FieldArrayStore<TFieldValues, TFieldArrayName>;
  validate?: Maybe<MaybeArray<QRL<ValidateFieldArray<number[]>>>>;
};

/**
 * Value type of the lifecycle properties.
 */
type LifecycleProps<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData,
  TFieldName extends FieldPath<TFieldValues>,
  TFieldArrayName extends FieldArrayPath<TFieldValues>
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
    useVisibleTask$(({ cleanup }) => handleLifecycle(props, cleanup));
    return <Slot />;
  }
);

import type { QRL } from '@builder.io/qwik';
import type { JSX } from '@builder.io/qwik/jsx-runtime';
import type {
  FieldArrayPath,
  FieldPath,
  FieldValues,
  Maybe,
  MaybeArray,
  ResponseData,
  ValidateFieldArray,
} from '@modular-forms/core';
import { getFieldArrayStore } from '@modular-forms/core';
import type { FieldArrayStore, FormStore } from '../types';
import { Lifecycle } from './Lifecycle';

/**
 * Value type of the field array props.
 */
export type FieldArrayProps<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData,
  TFieldName extends FieldPath<TFieldValues>,
  TFieldArrayName extends FieldArrayPath<TFieldValues>
> = {
  of: FormStore<TFieldValues, TResponseData, TFieldName, TFieldArrayName>;
  name: TFieldArrayName;
  children: (
    store: FieldArrayStore<TFieldValues, TFieldArrayName>
  ) => JSX.Element;
  validate?: Maybe<MaybeArray<QRL<ValidateFieldArray<number[]>>>>;
  keepActive?: Maybe<boolean>;
  keepState?: Maybe<boolean>;
};

/**
 * Headless field array that provides reactive properties and state.
 */
export function FieldArray<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData,
  TFieldName extends FieldPath<TFieldValues>,
  TFieldArrayName extends FieldArrayPath<TFieldValues>
>({
  children,
  name,
  ...props
}: FieldArrayProps<
  TFieldValues,
  TResponseData,
  TFieldName,
  TFieldArrayName
>): JSX.Element {
  // Get store of specified field
  const fieldArray = getFieldArrayStore(props.of, name) as FieldArrayStore<
    TFieldValues,
    TFieldArrayName
  >;

  return (
    <Lifecycle key={name} store={fieldArray} {...props}>
      {children(fieldArray)}
    </Lifecycle>
  );
}

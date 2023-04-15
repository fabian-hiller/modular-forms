import type {
  PropFunction,
  QwikChangeEvent,
  QwikFocusEvent,
  QRL,
} from '@builder.io/qwik';
import { $, noSerialize } from '@builder.io/qwik';
import { isServer } from '@builder.io/qwik/build';
import type { JSX } from '@builder.io/qwik/jsx-runtime';
import type {
  FieldArrayPath,
  FieldElement,
  FieldPath,
  FieldPathValue,
  FieldType,
  FieldValues,
  Maybe,
  MaybeArray,
  MaybeValue,
  PartialKey,
  ResponseData,
  ValidateField,
} from '@modular-forms/core';
import {
  getElementInput,
  getFieldStore,
  updateFieldValue,
  validateIfRequired,
} from '@modular-forms/core';
import type { FieldStore, FormStore } from '../types';
import { Lifecycle } from './Lifecycle';

/**
 * Value type of the field element props.
 */
export type FieldElementProps<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues>
> = {
  name: TFieldName;
  autoFocus: boolean;
  ref: PropFunction<(element: Element) => void>;
  onInput$: PropFunction<(event: Event, element: FieldElement) => void>;
  onChange$: PropFunction<
    (event: QwikChangeEvent<FieldElement>, element: FieldElement) => void
  >;
  onBlur$: PropFunction<
    (event: QwikFocusEvent<FieldElement>, element: FieldElement) => void
  >;
};

/**
 * Value type of the field props.
 */
export type FieldProps<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData,
  TFieldName extends FieldPath<TFieldValues>,
  TFieldArrayName extends FieldArrayPath<TFieldValues>
> = {
  of: FormStore<TFieldValues, TResponseData, TFieldName, TFieldArrayName>;
  name: TFieldName;
  type: FieldType<FieldPathValue<TFieldValues, TFieldName>>;
  children: (
    store: FieldStore<TFieldValues, TFieldName>,
    props: FieldElementProps<TFieldValues, TFieldName>
  ) => JSX.Element;
  validate?: Maybe<
    MaybeArray<QRL<ValidateField<FieldPathValue<TFieldValues, TFieldName>>>>
  >;
  keepActive?: Maybe<boolean>;
  keepState?: Maybe<boolean>;
  key?: Maybe<string | number>;
};

/**
 * Headless form field that provides reactive properties and state.
 */
export function Field<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData,
  TFieldName extends FieldPath<TFieldValues>,
  TFieldArrayName extends FieldArrayPath<TFieldValues>
>({
  children,
  name,
  type,
  ...props
}: FieldPathValue<TFieldValues, TFieldName> extends MaybeValue<string>
  ? PartialKey<
      FieldProps<TFieldValues, TResponseData, TFieldName, TFieldArrayName>,
      'type'
    >
  : FieldProps<
      TFieldValues,
      TResponseData,
      TFieldName,
      TFieldArrayName
    >): JSX.Element {
  // Destructure props
  const { of: form } = props;

  // Get store of specified field
  const field = getFieldStore(form, name) as FieldStore<
    TFieldValues,
    TFieldName
  >;

  return (
    <Lifecycle key={name} store={field} {...props}>
      {children(field, {
        name,
        autoFocus: isServer && !!field.error,
        ref: $((element: Element) => {
          field.internal.elements.push(element as FieldElement);
        }),
        onInput$: $((_: Event, element: FieldElement) => {
          updateFieldValue(
            {},
            form,
            field,
            name,
            getElementInput(element, field, type, noSerialize)
          );
        }),
        onChange$: $(() => {
          validateIfRequired({}, form, field, name, {
            on: ['change'],
          });
        }),
        onBlur$: $(() => {
          field.touched = true;
          form.touched = true;
          validateIfRequired({}, form, field, name, {
            on: ['touched', 'blur'],
          });
        }),
      })}
    </Lifecycle>
  );
}

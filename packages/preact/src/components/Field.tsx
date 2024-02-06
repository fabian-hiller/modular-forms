import { effect, type ReadonlySignal } from '@preact/signals';
import type { ComponentChild, RefCallback } from 'preact';
import { useMemo } from 'preact/hooks';
import type { JSX } from 'preact/jsx-runtime';
import { useLifecycle, useLiveSignal } from '../hooks';
import type {
  FieldElement,
  FieldPath,
  FieldPathValue,
  FieldType,
  FieldValue,
  FieldValues,
  FormStore,
  Maybe,
  MaybeArray,
  MaybeValue,
  PartialKey,
  ResponseData,
  TransformField,
  ValidateField,
} from '../types';
import {
  getElementInput,
  handleFieldEvent,
  initializeFieldStore,
} from '../utils';
import { setValue } from '../methods/setValue';
import type { SetValueOptions } from '../methods/setValue';

/**
 * Value type ot the field store.
 */
export type FieldStore<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues>
> = {
  name: TFieldName;
  value: ReadonlySignal<Maybe<FieldPathValue<TFieldValues, TFieldName>>>;
  error: ReadonlySignal<string>;
  active: ReadonlySignal<boolean>;
  touched: ReadonlySignal<boolean>;
  dirty: ReadonlySignal<boolean>;
};

/**
 * Value type of the field element props.
 */
export type FieldElementProps<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues>
> = {
  name: TFieldName;
  ref: RefCallback<FieldElement>;
  onInput: JSX.GenericEventHandler<FieldElement>;
  onChange: JSX.GenericEventHandler<FieldElement>;
  onBlur: JSX.FocusEventHandler<FieldElement>;
  onData: (data: FieldValue, options?: SetValueOptions) => void;
};

/**
 * Value type of the field props.
 */
export type FieldProps<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData,
  TFieldName extends FieldPath<TFieldValues>
> = {
  of: FormStore<TFieldValues, TResponseData>;
  name: TFieldName;
  type: FieldType<FieldPathValue<TFieldValues, TFieldName>>;
  children: (
    store: FieldStore<TFieldValues, TFieldName>,
    props: FieldElementProps<TFieldValues, TFieldName>
  ) => ComponentChild;
  validate?: Maybe<
    MaybeArray<ValidateField<FieldPathValue<TFieldValues, TFieldName>>>
  >;
  transform?: Maybe<
    MaybeArray<TransformField<FieldPathValue<TFieldValues, TFieldName>>>
  >;
  keepActive?: boolean;
  keepState?: boolean;
};

/**
 * Headless form field that provides reactive properties and state.
 */
export function Field<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData,
  TFieldName extends FieldPath<TFieldValues>
>({
  children,
  type,
  ...props
}: FieldPathValue<TFieldValues, TFieldName> extends MaybeValue<string>
  ? PartialKey<FieldProps<TFieldValues, TResponseData, TFieldName>, 'type'>
  : FieldProps<TFieldValues, TResponseData, TFieldName>): JSX.Element {
  // Destructure props
  const { of: form, name } = props;

  // Get store of specified field
  const field = useMemo(() => initializeFieldStore(form, name), [form, name]);

  // Use lifecycle of field
  useLifecycle({ ...props, store: field });

  // Create readonly live signals
  // https://github.com/preactjs/signals/issues/361
  const value = useLiveSignal(field.value);
  const error = useLiveSignal(field.error);
  const active = useLiveSignal(field.active);
  const touched = useLiveSignal(field.touched);
  const dirty = useLiveSignal(field.dirty);

  return (
    <>
      {children(
        useMemo(
          () => ({
            name,
            value,
            error,
            active,
            touched,
            dirty,
          }),
          // eslint-disable-next-line react-hooks/exhaustive-deps
          [name]
        ),
        useMemo(
          () => ({
            name,
            ref(element) {
              if (element) {
                // Add element to elements
                field.elements.value = [...field.elements.value, element];

                // Create effect that replaces initial input and input of field with
                // initial input of element if both is "undefined", so that dirty
                // state also resets to "false" when user removes input
                effect(() => {
                  if (
                    element.type !== 'radio' &&
                    field.startValue.value === undefined &&
                    field.value.peek() === undefined
                  ) {
                    const input = getElementInput(element, field, type);
                    field.startValue.value = input;
                    field.value.value = input;
                  }
                });
              }
            },
            onInput(event) {
              handleFieldEvent(
                form,
                field,
                name,
                event,
                ['touched', 'input'],
                getElementInput(event.currentTarget, field, type)
              );
            },
            onChange(event) {
              handleFieldEvent(form, field, name, event, ['change']);
            },
            onBlur(event) {
              handleFieldEvent(form, field, name, event, ['touched', 'blur']);
            },
            onData(data, options) {
              setValue(form, name, data, options);
            }
          }),
          [field, form, name, type]
        )
      )}
    </>
  );
}

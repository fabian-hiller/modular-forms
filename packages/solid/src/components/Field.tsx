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
  handleLifecycle,
  updateFieldValue,
  validateIfRequired,
} from '@modular-forms/core';
import {
  batch,
  createEffect,
  createMemo,
  type JSX,
  untrack,
  onCleanup,
} from 'solid-js';
import type { FieldStore, FormStore } from '../types';
import { initializeFieldStore } from '../utils';

/**
 * Value type of the field element props.
 */
export type FieldElementProps<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues>
> = {
  name: TFieldName;
  autoFocus: boolean;
  ref: (element: FieldElement) => void;
  onInput: JSX.EventHandler<FieldElement, InputEvent>;
  onChange: JSX.EventHandler<FieldElement, Event>;
  onBlur: JSX.EventHandler<FieldElement, FocusEvent>;
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
    MaybeArray<ValidateField<FieldPathValue<TFieldValues, TFieldName>>>
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
  TFieldName extends FieldPath<TFieldValues>,
  TFieldArrayName extends FieldArrayPath<TFieldValues>
>(
  props: FieldPathValue<TFieldValues, TFieldName> extends MaybeValue<string>
    ? PartialKey<
        FieldProps<TFieldValues, TResponseData, TFieldName, TFieldArrayName>,
        'type'
      >
    : FieldProps<TFieldValues, TResponseData, TFieldName, TFieldArrayName>
): JSX.Element {
  // Get store of specified field
  const getField = createMemo(() => initializeFieldStore(props.of, props.name));

  // Create lifecycle of field
  createEffect(() => {
    handleLifecycle({ store: getField(), ...props }, onCleanup);
  });

  return (
    <>
      {props.children(getField(), {
        name: props.name,
        autoFocus: !!getField().error,
        ref(element) {
          getField().internal.elements.push(element);

          // Create effect that replaces initial input and input of field with
          // initial input of element if both is "undefined", so that dirty
          // state also resets to "false" when user removes input
          createEffect(() => {
            if (
              getField().internal.startValue === undefined &&
              untrack(() => getField().value) === undefined
            ) {
              const input = getElementInput(element, getField(), props.type);
              getField().internal.startValue = input;
              getField().value = input;
            }
          });
        },
        onInput({ currentTarget }) {
          updateFieldValue(
            props.of,
            getField(),
            props.name,
            getElementInput(currentTarget, getField(), props.type)
          );
        },
        onChange() {
          validateIfRequired(props.of, getField(), props.name, {
            on: ['change'],
          });
        },
        onBlur() {
          batch(() => {
            getField().touched = true;
            props.of.touched = true;
            validateIfRequired(props.of, getField(), props.name, {
              on: ['touched', 'blur'],
            });
          });
        },
      })}
    </>
  );
}

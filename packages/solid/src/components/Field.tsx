import {
  createEffect,
  createMemo,
  type JSX,
  untrack,
  mergeProps,
} from 'solid-js';
import { createLifecycle } from '../primitives';
import type {
  FieldElement,
  FieldPath,
  FieldPathValue,
  FieldType,
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

/**
 * Value type ot the field store.
 */
export type FieldStore<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues>
> = {
  get name(): TFieldName;
  get value(): Maybe<FieldPathValue<TFieldValues, TFieldName>>;
  get error(): string;
  get active(): boolean;
  get touched(): boolean;
  get dirty(): boolean;
};

/**
 * Value type of the field element props.
 */
export type FieldElementProps<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues>
> = {
  get name(): TFieldName;
  get autoFocus(): boolean;
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
  TFieldName extends FieldPath<TFieldValues>
> = {
  of: FormStore<TFieldValues, TResponseData>;
  name: TFieldName;
  type: FieldType<FieldPathValue<TFieldValues, TFieldName>>;
  children: (
    store: FieldStore<TFieldValues, TFieldName>,
    props: FieldElementProps<TFieldValues, TFieldName>
  ) => JSX.Element;
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
>(
  props: FieldPathValue<TFieldValues, TFieldName> extends MaybeValue<string>
    ? PartialKey<FieldProps<TFieldValues, TResponseData, TFieldName>, 'type'>
    : FieldProps<TFieldValues, TResponseData, TFieldName>
): JSX.Element {
  // Get store of specified field
  const getField = createMemo(() => initializeFieldStore(props.of, props.name));

  // Create lifecycle of field
  // eslint-disable-next-line solid/reactivity
  createLifecycle(mergeProps({ getStore: getField }, props));

  return (
    <>
      {props.children(
        {
          get name() {
            return props.name;
          },
          get value() {
            return getField().getValue();
          },
          get error() {
            return getField().getError();
          },
          get active() {
            return getField().getActive();
          },
          get touched() {
            return getField().getTouched();
          },
          get dirty() {
            return getField().getDirty();
          },
        },
        {
          get name() {
            return props.name;
          },
          get autoFocus() {
            return !!getField().getError();
          },
          ref(element) {
            // Add element to elements
            getField().setElements((elements) => [...elements, element]);

            // Create effect that replaces initial input and input of field with
            // initial input of element if both is "undefined", so that dirty
            // state also resets to "false" when user removes input
            createEffect(() => {
              if (
                getField().getStartValue() === undefined &&
                untrack(getField().getValue) === undefined
              ) {
                const input = getElementInput(element, getField(), props.type);
                getField().setStartValue(() => input);
                getField().setValue(() => input);
              }
            });
          },
          onInput(event) {
            handleFieldEvent(
              props.of,
              getField(),
              props.name,
              event,
              ['touched', 'input'],
              getElementInput(event.currentTarget, getField(), props.type)
            );
          },
          onChange(event) {
            handleFieldEvent(props.of, getField(), props.name, event, [
              'change',
            ]);
          },
          onBlur(event) {
            handleFieldEvent(props.of, getField(), props.name, event, [
              'touched',
              'blur',
            ]);
          },
        }
      )}
    </>
  );
}

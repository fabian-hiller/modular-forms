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
} from '../types/index.js';
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
  get autofocus(): boolean;
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
            return getField().value.get();
          },
          get error() {
            return getField().error.get();
          },
          get active() {
            return getField().active.get();
          },
          get touched() {
            return getField().touched.get();
          },
          get dirty() {
            return getField().dirty.get();
          },
        },
        {
          get name() {
            return props.name;
          },
          get autofocus() {
            return !!getField().error.get();
          },
          ref(element) {
            // Add element to elements
            getField().elements.set((elements) => [...elements, element]);

            // Create effect that replaces initial input and input of field with
            // initial input of element if both is "undefined", so that dirty
            // state also resets to "false" when user removes input
            createEffect(() => {
              if (
                element.type !== 'radio' &&
                getField().startValue.get() === undefined &&
                untrack(getField().value.get) === undefined
              ) {
                const input = getElementInput(element, getField(), props.type);
                getField().startValue.set(() => input);
                getField().value.set(() => input);
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

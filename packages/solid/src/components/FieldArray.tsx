import { createMemo, mergeProps, type JSX } from 'solid-js';
import { createLifecycle } from '../primitives';
import type {
  FieldArrayPath,
  FieldValues,
  FormStore,
  Maybe,
  MaybeArray,
  ResponseData,
  ValidateFieldArray,
} from '../types';
import { initializeFieldArrayStore } from '../utils';

/**
 * Value type ot the field store.
 */
export type FieldArrayStore<
  TFieldValues extends FieldValues,
  TFieldArrayName extends FieldArrayPath<TFieldValues>
> = {
  get name(): TFieldArrayName;
  get items(): number[];
  get error(): string;
  get active(): boolean;
  get touched(): boolean;
  get dirty(): boolean;
};

/**
 * Value type of the field array props.
 */
export type FieldArrayProps<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData,
  TFieldArrayName extends FieldArrayPath<TFieldValues>
> = {
  of: FormStore<TFieldValues, TResponseData>;
  name: TFieldArrayName;
  children: (
    store: FieldArrayStore<TFieldValues, TFieldArrayName>
  ) => JSX.Element;
  validate?: Maybe<MaybeArray<ValidateFieldArray<number[]>>>;
  keepActive?: Maybe<boolean>;
  keepState?: Maybe<boolean>;
};

/**
 * Headless field array that provides reactive properties and state.
 */
export function FieldArray<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData,
  TFieldArrayName extends FieldArrayPath<TFieldValues>
>(
  props: FieldArrayProps<TFieldValues, TResponseData, TFieldArrayName>
): JSX.Element {
  // Get store of specified field array
  const getFieldArray = createMemo(() =>
    initializeFieldArrayStore(props.of, props.name)
  );

  // Create lifecycle of field array
  // eslint-disable-next-line solid/reactivity
  createLifecycle(mergeProps({ getStore: getFieldArray }, props));

  return (
    <>
      {props.children({
        get name() {
          return props.name;
        },
        get items() {
          return getFieldArray().getItems();
        },
        get error() {
          return getFieldArray().getError();
        },
        get active() {
          return getFieldArray().getActive();
        },
        get touched() {
          return getFieldArray().getTouched();
        },
        get dirty() {
          return getFieldArray().getDirty();
        },
      })}
    </>
  );
}

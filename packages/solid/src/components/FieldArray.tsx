import type {
  FieldArrayPath,
  FieldValues,
  Maybe,
  MaybeArray,
  ResponseData,
  ValidateFieldArray,
} from '@modular-forms/core';
import { handleLifecycle } from '@modular-forms/core';
import {
  batch,
  createEffect,
  createMemo,
  mergeProps,
  onCleanup as cleanup,
  untrack,
  type JSX,
} from 'solid-js';
import type { FieldArrayStore, FormStore } from '../types';
import { initializeFieldArrayStore } from '../utils';

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
    // name: TFieldArrayName
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

  // Create lifecycle of field
  createEffect(() =>
    handleLifecycle(
      { batch, untrack, cleanup },
      // eslint-disable-next-line solid/reactivity
      mergeProps({ store: getFieldArray() }, props)
    )
  );

  return <>{props.children(getFieldArray())}</>;
}

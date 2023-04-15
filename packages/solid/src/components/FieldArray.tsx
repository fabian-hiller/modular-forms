import type {
  FieldArrayPath,
  FieldPath,
  FieldValues,
  MaybeArray,
  ResponseData,
  ValidateFieldArray,
} from '@modular-forms/core';
import { handleLifecycle } from '@modular-forms/core';
import {
  createEffect,
  createMemo,
  onCleanup as cleanup,
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
  TFieldName extends FieldPath<TFieldValues>,
  TFieldArrayName extends FieldArrayPath<TFieldValues>
> = {
  of: FormStore<TFieldValues, TResponseData, TFieldName, TFieldArrayName>;
  name: TFieldArrayName;
  children: (
    fieldArray: FieldArrayStore<TFieldValues, TFieldArrayName>
  ) => JSX.Element;
  validate?: MaybeArray<ValidateFieldArray<number[]>>;
  keepActive?: boolean;
  keepState?: boolean;
};

/**
 * Headless field array that provides reactive properties and state.
 */
export function FieldArray<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData,
  TFieldName extends FieldPath<TFieldValues>,
  TFieldArrayName extends FieldArrayPath<TFieldValues>
>(
  props: FieldArrayProps<
    TFieldValues,
    TResponseData,
    TFieldName,
    TFieldArrayName
  >
): JSX.Element {
  // Get store of specified field array
  const getFieldArray = createMemo(() =>
    initializeFieldArrayStore(props.of, props.name)
  );

  // Create lifecycle of field
  createEffect(() => {
    handleLifecycle({ cleanup }, { store: getFieldArray(), ...props });
  });

  return <>{props.children(getFieldArray())}</>;
}

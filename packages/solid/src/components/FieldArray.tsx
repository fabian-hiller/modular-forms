import {
  FieldArrayPath,
  FieldPath,
  FieldValues,
  MaybeArray,
  ResponseData,
  ValidateFieldArray,
} from '@modular-forms/shared';
import { createMemo, JSX } from 'solid-js';
import { createLifecycle } from '../primitives';
import { FieldArrayStore, FieldValue, FormStore } from '../types';
import { getFieldArrayStore } from '../utils';

export type FieldArrayProps<
  TFieldValues extends FieldValues<FieldValue>,
  TResponseData extends ResponseData,
  TFieldName extends FieldPath<TFieldValues, FieldValue>,
  TFieldArrayName extends FieldArrayPath<TFieldValues, FieldValue>
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
  TFieldValues extends FieldValues<FieldValue>,
  TResponseData extends ResponseData,
  TFieldName extends FieldPath<TFieldValues, FieldValue>,
  TFieldArrayName extends FieldArrayPath<TFieldValues, FieldValue>
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
    getFieldArrayStore(props.of, props.name)
  );

  // Create lifecycle of field array
  createLifecycle(props, getFieldArray);

  return <>{props.children(getFieldArray())}</>;
}

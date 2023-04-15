import type { FieldValues, FieldStore } from './field';
import type { FieldArrayStore } from './fieldArray';
import type { ResponseData, FormStore } from './form';
import type { FieldPath, FieldArrayPath } from './path';

/**
 * Value type of the initialize store dependencies.
 */
export type InitializeStoreDeps<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData
> = {
  initializeFieldStore: <TFieldName extends FieldPath<TFieldValues>>(
    form: FormStore<TFieldValues, TResponseData>,
    name: TFieldName
  ) => FieldStore<TFieldValues, TFieldName>;
  initializeFieldArrayStore: <
    TFieldArrayName extends FieldArrayPath<TFieldValues>
  >(
    form: FormStore<TFieldValues, TResponseData>,
    name: TFieldArrayName
  ) => FieldArrayStore<TFieldValues, TFieldArrayName>;
};

/**
 * Value type of the reactivity dependencies.
 */
export type ReactivityDeps = Partial<{
  batch: <T>(fn: () => T) => T;
  untrack: <T>(fn: () => T) => T;
}>;

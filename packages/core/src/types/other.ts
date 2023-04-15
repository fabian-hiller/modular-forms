import type { FieldValues, FieldStore } from './field';
import type { FieldArrayStore } from './fieldArray';
import type { ResponseData, FormStore } from './form';
import type { FieldPath, FieldArrayPath } from './path';

/**
 * Value type of the initialize store dependencies.
 */
export type InitializeStoreDeps<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData,
  TFieldName extends FieldPath<TFieldValues>,
  TFieldArrayName extends FieldArrayPath<TFieldValues>
> = {
  initializeFieldStore: (
    form: FormStore<TFieldValues, TResponseData, TFieldName, TFieldArrayName>,
    name: TFieldName
  ) => FieldStore<TFieldValues, TFieldName>;
  initializeFieldArrayStore: (
    form: FormStore<TFieldValues, TResponseData, TFieldName, TFieldArrayName>,
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

import type {
  FieldArrayPath,
  FieldArrayStore as FieldArrayStoreType,
  FieldValues,
  InternalFieldArrayStore,
  ValidateFieldArray,
} from '@modular-forms/core';

/**
 * Value type ot the field array store.
 */
export type FieldArrayStore<
  TFieldValues extends FieldValues,
  TFieldArrayName extends FieldArrayPath<TFieldValues>
> = Omit<FieldArrayStoreType<TFieldValues, TFieldArrayName>, 'internal'> & {
  internal: Omit<InternalFieldArrayStore, 'validate'> & {
    validate: ValidateFieldArray<number[]>[];
  };
};

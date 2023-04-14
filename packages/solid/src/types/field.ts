import type {
  FieldPath,
  FieldPathValue,
  FieldValues,
  FieldStore as FieldStoreType,
  InternalFieldStore,
  ValidateField,
} from '@modular-forms/core';

/**
 * Value type ot the field store.
 */
export type FieldStore<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues>
> = Omit<FieldStoreType<TFieldValues, TFieldName>, 'internal'> & {
  internal: Omit<InternalFieldStore<TFieldValues, TFieldName>, 'validate'> & {
    validate: ValidateField<FieldPathValue<TFieldValues, TFieldName>>[];
  };
};

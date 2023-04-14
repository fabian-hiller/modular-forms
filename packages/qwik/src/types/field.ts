import type { QRL } from '@builder.io/qwik';
import type {
  FieldPath,
  FieldPathValue,
  FieldValues,
  FieldStore as FieldStoreType,
  InternalFieldStore,
  ValidateField,
} from '@modular-forms/shared';

/**
 * Value type ot the field store.
 */
export type FieldStore<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues>
> = Omit<FieldStoreType<TFieldValues, TFieldName>, 'internal'> & {
  internal: Omit<InternalFieldStore<TFieldValues, TFieldName>, 'validate'> & {
    validate: QRL<ValidateField<FieldPathValue<TFieldValues, TFieldName>>>[];
  };
};

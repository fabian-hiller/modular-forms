import type {
  FieldArrayPath,
  FieldPath,
  FieldValues,
  FormStore as FormStoreType,
  InternalFormStore,
  Maybe,
  PartialValues,
  ResponseData,
  ValidateForm,
  ValidationMode,
} from '@modular-forms/core';

/**
 * Value type of the form options.
 */
export type FormOptions<TFieldValues extends FieldValues> = Partial<{
  initialValues: PartialValues<TFieldValues>;
  validateOn: ValidationMode;
  revalidateOn: ValidationMode;
  validate: ValidateForm<TFieldValues>;
}>;

/**
 * Value type of the form store.
 */
export type FormStore<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData
> = Omit<FormStoreType<TFieldValues, TResponseData>, 'internal'> & {
  internal: Omit<
    InternalFormStore<TFieldValues>,
    'initialValues' | 'fieldNames' | 'fieldArrayNames' | 'validate'
  > & {
    initialValues: PartialValues<TFieldValues>;
    fieldNames: FieldPath<TFieldValues>[];
    fieldArrayNames: FieldArrayPath<TFieldValues>[];
    validate: Maybe<ValidateForm<TFieldValues>>;
  };
};

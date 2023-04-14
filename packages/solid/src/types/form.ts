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
  TResponseData extends ResponseData,
  TFieldName extends FieldPath<TFieldValues>,
  TFieldArrayName extends FieldArrayPath<TFieldValues>
> = Omit<
  FormStoreType<TFieldValues, TResponseData, TFieldName, TFieldArrayName>,
  'internal'
> & {
  internal: Omit<
    InternalFormStore<TFieldValues, TFieldName, TFieldArrayName>,
    'initialValues' | 'fieldNames' | 'fieldArrayNames' | 'validate'
  > & {
    initialValues: PartialValues<TFieldValues>;
    fieldNames: TFieldName[];
    fieldArrayNames: TFieldArrayName[];
    validate: Maybe<ValidateForm<TFieldValues>>;
  };
};

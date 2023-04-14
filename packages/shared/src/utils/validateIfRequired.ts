import type {
  FieldArrayPath,
  FieldArrayStore,
  FieldPath,
  FieldStore,
  FieldValues,
  FormStore,
  Maybe,
  ResponseData,
  ValidationMode,
} from '../types';
import { validate } from '../methods';

type ValidateOptions = {
  on: Exclude<ValidationMode, 'submit'>[];
  shouldFocus?: Maybe<boolean>;
};

/**
 * Validates a field or field array only if required.
 *
 * @param form The form of the field or field array.
 * @param fieldOrFieldArray The store of the field or field array.
 * @param name The name of the field or field array.
 * @param options The validate options.
 */
export function validateIfRequired<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData,
  TFieldName extends FieldPath<TFieldValues>,
  TFieldArrayName extends FieldArrayPath<TFieldValues>
>(
  form: FormStore<TFieldValues, TResponseData, TFieldName, TFieldArrayName>,
  fieldOrFieldArray:
    | FieldStore<TFieldValues, TFieldName>
    | FieldArrayStore<TFieldValues, TFieldArrayName>,
  name: TFieldName | TFieldArrayName,
  options: ValidateOptions
): void {
  // Destructure options
  const { on: modes, shouldFocus = false } = options;

  // Validate only if validation mode matches
  if (
    (modes as string[]).includes(
      (
        form.internal.validateOn === 'submit'
          ? form.submitted
          : fieldOrFieldArray.error
      )
        ? form.internal.revalidateOn
        : form.internal.validateOn
    )
  ) {
    validate(form, name, { shouldFocus });
  }
}

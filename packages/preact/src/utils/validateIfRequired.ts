import type {
  FieldArrayPath,
  FieldPath,
  FieldValues,
  FormStore,
  InternalFieldArrayStore,
  InternalFieldStore,
  Maybe,
  ResponseData,
  ValidationMode,
} from '../types';
import { validate } from '../methods';

/**
 * Value type of the validate otions.
 */
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
  form: FormStore<TFieldValues, TResponseData>,
  fieldOrFieldArray:
    | InternalFieldStore<TFieldValues, TFieldName>
    | InternalFieldArrayStore,
  name: TFieldName | TFieldArrayName,
  { on: modes, shouldFocus = false }: ValidateOptions
): void {
  const validateOn = fieldOrFieldArray.validateOn ?? form.internal.validateOn;
  const revalidateOn =
    fieldOrFieldArray.revalidateOn ?? form.internal.revalidateOn;
  if (
    (modes as string[]).includes(
      (
        validateOn === 'submit'
          ? form.submitted.peek()
          : fieldOrFieldArray.error.peek()
      )
        ? revalidateOn
        : validateOn
    )
  ) {
    validate(form, name, { shouldFocus });
  }
}

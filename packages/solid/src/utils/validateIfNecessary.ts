import { untrack } from 'solid-js';
import { validate } from '../methods';
import {
  FieldArrayPath,
  FieldPath,
  FieldValues,
  FormState,
  ValidationMode,
} from '../types';

type ValidateOptions = {
  on: ValidationMode;
  shouldFocus?: boolean;
};

/**
 * Validates a field or field array only if necessary.
 *
 * @param form The form that contains the field or field array.
 * @param name The name of the field or field array to be validated.
 */
export function validateIfNecessary<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues>,
  TFieldArrayName extends FieldArrayPath<TFieldValues>
>(
  form: FormState<TFieldValues>,
  name: TFieldName | TFieldArrayName,
  options: ValidateOptions
): void {
  // Ignores tracking of reactive dependencies
  untrack(() => {
    // Destructure options
    const { on: mode, shouldFocus = false } = options;

    // Validate only if validation mode matches
    if (
      (!form.submitted && form.internal.validateOn === mode) ||
      (form.submitted && form.internal.revalidateOn === mode)
    ) {
      validate(form, name, { shouldFocus });
    }
  });
}

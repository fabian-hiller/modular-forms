import { untrack } from 'solid-js';
import { validate } from '../methods';
import {
  FieldArrayPath,
  FieldArrayStore,
  FieldPath,
  FieldStore,
  FieldValues,
  FormState,
  ValidationMode,
} from '../types';

type ValidateOptions = {
  on: Exclude<ValidationMode, 'submit'>[];
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
  field: FieldStore<TFieldValues, TFieldName> | FieldArrayStore,
  name: TFieldName | TFieldArrayName,
  options: ValidateOptions
): void {
  // Ignores tracking of reactive dependencies
  untrack(() => {
    // Destructure options
    const { on: modes, shouldFocus = false } = options;

    // Validate only if validation mode matches
    if (
      (modes as string[]).includes(
        (
          form.internal.validateOn === 'submit'
            ? form.submitted
            : field.getError()
        )
          ? form.internal.revalidateOn
          : form.internal.validateOn
      )
    ) {
      validate(form, name, { shouldFocus });
    }
  });
}

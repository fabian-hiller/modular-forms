import type { ZodType } from 'zod';
import type {
  FieldArrayPath,
  FieldPath,
  FieldValues,
  FormErrors,
  PartialValues,
  ValidateForm,
} from '../types';

/**
 * Creates a validation functions that parses the Zod schema of a form.
 *
 * @param schema A Zod schema.
 *
 * @returns A validation function.
 */
export function zodForm<TFieldValues extends FieldValues>(
  schema: ZodType<any, any, TFieldValues>
): ValidateForm<TFieldValues> {
  return (values: PartialValues<TFieldValues>) => {
    const result = schema.safeParse(values);
    return result.success
      ? {}
      : result.error.issues.reduce<FormErrors<TFieldValues>>(
          (errors, error) => {
            const path = error.path.join('.') as
              | FieldPath<TFieldValues>
              | FieldArrayPath<TFieldValues>;
            if (!errors[path]) {
              errors[path] = error.message;
            }
            return errors;
          },
          {}
        );
  };
}

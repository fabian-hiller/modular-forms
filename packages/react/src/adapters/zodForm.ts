import type { ZodType } from 'zod';
import type {
  FieldValues,
  ValidateForm,
  PartialValues,
  FormErrors,
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
  return async (values: PartialValues<TFieldValues>) => {
    const result = await schema.safeParseAsync(values);
    const formErrors: Record<string, string> = {};
    if (!result.success) {
      for (const issue of result.error.issues) {
        const path = issue.path.join('.');
        if (!formErrors[path]) {
          formErrors[path] = issue.message;
        }
      }
    }
    return formErrors as FormErrors<TFieldValues>;
  };
}

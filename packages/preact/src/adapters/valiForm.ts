import {
  type GenericSchema,
  type GenericSchemaAsync,
  getDotPath,
  safeParseAsync,
} from 'valibot';
import type {
  FieldValues,
  ValidateForm,
  PartialValues,
  FormErrors,
} from '../types';

/**
 * Creates a validation functions that parses the Valibot schema of a form.
 *
 * @param schema A Valibot schema.
 *
 * @returns A validation function.
 */
export function valiForm<TFieldValues extends FieldValues>(
  schema: GenericSchema | GenericSchemaAsync
): ValidateForm<TFieldValues> {
  return async (values: PartialValues<TFieldValues>) => {
    const result = await safeParseAsync(schema, values, {
      abortPipeEarly: true,
    });
    const formErrors: Record<string, string> = {};
    if (result.issues) {
      for (const issue of result.issues) {
        formErrors[getDotPath(issue)!] = issue.message;
      }
    }
    return formErrors as FormErrors<TFieldValues>;
  };
}

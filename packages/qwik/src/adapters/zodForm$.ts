import { $, implicit$FirstArg, type QRL } from '@builder.io/qwik';
import type { ZodType } from 'zod';
import type {
  FieldValues,
  MaybeFunction,
  ValidateForm,
  PartialValues,
  FormErrors,
} from '../types';
import { getParsedZodSchema } from '../utils';

/**
 * See {@link zodForm$}
 */
export function zodFormQrl<TFieldValues extends FieldValues>(
  schema: QRL<MaybeFunction<ZodType<any, any, TFieldValues>>>
): QRL<ValidateForm<TFieldValues>> {
  return $(async (values: PartialValues<TFieldValues>) => {
    const result = await getParsedZodSchema(schema, values);
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
  });
}

/**
 * Creates a validation functions that parses the Zod schema of a form.
 *
 * @param schema A Zod schema.
 *
 * @returns A validation function.
 */
export const zodForm$ = implicit$FirstArg(zodFormQrl);

import type { ZodType } from 'zod';
import type {
  FieldValues,
  MaybeQRL,
  MaybeFunction,
  ValidateForm,
  PartialValues,
  FormErrors,
} from '../types';
import { getParsedZodSchema } from '../utils';

/**
 * Creates a validation functions that parses the Zod schema of a form.
 *
 * @param schema A Zod schema.
 *
 * @returns A validation function.
 */
export function zodForm<TFieldValues extends FieldValues>(
  schema: MaybeQRL<MaybeFunction<ZodType<any, any, TFieldValues>>>
): MaybeQRL<ValidateForm<TFieldValues>> {
  return async (values: PartialValues<TFieldValues>) => {
    const result = await getParsedZodSchema(schema, values);
    return result.success
      ? {}
      : (result.error.issues.reduce<any>((errors, error) => {
          const path = error.path.join('.');
          if (!errors[path]) {
            errors[path] = error.message;
          }
          return errors;
        }, {}) as FormErrors<TFieldValues>);
  };
}

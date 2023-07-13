import type { BaseSchema, BaseSchemaAsync, ValiError } from 'valibot';
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
  schema: BaseSchema<TFieldValues, any> | BaseSchemaAsync<TFieldValues, any>
): ValidateForm<TFieldValues> {
  return async (values: PartialValues<TFieldValues>) => {
    try {
      await schema.parse(values);
      return {};
    } catch (error) {
      return (error as ValiError).issues.reduce<FormErrors<TFieldValues>>(
        (errors, issue) => ({
          ...errors,
          [issue.path!.map(({ key }) => key).join('.')]: issue.message,
        }),
        {}
      );
    }
  };
}

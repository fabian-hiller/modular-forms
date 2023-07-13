import { $, implicit$FirstArg, type QRL } from '@builder.io/qwik';
import type { BaseSchema, BaseSchemaAsync, ValiError } from 'valibot';
import type {
  FieldValues,
  MaybeFunction,
  ValidateForm,
  PartialValues,
  FormErrors,
} from '../types';

/**
 * See {@link valiForm$}
 */
export function valiFormQrl<TFieldValues extends FieldValues>(
  schema: QRL<
    MaybeFunction<
      BaseSchema<TFieldValues, any> | BaseSchemaAsync<TFieldValues, any>
    >
  >
): QRL<ValidateForm<TFieldValues>> {
  return $(async (values: PartialValues<TFieldValues>) => {
    try {
      const resolvedSchema = await schema.resolve();
      await (typeof resolvedSchema === 'function'
        ? resolvedSchema()
        : resolvedSchema
      ).parse(values);
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
  });
}

/**
 * Creates a validation functions that parses the Valibot schema of a form.
 *
 * @param schema A Valibot schema.
 *
 * @returns A validation function.
 */
export const valiForm$ = implicit$FirstArg(valiFormQrl);

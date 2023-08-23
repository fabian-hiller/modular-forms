import { $, implicit$FirstArg, type QRL } from '@builder.io/qwik';
import type { BaseSchema, BaseSchemaAsync } from 'valibot';
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
    const resolvedSchema = await schema.resolve();
    const result = await (typeof resolvedSchema === 'function'
      ? resolvedSchema()
      : resolvedSchema
    )._parse(values, { abortPipeEarly: true });
    return result.issues
      ? result.issues.reduce<FormErrors<TFieldValues>>(
          (errors, issue) => ({
            ...errors,
            [issue.path!.map(({ key }) => key).join('.')]: issue.message,
          }),
          {}
        )
      : {};
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

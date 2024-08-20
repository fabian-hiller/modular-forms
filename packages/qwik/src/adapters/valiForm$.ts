import { $, implicit$FirstArg, type QRL } from '@builder.io/qwik';
import {
  type GenericSchema,
  type GenericSchemaAsync,
  getDotPath,
  safeParseAsync,
} from 'valibot';
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
  schema: QRL<MaybeFunction<GenericSchema | GenericSchemaAsync>>,
  validater$?: QRL<
    (
      values: PartialValues<TFieldValues>,
      errors: FormErrors<TFieldValues>
    ) => Promise<void>
  >
): QRL<ValidateForm<TFieldValues>> {
  return $(async (values: PartialValues<TFieldValues>) => {
    const resolvedSchema = await schema.resolve();
    const result = await safeParseAsync(
      typeof resolvedSchema === 'function' ? resolvedSchema() : resolvedSchema,
      values,
      { abortPipeEarly: true }
    );
    const formErrors: Record<string, string> = {};
    if (result.issues) {
      for (const issue of result.issues) {
        formErrors[getDotPath(issue)!] = issue.message;
      }
    }
    if (validater$) {
      const varidater = await validater$.resolve();
      await varidater(values, formErrors);
    }
    return formErrors as FormErrors<TFieldValues>;
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

import { $, implicit$FirstArg, type QRL } from '@builder.io/qwik';
import type { BaseSchema, BaseSchemaAsync } from 'valibot';
import type { FieldValue, MaybeFunction, ValidateField, Maybe } from '../types';

/**
 * See {@link valiField$}
 */
export function valiFieldQrl<TFieldValue extends FieldValue>(
  schema: QRL<
    MaybeFunction<
      BaseSchema<TFieldValue, any> | BaseSchemaAsync<TFieldValue, any>
    >
  >
): QRL<ValidateField<TFieldValue>> {
  return $(async (value: Maybe<TFieldValue>) => {
    const resolvedSchema = await schema.resolve();
    const result = await (typeof resolvedSchema === 'function'
      ? resolvedSchema()
      : resolvedSchema
    )._parse(value, { abortPipeEarly: true });
    return result.issues?.[0].message || '';
  });
}

/**
 * Creates a validation functions that parses the Valibot schema of a field.
 *
 * @param schema A Valibot schema.
 *
 * @returns A validation function.
 */
export const valiField$ = implicit$FirstArg(valiFieldQrl);

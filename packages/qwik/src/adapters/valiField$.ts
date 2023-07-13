import { $, implicit$FirstArg, type QRL } from '@builder.io/qwik';
import type { BaseSchema, BaseSchemaAsync, ValiError } from 'valibot';
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
    try {
      const resolvedSchema = await schema.resolve();
      await (typeof resolvedSchema === 'function'
        ? resolvedSchema()
        : resolvedSchema
      ).parse(value);
      return '';
    } catch (error) {
      return (error as ValiError).message;
    }
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

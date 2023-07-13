import type { BaseSchema, BaseSchemaAsync, ValiError } from 'valibot';
import type { FieldValue, ValidateField, Maybe } from '../types';

/**
 * Creates a validation functions that parses the Valibot schema of a field.
 *
 * @param schema A Valibot schema.
 *
 * @returns A validation function.
 */
export function valiField<TFieldValue extends FieldValue>(
  schema: BaseSchema<TFieldValue, any> | BaseSchemaAsync<TFieldValue, any>
): ValidateField<TFieldValue> {
  return async (value: Maybe<TFieldValue>) => {
    try {
      await schema.parse(value);
      return '';
    } catch (error) {
      return (error as ValiError).message;
    }
  };
}

import type {
  FieldArrayPath,
  FieldPath,
  FieldValues,
  FormStore,
  RemoveOptions,
  ResponseData,
} from '@modular-forms/shared';
import { remove as removeMethod } from '@modular-forms/shared';
import { initializeFieldArrayStore, initializeFieldStore } from '../utils';

/**
 * Removes a item of the field array.
 *
 * @param form The form of the field array.
 * @param name The name of field array.
 * @param options The remove options.
 */
export function remove<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData,
  TFieldName extends FieldPath<TFieldValues>,
  TFieldArrayName extends FieldArrayPath<TFieldValues>
>(
  form: FormStore<TFieldValues, TResponseData, TFieldName, TFieldArrayName>,
  name: TFieldArrayName,
  options: RemoveOptions
): void {
  removeMethod(
    {
      initializeFieldStore,
      initializeFieldArrayStore,
    },
    form,
    name,
    options
  );
}

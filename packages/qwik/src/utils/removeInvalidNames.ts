import type {
  FieldArrayPath,
  FieldPath,
  FieldValues,
  FormStore,
  ResponseData,
} from '../types';
import { getFieldArrayNames } from './getFieldArrayNames';
import { getFieldArrayStore } from './getFieldArrayStore';
import { getPathIndex } from './getPathIndex';

/**
 * Removes invalid field or field array names of field arrays.
 *
 * @param form The form of the field array.
 * @param names The names to be filtered.
 */
export function removeInvalidNames<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData
>(
  form: FormStore<TFieldValues, TResponseData>,
  names: (FieldPath<TFieldValues> | FieldArrayPath<TFieldValues>)[]
) {
  getFieldArrayNames(form, false).forEach((fieldArrayName) => {
    const lastIndex =
      getFieldArrayStore(form, fieldArrayName)!.items.length - 1;
    names
      .filter(
        (name) =>
          name.startsWith(`${fieldArrayName}.`) &&
          getPathIndex(fieldArrayName, name) > lastIndex
      )
      .forEach((name) => {
        names.splice(names.indexOf(name), 1);
      });
  });
}

import type {
  FieldArrayPath,
  FieldArrayPathValue,
  FieldPath,
  FieldValues,
  FormStore,
  ResponseData,
} from '../types';
import { getUniqueId } from './getUniqueId';
import { setFieldArrayState } from './setFieldArrayState';
import { setFieldState } from './setFieldState';

/**
 * Value type of the value options.
 */
type ValueOptions<
  TFieldValues extends FieldValues,
  TFieldArrayName extends FieldArrayPath<TFieldValues>
> = {
  at: number;
  value: FieldArrayPathValue<TFieldValues, TFieldArrayName>[number];
};

/**
 * Sets the specified field array value to the corresponding field and field
 * array stores.
 *
 * @param form The form of the field array.
 * @param name The name of the field array.
 * @param options The value options.
 */
export function setFieldArrayValue<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData,
  TFieldArrayName extends FieldArrayPath<TFieldValues>
>(
  form: FormStore<TFieldValues, TResponseData>,
  name: TFieldArrayName,
  { at: index, value }: ValueOptions<TFieldValues, TFieldArrayName>
): void {
  // Create recursive function to update stores
  const updateStores = (prevPath: string, data: object) => {
    Object.entries(data).forEach(([path, value]) => {
      // Create new compound path
      const compoundPath = `${prevPath}.${path}`;

      // If it is a field array, update field array store
      if (
        form.internal.fieldArrayPaths?.includes(
          compoundPath.replace(/.\d+./g, '.$.') as any
        )
      ) {
        const items = value.map(() => getUniqueId());
        setFieldArrayState(form, compoundPath as FieldArrayPath<TFieldValues>, {
          startItems: [...items],
          items,
          error: '',
          touched: false,
          dirty: false,
        });

        // If it is a field, update field store
      } else if (
        !value ||
        typeof value !== 'object' ||
        Array.isArray(value) ||
        value instanceof Date ||
        value instanceof Blob
      ) {
        setFieldState(form, compoundPath as FieldPath<TFieldValues>, {
          startValue: value,
          value,
          error: '',
          touched: false,
          dirty: false,
        });
      }

      // If it is an object or array, update nested stores
      if (value && typeof value === 'object') {
        updateStores(compoundPath, value);
      }
    });
  };

  // Update store of field array index
  updateStores(name, { [index]: value });
}

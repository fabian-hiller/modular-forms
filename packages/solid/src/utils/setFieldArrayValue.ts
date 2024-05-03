import { batch } from 'solid-js';
import type {
  FieldArrayPath,
  FieldArrayPathValue,
  FieldPath,
  FieldValues,
  FormStore,
  ResponseData,
} from '../types/index.js';
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
  batch(() => {
    // Create recursive function to update stores
    const updateStores = (prevPath: string, data: object) => {
      Object.entries(data).forEach(([path, value]) => {
        // Create new compound path
        const compoundPath = `${prevPath}.${path}`;

        // Set field store if it could be a field value
        if (
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

        // Set field array store if it could be a field array value
        if (Array.isArray(value)) {
          const items = value.map(() => getUniqueId());
          setFieldArrayState(
            form,
            compoundPath as FieldArrayPath<TFieldValues>,
            {
              startItems: [...items],
              items,
              error: '',
              touched: false,
              dirty: false,
            }
          );
        }

        // Update nested stores if it is a field array or nested field
        if (value && typeof value === 'object') {
          updateStores(compoundPath, value);
        }
      });
    };

    // Update store of field array index
    updateStores(name, { [index]: value });
  });
}

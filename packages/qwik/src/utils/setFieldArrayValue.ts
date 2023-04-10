import type {
  FieldArrayPath,
  FieldArrayPathValue,
  FieldPath,
  FieldValues,
  ResponseData,
} from '@modular-forms/shared';
import type { FieldValue, FormStore } from '../types';
import { getUniqueId } from './getUniqueId';
import { setFieldArrayStore } from './setFieldArrayStore';
import { setFieldStore } from './setFieldStore';

type ValueOptions<
  TFieldValues extends FieldValues<FieldValue>,
  TFieldArrayName extends FieldArrayPath<TFieldValues, FieldValue>
> = {
  at: number;
  value: FieldArrayPathValue<TFieldValues, TFieldArrayName, FieldValue>[number];
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
  TFieldValues extends FieldValues<FieldValue>,
  TResponseData extends ResponseData,
  TFieldName extends FieldPath<TFieldValues, FieldValue>,
  TFieldArrayName extends FieldArrayPath<TFieldValues, FieldValue>
>(
  form: FormStore<TFieldValues, TResponseData, TFieldName, TFieldArrayName>,
  name: TFieldArrayName,
  options: ValueOptions<TFieldValues, TFieldArrayName>
): void {
  // Destructure options
  const { at: index, value } = options;

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
        value instanceof Blob
      ) {
        setFieldStore(form, compoundPath as TFieldName, {
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
        setFieldArrayStore(form, compoundPath as TFieldArrayName, {
          startItems: [...items],
          items,
          error: '',
          touched: false,
          dirty: false,
        });
      }

      // Update nested stores if it is a field array or nested field
      if (value && typeof value === 'object') {
        updateStores(compoundPath, value);
      }
    });
  };

  // Update store of field array index
  updateStores(name, { [index]: value });
}

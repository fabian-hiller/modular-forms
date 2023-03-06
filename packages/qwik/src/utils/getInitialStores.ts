import type {
  FieldArrayPath,
  FieldArraysStore,
  FieldPath,
  FieldsStore,
  FieldValues,
  FormLoader,
} from '../types';
import { getUniqueId } from './getUniqueId';

/**
 * Returns a tuple with the initial stores of the fields and field arrays.
 *
 * @param values The initial form values.
 *
 * @returns The initial stores tuple.
 */
export function getInitialStores<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues>,
  TFieldArrayName extends FieldArrayPath<TFieldValues>
>(
  values: FormLoader<TFieldValues>
): [
  FieldsStore<TFieldValues, TFieldName>,
  FieldArraysStore<TFieldValues, TFieldArrayName>
] {
  // Create recursive function to create initial stores
  const createInitialStores = (
    stores: [
      Partial<FieldsStore<TFieldValues, TFieldName>>,
      Partial<FieldArraysStore<TFieldValues, TFieldArrayName>>
    ],
    data: object,
    prevPath?: string
  ) =>
    Object.entries(data).reduce((stores, [path, value]) => {
      // Create new compound path
      const compoundPath = prevPath ? `${prevPath}.${path}` : path;

      // Add initial store of field
      if (!value || typeof value !== 'object' || Array.isArray(value)) {
        stores[0][compoundPath as TFieldName] = {
          internal: {
            initialValue: value,
            startValue: value,
            validate: [],
            elements: [],
            consumers: [],
          },
          name: compoundPath as TFieldName,
          value,
          error: '',
          active: false,
          touched: false,
          dirty: false,
        };
      }

      // Add initial store of field array
      if (Array.isArray(value)) {
        const items = value.map(() => getUniqueId());
        stores[1][compoundPath as TFieldArrayName] = {
          internal: {
            initialItems: [...items],
            startItems: [...items],
            validate: [],
            consumers: [],
          },
          name: compoundPath as TFieldArrayName,
          items,
          error: '',
          active: false,
          touched: false,
          dirty: false,
        };
      }

      // Add stores of nested fields and field arrays
      if (value && typeof value === 'object') {
        createInitialStores(stores, value, compoundPath);
      }

      // Return modified stores
      return stores;
    }, stores);

  // Create and return initial stores
  return createInitialStores([{}, {}], values) as [
    FieldsStore<TFieldValues, TFieldName>,
    FieldArraysStore<TFieldValues, TFieldArrayName>
  ];
}

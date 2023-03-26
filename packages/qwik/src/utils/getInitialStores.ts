import type { Signal } from '@builder.io/qwik';
import type { ActionStore } from '@builder.io/qwik-city';
import type {
  FieldArrayPath,
  FieldArraysStore,
  FieldPath,
  FieldsStore,
  FieldValues,
  FormActionStore,
  InitialValues,
  Maybe,
  PartialValues,
} from '../types';
import { getPathValue } from './getPathValue';
import { getUniqueId } from './getUniqueId';

/**
 * Returns a tuple with the initial stores of the fields and field arrays.
 *
 * @param loader The form loader.
 * @param action The form action.
 *
 * @returns The initial stores tuple.
 */
export function getInitialStores<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues>,
  TFieldArrayName extends FieldArrayPath<TFieldValues>
>(
  loader: Signal<InitialValues<TFieldValues>>,
  action?: Maybe<
    ActionStore<
      FormActionStore<TFieldValues>,
      PartialValues<TFieldValues>,
      true
    >
  >
): [
  FieldsStore<TFieldValues, TFieldName>,
  FieldArraysStore<TFieldValues, TFieldArrayName>
] {
  // Create function to get error of field
  const getError = (name: TFieldName | TFieldArrayName) =>
    action?.value?.errors[name] || '';

  // Create recursive function to create initial stores
  const createInitialStores = (
    stores: [
      Partial<FieldsStore<TFieldValues, TFieldName>>,
      Partial<FieldArraysStore<TFieldValues, TFieldArrayName>>
    ],
    data: object,
    prevPath?: Maybe<string>
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
          value:
            (action?.value?.values &&
              getPathValue(compoundPath as TFieldName, action.value.values)) ??
            value,
          error: getError(compoundPath as TFieldName),
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
          error: getError(compoundPath as TFieldArrayName),
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
  return createInitialStores([{}, {}], loader.value) as [
    FieldsStore<TFieldValues, TFieldName>,
    FieldArraysStore<TFieldValues, TFieldArrayName>
  ];
}

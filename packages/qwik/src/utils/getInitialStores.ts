import type { Signal } from '@builder.io/qwik';
import type { ActionStore } from '@builder.io/qwik-city';
import type {
  FieldArrayPath,
  FieldArrayPathValue,
  FieldArraysStore,
  FieldPath,
  FieldPathValue,
  FieldsStore,
  FieldValues,
  InitialValues,
  Maybe,
  PartialValues,
  ResponseData,
} from '@modular-forms/shared';
import { getPathValue, getUniqueId } from '@modular-forms/shared';
import type { FormActionStore } from '../types';
import { getInitialFieldArrayStore } from './getInitialFieldArrayStore';
import { getInitialFieldStore } from './getInitialFieldStore';

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
  TResponseData extends ResponseData,
  TFieldName extends FieldPath<TFieldValues>,
  TFieldArrayName extends FieldArrayPath<TFieldValues>
>(
  loader: Signal<InitialValues<TFieldValues>>,
  action?: Maybe<
    ActionStore<
      FormActionStore<TFieldValues, TResponseData>,
      PartialValues<TFieldValues>,
      true
    >
  >
): [
  FieldsStore<TFieldValues, TFieldName>,
  FieldArraysStore<TFieldValues, TFieldArrayName>
] {
  // Create function to get value of field or field array
  function getActionValue(
    name: TFieldName
  ): Maybe<FieldPathValue<TFieldValues, TFieldName>>;
  function getActionValue(
    name: TFieldArrayName
  ): Maybe<FieldArrayPathValue<TFieldValues, TFieldArrayName>>;
  function getActionValue(name: any): any {
    return action?.value?.values && getPathValue(name, action.value.values);
  }

  // Create function to generate array items
  const generateItems = () => getUniqueId();

  // Create function to get error of field
  const getActionError = (name: TFieldName | TFieldArrayName): string =>
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
        stores[0][compoundPath as TFieldName] = getInitialFieldStore(
          compoundPath as TFieldName,
          {
            initialValue: value,
            value: getActionValue(compoundPath as TFieldName) ?? value,
            error: getActionError(compoundPath as TFieldName),
          }
        );
      }

      // Add initial store of field array
      if (Array.isArray(value)) {
        const initialItems = value.map(generateItems);
        stores[1][compoundPath as TFieldArrayName] = getInitialFieldArrayStore(
          compoundPath as TFieldArrayName,
          {
            initialItems,
            items: getActionValue(compoundPath as TFieldArrayName)?.map(
              generateItems
            ) || [...initialItems],
            error: getActionError(compoundPath as TFieldArrayName),
          }
        );
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

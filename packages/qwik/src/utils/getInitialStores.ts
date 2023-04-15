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
} from '@modular-forms/core';
import { getPathValue, getUniqueId } from '@modular-forms/core';
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
  TResponseData extends ResponseData
>(
  loader: Signal<InitialValues<TFieldValues>>,
  action?: Maybe<
    ActionStore<
      FormActionStore<TFieldValues, TResponseData>,
      PartialValues<TFieldValues>,
      true
    >
  >
): [FieldsStore<TFieldValues>, FieldArraysStore<TFieldValues>] {
  // Create function to get value of field or field array
  function getActionValue<TFieldName extends FieldPath<TFieldValues>>(
    name: TFieldName
  ): Maybe<FieldPathValue<TFieldValues, TFieldName>>;
  function getActionValue<TFieldArrayName extends FieldArrayPath<TFieldValues>>(
    name: TFieldArrayName
  ): Maybe<FieldArrayPathValue<TFieldValues, TFieldArrayName>>;
  function getActionValue(name: any): any {
    return action?.value?.values && getPathValue(name, action.value.values);
  }

  // Create function to generate array items
  const generateItems = () => getUniqueId();

  // Create function to get error of field
  const getActionError = <
    TFieldName extends FieldPath<TFieldValues>,
    TFieldArrayName extends FieldArrayPath<TFieldValues>
  >(
    name: TFieldName | TFieldArrayName
  ): string => action?.value?.errors[name] || '';

  // Create recursive function to create initial stores
  const createInitialStores = (
    stores: [FieldsStore<TFieldValues>, FieldArraysStore<TFieldValues>],
    data: object,
    prevPath?: Maybe<string>
  ) =>
    Object.entries(data).reduce((stores, [path, value]) => {
      // Create new compound path
      const compoundPath = prevPath ? `${prevPath}.${path}` : path;

      // Add initial store of field
      if (!value || typeof value !== 'object' || Array.isArray(value)) {
        stores[0][compoundPath as FieldPath<TFieldValues>] =
          getInitialFieldStore(compoundPath as FieldPath<TFieldValues>, {
            initialValue: value,
            value:
              getActionValue(compoundPath as FieldPath<TFieldValues>) ?? value,
            error: getActionError(compoundPath as FieldPath<TFieldValues>),
          });
      }

      // Add initial store of field array
      if (Array.isArray(value)) {
        const initialItems = value.map(generateItems);
        stores[1][compoundPath as FieldArrayPath<TFieldValues>] =
          getInitialFieldArrayStore(
            compoundPath as FieldArrayPath<TFieldValues>,
            {
              initialItems,
              items: getActionValue(
                compoundPath as FieldArrayPath<TFieldValues>
              )?.map(generateItems) || [...initialItems],
              error: getActionError(
                compoundPath as FieldArrayPath<TFieldValues>
              ),
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
    FieldsStore<TFieldValues>,
    FieldArraysStore<TFieldValues>
  ];
}

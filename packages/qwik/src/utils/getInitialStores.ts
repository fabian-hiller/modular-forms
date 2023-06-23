import type {
  FieldArrayPath,
  FieldArrayPathValue,
  FieldArraysStore,
  FieldPath,
  FieldPathValue,
  FieldsStore,
  FieldValues,
  FormOptions,
  Maybe,
  ResponseData,
} from '../types';
import { getInitialFieldArrayStore } from './getInitialFieldArrayStore';
import { getInitialFieldStore } from './getInitialFieldStore';
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
  TResponseData extends ResponseData
>({
  loader,
  action,
  fieldArrays,
}: Pick<
  FormOptions<TFieldValues, TResponseData>,
  'loader' | 'action' | 'fieldArrays'
>): [FieldsStore<TFieldValues>, FieldArraysStore<TFieldValues>] {
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

      // If it is a field array, set initial store
      if (fieldArrays?.includes(compoundPath.replace(/.\d+./g, '.$.') as any)) {
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

        // Otherwise, if it is a field, set initial store
      } else if (
        !value ||
        typeof value !== 'object' ||
        Array.isArray(value) ||
        value instanceof Date
      ) {
        stores[0][compoundPath as FieldPath<TFieldValues>] =
          getInitialFieldStore(compoundPath as FieldPath<TFieldValues>, {
            initialValue: value,
            value:
              getActionValue(compoundPath as FieldPath<TFieldValues>) ?? value,
            error: getActionError(compoundPath as FieldPath<TFieldValues>),
          });
      }

      // If it is an object or array, add nested stores
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

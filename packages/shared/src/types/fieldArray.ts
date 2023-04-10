import { MaybePromise } from './utils';

/**
 * Function type to validate a field array.
 */
export type ValidateFieldArray<TFieldArrayItems> = (
  items: TFieldArrayItems
) => MaybePromise<string>;

/**
 * Value type of the internal raw field array state.
 */
export type RawFieldArrayState = {
  startItems: number[];
  items: number[];
  error: string;
  touched: boolean;
  dirty: boolean;
};

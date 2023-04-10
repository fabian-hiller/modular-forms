import { MaybePromise } from '@modular-forms/shared';

/**
 * Returns a list with validation functions.
 *
 * @param validate A single or multiple validation functions.
 *
 * @returns A list with validation functions.
 */
export function getValidateList<
  TValidate extends (value: any) => MaybePromise<string>
>(validate: TValidate | TValidate[] | undefined): TValidate[] {
  return typeof validate === 'function' ? [validate] : validate || [];
}

/**
 * Filters the options object from the arguments and returns it.
 *
 * @param arg1 Maybe the options object.
 * @param arg2 Maybe the options object.
 *
 * @returns The options object.
 */
export function getOptions<
  TName extends string,
  TOptions extends Record<string, any>
>(arg1?: TName | TName[] | TOptions, arg2?: TOptions): Partial<TOptions> {
  return (typeof arg1 !== 'string' && !Array.isArray(arg1) ? arg1 : arg2) || {};
}

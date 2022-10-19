/**
 * Filters the options object from the arguments and returns it.
 *
 * @param arg1 The name or names of a field or the options object.
 * @param arg2 The options object.
 *
 * @returns The options object.
 */
export function getOptions<
  TName extends string,
  TOptions extends Record<string, any>
>(arg1?: TName | TName[] | TOptions, arg2?: TOptions): TOptions {
  return (
    (typeof arg1 !== 'string' && !Array.isArray(arg1) ? arg1 : arg2) ||
    ({} as TOptions)
  );
}

/**
 * Returns value of a dot path in an object.
 *
 * @param path The dot path to the value.
 * @param object The object to get the value from.
 *
 * @returns The value or undefined.
 */
export function getPathValue(path: string, object: any): any {
  return path && object
    ? path.split('.').reduce((value, key) => value?.[key], object)
    : object;
}

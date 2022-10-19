/**
 * Returns any path that could belong to a field value.
 *
 * @param values The value to get the paths from.
 *
 * @returns A list of value paths.
 */
export function getValuePaths(values: any): string[] {
  const getValueKeys = (data: any, path = ''): any => {
    const getObjectKeys = () =>
      Object.keys(data).map((key) =>
        getValueKeys(data[key], path ? [path, key].join('.') : key)
      );
    if (
      !data ||
      typeof data !== 'object' ||
      data instanceof File ||
      data instanceof FileList
    ) {
      return path;
    }
    if (Array.isArray(data) && typeof data[0] === 'string') {
      return [path, getObjectKeys()];
    }
    return getObjectKeys();
  };
  return [getValueKeys(values)].join().split(',');
}

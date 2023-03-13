import { noSerialize } from '@builder.io/qwik';
import type { FieldValues, FormDataInfo, PartialValues } from '../types';

/**
 * Returns the values of a form data object. Information that is lost during
 * the transfer of the form data via HTTP can be supplemented.
 *
 * @param formData The form data.
 * @param formDataInfo The form data info.
 *
 * @returns The form data values.
 */
export function getFormDataValues<TFieldValues extends FieldValues>(
  formData: FormData,
  formDataInfo: FormDataInfo<TFieldValues> = {}
): PartialValues<TFieldValues> {
  // Destructure form data info and set default values
  const {
    arrays = [] as string[],
    booleans = [] as string[],
    files = [] as string[],
    numbers = [] as string[],
  } = formDataInfo;

  // Create function to get template name
  const getTemplateName = (name: string) => name.replace(/.\d+./g, '.$.');

  // Create values object by form data entries
  const values = [...formData.entries()].reduce<any>(
    (values, [name, value]) => {
      // Create template name
      const template = getTemplateName(name);

      // Create get value function
      const getValue = () =>
        booleans.includes(template)
          ? true
          : files.includes(template) && typeof value !== 'string'
          ? noSerialize(value)
          : numbers.includes(template)
          ? parseFloat(value as string)
          : value;

      // Add value of current field to values
      name.split('.').reduce((object, key, index, keys) => {
        // If it is not last index, return nested object or array
        if (index < keys.length - 1) {
          return (object[key] =
            object[key] || (isNaN(+keys[index + 1]) ? {} : []));
        }

        // Otherwise, if it is not an emty file, add value
        if (
          !files.includes(template) ||
          (value && (typeof value === 'string' || value.size))
        ) {
          if (arrays.includes(template)) {
            object[key] = object[key] || [];
            object[key].push(getValue());
          } else {
            object[key] = getValue();
          }
        }
      }, values);

      // Return modified values
      return values;
    },
    {}
  );

  // Create function to get parent object or array of path
  const getParentOfPath = (keys: string[]): any => {
    return keys
      .slice(0, -1)
      .reduce(
        (object, key, index) =>
          (object[key] = object[key] || (isNaN(+keys[index + 1]) ? {} : [])),
        values
      );
  };

  // Sublement empty arrays and "false" booleans
  [...new Set([...arrays, ...booleans])].sort().forEach((path) => {
    // Create path list
    const paths: string[] = [];

    // If path contains an array, add ever array path
    if (path.includes('.$.')) {
      // Create recusive function to find and add every array path
      const addArrayPaths = (currentPath: string, parentPath?: string) => {
        const [präfixPath, ...suffixPaths] = currentPath.split('.$.');
        const suffixPath = suffixPaths.join('.$.');
        const arrayPath = parentPath
          ? `${parentPath}.${präfixPath}`
          : präfixPath;
        (getParentOfPath([...arrayPath.split('.'), '0']) as Array<any>).map(
          (_, index) => {
            const indexPath = `${arrayPath}.${index}`;
            if (suffixPaths.length > 1) {
              addArrayPaths(suffixPath, indexPath);
            } else {
              paths.push(`${indexPath}.${suffixPath}`);
            }
          }
        );
      };

      // Add array paths to list
      addArrayPaths(path);

      // Otherwise just add current path
    } else {
      paths.push(path);
    }

    // Sublement empty arrays and "false" booleans for each path
    paths.forEach((path) => {
      const template = getTemplateName(path);
      const keys = path.split('.');
      const lastKey = keys[keys.length - 1];
      const object = getParentOfPath(keys);
      if (arrays.includes(template)) {
        object[lastKey] = object[lastKey] || [];
      } else {
        object[lastKey] = !!object[lastKey];
      }
    });
  });

  // Return values object
  return values;
}

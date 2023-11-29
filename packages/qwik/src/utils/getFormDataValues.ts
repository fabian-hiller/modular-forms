import { noSerialize } from '@builder.io/qwik';
import type { FieldValues, FormDataInfo, Maybe, PartialValues } from '../types';

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
    dates = [] as string[],
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

      // Create function to get date value
      const getDate = () =>
        // Date (yyyy-mm-dd)
        /^\d{4}-(0[1-9]|1[0-2])-([12]\d|0[1-9]|3[01])$/.test(value as string)
          ? new Date(`${value}T00:00:00.000Z`)
          : // Datetime (yyyy-mm-ddThh:mm)
          /^\d{4}-(0[1-9]|1[0-2])-([12]\d|0[1-9]|3[01])T(1\d|0[0-9]|2[0-3]):[0-5]\d$/.test(
              value as string
            )
          ? new Date(`${value}:00.000Z`)
          : // Week (yyyy-Www)
          /^\d{4}-W(0[1-9]|[1-4]\d|5[0-3])$/.test(value as string)
          ? (() => {
              const [year, week] = (value as string).split('-W');
              const date = new Date(`${year}-01-01T00:00:00.000Z`);
              date.setUTCDate((+week - 1) * 7 + 1);
              return date;
            })()
          : // Time (hh:mm)
          /^(1\d|0[0-9]|2[0-3]):[0-5]\d$/.test(value as string)
          ? new Date(`1970-01-01T${value}:00.000Z`)
          : // Time (hh:mm:ss)
          /^(1\d|0[0-9]|2[0-3]):[0-5]\d:[0-5]\d$/.test(value as string)
          ? new Date(`1970-01-01T${value}.000Z`)
          : // Other
            new Date(value as string);

      // Create function to get transformed value
      const getValue = () =>
        booleans.includes(template)
          ? true
          : dates.includes(template)
          ? getDate()
          : files.includes(template) && typeof value !== 'string'
          ? noSerialize(value)
          : numbers.includes(template)
          ? /^-?\d*(\.\d+)?$/.test(value as string)
            ? parseFloat(value as string)
            : getDate().getTime()
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
      const addArrayPaths = (
        currentPath: string,
        parentPath?: Maybe<string>
      ) => {
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

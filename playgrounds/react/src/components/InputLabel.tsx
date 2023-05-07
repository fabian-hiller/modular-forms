import clsx from 'clsx';

type InputLabelProps = {
  name: string;
  label?: string;
  required?: boolean;
  margin?: 'none';
};

/**
 * Input label for a form field.
 */
export function InputLabel({ name, label, required, margin }: InputLabelProps) {
  return (
    <>
      {label && (
        <label
          className={clsx(
            'inline-block font-medium md:text-lg lg:text-xl',
            !margin && 'mb-4 lg:mb-5'
          )}
          htmlFor={name}
        >
          {label}{' '}
          {required && (
            <span className="ml-1 text-red-600 dark:text-red-400">*</span>
          )}
        </label>
      )}
    </>
  );
}

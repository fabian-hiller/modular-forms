import type { FieldValues, FormErrors, Maybe } from '../types/index.js';

/**
 * An explicit form error with useful information for the user.
 */
export class FormError<TFieldValues extends FieldValues> extends Error {
  public readonly name = 'FormError';
  public readonly errors: FormErrors<TFieldValues>;

  /**
   * Creates an explicit form error with useful information for the user.
   *
   * @param message The error message.
   * @param errors The field errors.
   */
  constructor(message: string, errors?: Maybe<FormErrors<TFieldValues>>);

  /**
   * Creates an explicit form error with useful information for the user.
   *
   * @param errors The field errors.
   */
  constructor(errors: FormErrors<TFieldValues>);

  constructor(
    arg1: string | FormErrors<TFieldValues>,
    arg2?: Maybe<FormErrors<TFieldValues>>
  ) {
    super(typeof arg1 === 'string' ? arg1 : '');
    this.errors = typeof arg1 === 'string' ? arg2 || {} : arg1;
  }
}

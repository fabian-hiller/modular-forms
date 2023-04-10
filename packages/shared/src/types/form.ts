import { Maybe } from './utils';

/**
 * Value type of the validation mode.
 */
export type ValidationMode = 'touched' | 'input' | 'change' | 'blur' | 'submit';

/**
 * Value type of the response status.
 */
export type ResponseStatus = 'info' | 'error' | 'success';

/**
 * Value type of the response data.
 */
export type ResponseData = Maybe<Record<string, any> | Array<any>>;

/**
 * Value type of the form response.
 */
export type FormResponse<TResponseData extends ResponseData = undefined> =
  Partial<{
    status: ResponseStatus;
    message: string;
    data: TResponseData;
  }>;

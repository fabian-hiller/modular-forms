import { $, implicit$FirstArg, noSerialize, type QRL } from '@builder.io/qwik';
import {
  globalActionQrl,
  routeActionQrl,
  type Action,
  type RequestEventAction,
} from '@builder.io/qwik-city';
import { AbortMessage } from '@builder.io/qwik-city/middleware/request-handler';
import { isDev } from '@builder.io/qwik/build';
import { decode } from 'decode-formdata';
import { FormError } from '../exceptions';
import type {
  FieldValues,
  FormActionStore,
  FormDataInfo,
  FormErrors,
  FormResponse,
  Maybe,
  MaybePromise,
  PartialValues,
  ResponseData,
  ValidateForm,
} from '../types';

/**
 * Value type of the form action result.
 */
export type FormActionResult<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData,
> = FormResponse<TResponseData> & {
  errors?: Maybe<FormErrors<TFieldValues>>;
};

/**
 * Function type of the form action.
 */
export type FormActionFunction<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData,
> = (
  values: TFieldValues,
  event: RequestEventAction
) => MaybePromise<FormActionResult<TFieldValues, TResponseData> | void>;

/**
 * Value type of the second form action argument.
 */
export type FormActionArg2<TFieldValues extends FieldValues> =
  | QRL<ValidateForm<TFieldValues>>
  | (FormDataInfo<TFieldValues> & {
      validate: QRL<ValidateForm<TFieldValues>>;
    });

/**
 * See {@link routeFormAction$}
 */
export function routeFormActionQrl<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData = undefined,
>(
  action: QRL<FormActionFunction<TFieldValues, TResponseData>>,
  arg2: FormActionArg2<TFieldValues>
): Action<
  FormActionStore<TFieldValues, TResponseData>,
  PartialValues<TFieldValues>,
  true
> {
  return routeActionQrl(
    $(
      async (
        jsonData: unknown,
        event: RequestEventAction
      ): Promise<FormActionStore<TFieldValues, TResponseData>> => {
        return formActionLogic<TFieldValues, TResponseData>(
          jsonData,
          event,
          action,
          arg2
        );
      }
    ),
    {
      id: action.getHash(),
    }
  );
}

/**
 
 * Creates an action for progressively enhanced forms that handles validation
 * and submission on the server.
 *
 * If you want to use it inside of a component, make sure you re-export it
 * from either the `index.tsx` or `layout.tsx` that contains that component.
 * see https://qwik.dev/docs/re-exporting-loaders/ for ho to do it.
 *
 * @param action The server action function.
 * @param arg2 Validation and/or form data info.
 *
 * @returns Form action constructor.

 */
export const routeFormAction$: <
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData = undefined,
>(
  actionQrl: FormActionFunction<TFieldValues, TResponseData>,
  arg2: FormActionArg2<TFieldValues>
) => Action<
  FormActionStore<TFieldValues, TResponseData>,
  PartialValues<TFieldValues>,
  true
> = implicit$FirstArg(routeFormActionQrl);

/**
 * See {@link globalFormAction$}
 */
export function globalFormActionQrl<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData = undefined,
>(
  action: QRL<FormActionFunction<TFieldValues, TResponseData>>,
  arg2: FormActionArg2<TFieldValues>
): Action<
  FormActionStore<TFieldValues, TResponseData>,
  PartialValues<TFieldValues>,
  true
> {
  return globalActionQrl(
    $(
      async (
        jsonData: unknown,
        event: RequestEventAction
      ): Promise<FormActionStore<TFieldValues, TResponseData>> => {
        return formActionLogic<TFieldValues, TResponseData>(
          jsonData,
          event,
          action,
          arg2
        );
      }
    ),
    {
      id: action.getHash(),
    }
  );
}

/**
 
 * If you need a form action that is route protected (by auth), use `routeFormAction$` instead.
 *
 * Creates an action for progressively enhanced forms that handles validation
 * and submission on the server.
 *
 * @param action The server action function.
 * @param arg2 Validation and/or form data info.
 *
 * @returns Form action constructor.

 */
export const globalFormAction$: <
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData = undefined,
>(
  actionQrl: FormActionFunction<TFieldValues, TResponseData>,
  arg2: FormActionArg2<TFieldValues>
) => Action<
  FormActionStore<TFieldValues, TResponseData>,
  PartialValues<TFieldValues>,
  true
> = implicit$FirstArg(globalFormActionQrl);

/**
 * See {@link formAction$}
 */
export const formActionQrl = globalFormActionQrl;

/**
 * Creates an action for progressively enhanced forms that handles validation
 * and submission on the server.
 *
 * @param action The server action function.
 * @param arg2 Validation and/or form data info.
 *
 * @returns Form action constructor.

 * @deprecated Use `routeFormAction$` (recommended) or `globalFormAction$` instead.
 */
export const formAction$: <
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData = undefined,
>(
  actionQrl: FormActionFunction<TFieldValues, TResponseData>,
  arg2: FormActionArg2<TFieldValues>
) => Action<
  FormActionStore<TFieldValues, TResponseData>,
  PartialValues<TFieldValues>,
  true
> = implicit$FirstArg(formActionQrl);

/**
 * @internal
 */

export async function formActionLogic<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData = undefined,
>(
  jsonData: unknown,
  event: RequestEventAction,
  action: QRL<FormActionFunction<TFieldValues, TResponseData>>,
  arg2: FormActionArg2<TFieldValues>
) {
  // Destructure validate function and form data info
  const { validate, ...formDataInfo } =
    typeof arg2 === 'object' ? arg2 : { validate: arg2 };

  // Get content type of request
  const type = event.request.headers.get('content-type')?.split(/[;,]/, 1)[0];

  // Get form values from form or JSON data
  const values: PartialValues<TFieldValues> =
    type === 'application/x-www-form-urlencoded' ||
    type === 'multipart/form-data'
      ? decode(
          event.sharedMap.get('@actionFormData'),
          formDataInfo,
          ({ output }) =>
            output instanceof Blob ? noSerialize(output) : output
        )
      : (jsonData as PartialValues<TFieldValues>);

  // Validate values and get errors if necessary
  const errors = validate ? await validate(values) : {};

  // Create form action store object
  let formActionStore: FormActionStore<TFieldValues, TResponseData> = {
    values,
    errors,
    response: {},
  };

  // Try to run submit action if form has no errors
  if (!Object.keys(errors).length) {
    try {
      const result = await action(values as TFieldValues, event);

      // Add result to form action store if necessary
      if (result && typeof result === 'object') {
        formActionStore = {
          values,
          errors: result.errors || {},
          response: {
            status: result.status,
            message: result.message,
            data: result.data,
          },
        };
      }

      // If an abort message was thrown (e.g. a redirect), forward it
    } catch (error) {
      if (
        error instanceof AbortMessage ||
        (isDev &&
          (error?.constructor?.name === 'AbortMessage' ||
            error?.constructor?.name === 'RedirectMessage'))
      ) {
        throw error;

        // Otherwise log error and set error response
      } else {
        console.error(error);

        // If it is an expected error, use its error info
        if (error instanceof FormError) {
          formActionStore = {
            values,
            errors: error.errors,
            response: {
              status: 'error',
              message: error.message,
            },
          };

          // Otherwise return a generic message to avoid leaking
          // sensetive information
        } else {
          formActionStore.response = {
            status: 'error',
            message: 'An unknown error has occurred.',
          };
        }
      }
    }
  }

  // Return form action store object
  return formActionStore;
}

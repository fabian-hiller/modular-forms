import { $, type QRL, implicit$FirstArg } from '@builder.io/qwik';
import {
  type RequestEventAction,
  globalActionQrl,
  type Action,
} from '@builder.io/qwik-city';
import type {
  FieldValues,
  FormErrors,
  FormResponse,
  Maybe,
  MaybePromise,
  PartialValues,
  ResponseData,
  ValidateForm,
} from '@modular-forms/shared';
import type { FormActionStore, FormDataInfo } from '../types';
import { getFormDataValues } from '../utils';

export type FormActionResult<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData
> = FormResponse<TResponseData> & {
  errors?: Maybe<FormErrors<TFieldValues>>;
};

type FormActionFunc<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData
> = (
  values: TFieldValues,
  event: RequestEventAction
) => MaybePromise<FormActionResult<TFieldValues, TResponseData> | void>;

type FormActionArg2<TFieldValues extends FieldValues> =
  | QRL<ValidateForm<TFieldValues>>
  | (FormDataInfo<TFieldValues> & {
      validate?: Maybe<QRL<ValidateForm<TFieldValues>>>;
    });

/**
 * See {@link formAction$}
 */
export function formActionQrl<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData = undefined
>(
  action: QRL<FormActionFunc<TFieldValues, TResponseData>>,
  arg2?: Maybe<FormActionArg2<TFieldValues>>
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
        // Destructure validate function and form data info
        const { validate, ...formDataInfo } =
          typeof arg2 === 'object' ? arg2 : { validate: arg2 };

        // Get content type of request
        const type = event.request.headers
          .get('content-type')
          ?.split(/[;,]/, 1)[0];

        // Get form values from form or JSON data
        const values: PartialValues<TFieldValues> =
          type === 'application/x-www-form-urlencoded' ||
          type === 'multipart/form-data'
            ? getFormDataValues(await event.request.formData(), formDataInfo)
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

            // If an error occurred, set error response
          } catch (error: any) {
            console.error(error);
            formActionStore.response = {
              status: 'error',
              message: 'An unknown error has occurred.',
            };
          }
        }

        // Return form action store object
        return formActionStore;
      }
    )
  );
}

/**
 * Creates an action for progressively enhanced forms that handles validation
 * and submission on the server.
 *
 * @param action The server action function.
 * @param arg2 Validation and/or form data info.
 *
 * @returns Form action constructor.
 */
export const formAction$: <
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData = undefined
>(
  actionQrl: FormActionFunc<TFieldValues, TResponseData>,
  arg2?: Maybe<FormActionArg2<TFieldValues>>
) => Action<
  FormActionStore<TFieldValues, TResponseData>,
  PartialValues<TFieldValues>,
  true
> = implicit$FirstArg(formActionQrl);

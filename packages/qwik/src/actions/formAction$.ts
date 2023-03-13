import { $, type QRL, implicit$FirstArg } from '@builder.io/qwik';
import {
  type RequestEventAction,
  globalActionQrl,
  type Action,
} from '@builder.io/qwik-city';
import type {
  FieldValues,
  FormActionState,
  FormDataInfo,
  FormResponse,
  MaybePromise,
  PartialValues,
  ValidateForm,
} from '../types';
import { getFormDataValues } from '../utils';

type FormActionFunc<TFieldValues extends FieldValues> = (
  values: TFieldValues,
  event: RequestEventAction
) => MaybePromise<FormActionState<TFieldValues> | FormResponse | void>;

type FormActionArg2<TFieldValues extends FieldValues> =
  | QRL<ValidateForm<TFieldValues>>
  | (FormDataInfo<TFieldValues> & {
      validate?: QRL<ValidateForm<TFieldValues>>;
    });

/**
 * Creates and returns the form action constructor.
 *
 * @param action The server action function.
 * @param arg2 Validation and/or form data info.
 *
 * @returns Form action constructor.
 */
export function formActionQrl<TFieldValues extends FieldValues>(
  action: QRL<FormActionFunc<TFieldValues>>,
  arg2?: FormActionArg2<TFieldValues>
): Action<FormActionState<TFieldValues>, PartialValues<TFieldValues>, true> {
  return globalActionQrl(
    $(
      async (
        jsonData: unknown,
        event: RequestEventAction
      ): Promise<FormActionState<TFieldValues>> => {
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
          // TODO: Explain in docs when to use "multipart/form-data"
          type === 'multipart/form-data'
            ? getFormDataValues(await event.request.formData(), formDataInfo)
            : (jsonData as PartialValues<TFieldValues>);

        // Validate values and get errors if necessary
        const errors = validate ? await validate(values) : {};

        // Create form action with values, errors and response
        let formActionState: FormActionState<TFieldValues> = {
          values,
          errors,
          response: {},
        };

        // Try to run submit action if form has no errors
        if (!Object.keys(errors).length) {
          try {
            const result = await action(values as TFieldValues, event);

            // Add result to form action state if necessary
            if (result) {
              if ('values' in result) {
                formActionState = result;
              } else {
                formActionState.response = result;
              }
            }

            // If an error occurred, set error response
          } catch (error: any) {
            formActionState.response = {
              status: 'error',
              // TODO: Implement custom form and field error class so that, for
              // security reasons, we only return errors to client that were
              // intentionally thrown or advise users in documents that they
              // must intercept error messages for security-critical actions
              // to avoid inadvertently passing private information to client
              message: error?.message || 'An unknown error has occurred.',
            };
          }
        }

        // Return form action object
        return formActionState;
      }
    )
  );
}

/**
 * See {@link formActionQrl}
 */
export const formAction$: <TFieldValues extends FieldValues>(
  actionQrl: FormActionFunc<TFieldValues>,
  arg2?: FormActionArg2<TFieldValues>
) => Action<FormActionState<TFieldValues>, PartialValues<TFieldValues>, true> =
  implicit$FirstArg(formActionQrl);

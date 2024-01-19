import { component$ } from '@builder.io/qwik';
import {
  globalAction$,
  routeLoader$,
  type DocumentHead,
} from '@builder.io/qwik-city';
import {
  formAction$,
  type InitialValues,
  useForm,
  valiForm$,
} from '@modular-forms/qwik';
import * as v from 'valibot';
import { FormHeader, TextInput, FormFooter, Response } from '~/components';

const LoginSchema = v.object({
  email: v.string([
    v.minLength(1, 'Please enter your email.'),
    v.email('The email address is badly formatted.'),
  ]),
  password: v.string([
    v.minLength(1, 'Please enter your password.'),
    v.minLength(8, 'You password must have 8 characters or more.'),
  ]),
});

type LoginForm = v.Input<typeof LoginSchema>;

const getInitFormValues = (): InitialValues<LoginForm> => ({
  email: '',
  password: '',
});

// Note: State is kept in local variable for demo purposes
let loginFormValues: InitialValues<LoginForm> = getInitFormValues();

export const useFormLoader = routeLoader$<InitialValues<LoginForm>>(
  () => loginFormValues
);

export const useResetFormAction = globalAction$(() => {
  loginFormValues = getInitFormValues();
});

export const useFormAction = formAction$<LoginForm>((values) => {
  // Runs on server
  console.log(values);
}, valiForm$(LoginSchema));

export default component$(() => {
  // Use login form
  const [loginForm, { Form, Field }] = useForm<LoginForm>({
    loader: useFormLoader(),
    action: useFormAction(),
    validate: valiForm$(LoginSchema),
  });

  // Use reset form action
  const resetFormAction = useResetFormAction();

  return (
    <div class="space-y-12 md:space-y-14 lg:space-y-16">
      <FormHeader
        of={loginForm}
        form="login-form"
        heading="Login form"
        resetAction={resetFormAction}
      />

      <Form
        id="login-form"
        class="space-y-8 md:space-y-10 lg:space-y-12"
        onSubmit$={(values) => {
          // Runs on client
          console.log(values);
        }}
      >
        <Field name="email">
          {(field, props) => (
            <TextInput
              {...props}
              value={field.value}
              error={field.error}
              type="email"
              label="Email"
              placeholder="example@email.com"
              required
            />
          )}
        </Field>

        <Field name="password">
          {(field, props) => (
            <TextInput
              {...props}
              value={field.value}
              error={field.error}
              type="password"
              label="Password"
              placeholder="********"
              required
            />
          )}
        </Field>

        <Response class="pt-8 md:pt-10 lg:pt-12" of={loginForm} />
      </Form>

      <FormFooter
        of={loginForm}
        form="login-form"
        resetAction={resetFormAction}
      />
    </div>
  );
});

export const head: DocumentHead = {
  title: 'Login form',
};

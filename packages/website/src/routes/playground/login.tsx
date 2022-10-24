import {
  createForm,
  email,
  Field,
  Form,
  minLength,
  required,
} from '@modular-forms/solid';
import { onMount } from 'solid-js';
import { Title } from 'solid-start';
import { FormFooter, FormHeader, TextInput } from '~/components';
import { useForm } from '~/contexts';

type LoginForm = {
  email: string;
  password: string;
};

export default function LoginPage() {
  // Create login form
  const loginForm = createForm<LoginForm>();

  // Set login form in form context
  onMount(() => useForm().set(loginForm));

  return (
    <>
      <Title>Login Playground | Modular Forms</Title>

      <Form
        class="space-y-12 md:space-y-14 lg:space-y-16"
        of={loginForm}
        onSubmit={(values) => alert(JSON.stringify(values, null, 4))}
      >
        <FormHeader of={loginForm} heading="Login form" />
        <div class="space-y-8 md:space-y-10 lg:space-y-12">
          <Field
            of={loginForm}
            name="email"
            validate={[
              required('Please enter your email.'),
              email('The email address is badly formatted.'),
            ]}
          >
            {(field) => (
              <TextInput
                {...field.props}
                value={field.value}
                error={field.error}
                type="email"
                label="Email"
                placeholder="example@email.com"
                required
              />
            )}
          </Field>
          <Field
            of={loginForm}
            name="password"
            validate={[
              required('Please enter your password.'),
              minLength(8, 'You password must have 8 characters or more.'),
            ]}
          >
            {(field) => (
              <TextInput
                {...field.props}
                value={field.value}
                error={field.error}
                type="password"
                label="Password"
                placeholder="********"
                required
              />
            )}
          </Field>
        </div>
        <FormFooter of={loginForm} />
      </Form>
    </>
  );
}

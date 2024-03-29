import { email, minLength, required, useForm } from '@modular-forms/react';
import { FormHeader, TextInput, FormFooter } from '../components';

type LoginForm = {
  email: string;
  password: string;
};

export default function LoginPage() {
  // Use login form
  const [loginForm, { Form, Field }] = useForm<LoginForm>();

  return (
    <Form
      className="space-y-12 md:space-y-14 lg:space-y-16"
      onSubmit={(values) => console.log(values)}
    >
      <FormHeader of={loginForm} heading="Login form" />
      <div className="space-y-8 md:space-y-10 lg:space-y-12">
        <Field
          name="email"
          validate={[
            required('Please enter your email.'),
            email('The email address is badly formatted.'),
          ]}
        >
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
        <Field
          name="password"
          validate={[
            required('Please enter your password.'),
            minLength(8, 'You password must have 8 characters or more.'),
          ]}
        >
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
      </div>
      <FormFooter of={loginForm} />
    </Form>
  );
}

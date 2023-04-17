import {
  createForm,
  email,
  getValue,
  pattern,
  required,
} from '@modular-forms/solid';
import { Match, Switch } from 'solid-js';
import { FormFooter, FormHeader, TextInput, Title } from '~/components';
import { Select } from '~/components/Select';

type PaymentForm = {
  owner: string;
  type: 'card' | 'paypal';
  card: {
    number: string;
    expiration: string;
  };
  paypal: {
    email: string;
  };
};

const initialValues = {
  owner: 'John Doe',
};

export default function PaymentPage() {
  // Create payment form
  const [paymentForm, { Form, Field }] = createForm<PaymentForm>({
    initialValues,
  });

  return (
    <>
      <Title>Payment form</Title>

      <Form
        class="space-y-12 md:space-y-14 lg:space-y-16"
        onSubmit={(values) => alert(JSON.stringify(values, null, 4))}
      >
        <FormHeader of={paymentForm} heading="Payment form" />
        <div class="space-y-8 md:space-y-10 lg:space-y-12">
          <Field name="owner" validate={required('Please enter your name.')}>
            {(field, props) => (
              <TextInput
                {...props}
                value={field.value}
                error={field.error}
                type="text"
                label="Owner"
                placeholder="John Doe"
                required
              />
            )}
          </Field>
          <Field
            name="type"
            validate={required('Please select the payment type.')}
          >
            {(field, props) => (
              <Select
                {...props}
                value={field.value}
                options={[
                  { label: 'Card', value: 'card' },
                  { label: 'PayPal', value: 'paypal' },
                ]}
                error={field.error}
                label="Type"
                placeholder="Card or PayPal?"
                required
              />
            )}
          </Field>
          <Switch>
            <Match when={getValue(paymentForm, 'type') === 'card'}>
              <Field
                name="card.number"
                validate={[
                  required('Please enter your card number.'),
                  pattern(
                    /^\d{4}\s?(\d{6}\s?\d{5}|\d{4}\s?\d{4}\s?\d{4})$/,
                    'The card number is badly formatted.'
                  ),
                ]}
              >
                {(field, props) => (
                  <TextInput
                    {...props}
                    value={field.value}
                    error={field.error}
                    type="text"
                    label="Number"
                    placeholder="1234 1234 1234 1234"
                    required
                  />
                )}
              </Field>
              <Field
                name="card.expiration"
                validate={[
                  required('Please enter your card number.'),
                  pattern(
                    /^(0[1-9]|1[0-2])\/2[2-9]$/,
                    'The expiration date is badly formatted.'
                  ),
                ]}
              >
                {(field, props) => (
                  <TextInput
                    {...props}
                    value={field.value}
                    error={field.error}
                    type="text"
                    label="Expiration"
                    placeholder="MM/YY"
                    required
                  />
                )}
              </Field>
            </Match>
            <Match when={getValue(paymentForm, 'type') === 'paypal'}>
              <Field
                name="paypal.email"
                validate={[
                  required('Please enter your PayPal email.'),
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
            </Match>
          </Switch>
        </div>
        <FormFooter of={paymentForm} />
      </Form>
    </>
  );
}

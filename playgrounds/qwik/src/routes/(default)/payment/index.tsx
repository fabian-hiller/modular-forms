import { component$ } from '@builder.io/qwik';
import { type DocumentHead, routeLoader$ } from '@builder.io/qwik-city';
import {
  type InitialValues,
  useForm,
  required,
  getValue,
  email,
  pattern,
} from '@modular-forms/qwik';
import { FormHeader, TextInput, Select, FormFooter } from '~/components';

type PaymentForm = {
  owner: string;
  type: '' | 'card' | 'paypal';
  card: {
    number: string;
    expiration: string;
  };
  paypal: {
    email: string;
  };
};

export const useFormLoader = routeLoader$<InitialValues<PaymentForm>>(() => ({
  owner: 'John Doe',
  type: '',
  card: {
    number: '',
    expiration: '',
  },
  paypal: {
    email: '',
  },
}));

export default component$(() => {
  // Use payment form
  const [paymentForm, { Form, Field }] = useForm<PaymentForm>({
    loader: useFormLoader(),
  });

  return (
    <Form
      class="space-y-12 md:space-y-14 lg:space-y-16"
      onSubmit$={(values) => console.log(values)}
    >
      <FormHeader of={paymentForm} heading="Payment form" />
      <div class="space-y-8 md:space-y-10 lg:space-y-12">
        <Field
          name="owner"
          validate={required<string>('Please enter your name.')}
        >
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
          validate={required<string>('Please select the payment type.')}
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
        {getValue(paymentForm, 'type') === 'card' && (
          <>
            <Field
              name="card.number"
              validate={[
                required<string>('Please enter your card number.'),
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
                required<string>('Please enter your card number.'),
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
          </>
        )}
        {getValue(paymentForm, 'type') === 'paypal' && (
          <Field
            name="paypal.email"
            validate={[
              required<string>('Please enter your PayPal email.'),
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
        )}
      </div>
      <FormFooter of={paymentForm} />
    </Form>
  );
});

export const head: DocumentHead = {
  title: 'Payment form',
};

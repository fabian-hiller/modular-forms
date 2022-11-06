import { FormState } from '@modular-forms/solid';
import {
  Accessor,
  createContext,
  createSignal,
  JSX,
  Setter,
  useContext,
} from 'solid-js';

type Form = FormState<any> | undefined;

// Create form context
const FormContext = createContext<{ get: Accessor<Form>; set: Setter<Form> }>();

type FormProviderProps = {
  children: JSX.Element;
};

/**
 * Provides the form context to its child components.
 */
export function FormProvider(props: FormProviderProps) {
  const [get, set] = createSignal<Form>();
  return <FormContext.Provider value={{ get, set }} {...props} />;
}

/**
 * Provides the ability to access the form context.
 *
 * @returns The form context.
 */
export function useForm() {
  return useContext(FormContext)!;
}

import { APIEvent, Navigate, redirect } from 'solid-start';
import { getFramework } from '~/contexts';

export async function GET({ params }: APIEvent) {
  return redirect(
    params.framework === 'solid'
      ? 'createForm'
      : params.framework === 'qwik'
      ? 'formAction$'
      : 'useForm'
  );
}

export default function GuidesPage() {
  return (
    <Navigate
      href={
        getFramework() === 'solid'
          ? 'createForm'
          : getFramework() === 'qwik'
          ? 'formAction$'
          : 'useForm'
      }
    />
  );
}

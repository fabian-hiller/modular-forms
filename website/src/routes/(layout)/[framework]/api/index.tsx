import { APIEvent, Navigate, redirect } from 'solid-start';
import { getFramework } from '~/contexts';

export async function GET({ params }: APIEvent) {
  return redirect(params.framework === 'qwik' ? 'formAction$' : 'createForm');
}

export default function GuidesPage() {
  return (
    <Navigate href={getFramework() === 'qwik' ? 'formAction$' : 'createForm'} />
  );
}

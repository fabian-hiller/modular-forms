import { APIEvent, Navigate } from 'solid-start';
import { useFramework } from '~/contexts';
import { redirect } from '~/utils';

export async function GET({ params }: APIEvent) {
  return redirect(params.framework === 'qwik' ? 'formAction$' : 'createForm');
}

export default function GuidesPage() {
  const [getFramework] = useFramework();
  return (
    <Navigate href={getFramework() === 'qwik' ? 'formAction$' : 'createForm'} />
  );
}

import { APIEvent, Navigate } from 'solid-start';
import { frameworkCookie } from '~/cookies';
import { isSolid, redirect } from '~/utils';

export async function GET({ request }: APIEvent) {
  const framework = await frameworkCookie.parse(request.headers.get('Cookie'));
  return redirect(framework === 'qwik' ? 'formAction$' : 'createForm');
}

export default function GuidesPage() {
  return <Navigate href={isSolid() ? 'createForm' : 'formAction$'} />;
}

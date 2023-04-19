import { APIEvent, Navigate, redirect } from 'solid-start';
import { getFramework } from '~/contexts';
import { frameworkCookie } from '~/cookies';

export async function GET({ request }: APIEvent) {
  const framework = await frameworkCookie.parse(request.headers.get('Cookie'));
  return redirect(`/${framework || 'solid'}/playground`);
}

export default function GuidesPage() {
  return <Navigate href={`/${getFramework()}/playground`} />;
}

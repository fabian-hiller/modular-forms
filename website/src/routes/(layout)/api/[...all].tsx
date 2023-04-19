import { APIEvent, Navigate, redirect, useParams } from 'solid-start';
import { getFramework } from '~/contexts';
import { frameworkCookie } from '~/cookies';

export async function GET({ request, params }: APIEvent) {
  const framework = await frameworkCookie.parse(request.headers.get('Cookie'));
  return redirect(`/${framework || 'solid'}/api/${params.all}`);
}

export default function GuidesPage() {
  return <Navigate href={`/${getFramework()}/api/${useParams().all}`} />;
}

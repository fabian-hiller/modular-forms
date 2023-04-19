import { APIEvent, Navigate, useParams } from 'solid-start';
import { useFramework } from '~/contexts';
import { frameworkCookie } from '~/cookies';
import { redirect } from '~/utils';

export async function GET({ request, params }: APIEvent) {
  const framework = await frameworkCookie.parse(request.headers.get('Cookie'));
  return redirect(`/${framework || 'solid'}/guides/${params.all}`);
}

export default function GuidesPage() {
  const [getFramework] = useFramework();
  return <Navigate href={`/${getFramework()}/guides/${useParams().all}`} />;
}

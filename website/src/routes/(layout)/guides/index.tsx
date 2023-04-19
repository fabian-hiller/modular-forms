import { APIEvent, Navigate } from 'solid-start';
import { useFramework } from '~/contexts';
import { frameworkCookie } from '~/cookies';
import { redirect } from '~/utils';

export async function GET({ request }: APIEvent) {
  const framework = await frameworkCookie.parse(request.headers.get('Cookie'));
  return redirect(`/${framework || 'solid'}/guides`);
}

export default function GuidesPage() {
  const [getFramework] = useFramework();
  return <Navigate href={`/${getFramework()}/guides`} />;
}

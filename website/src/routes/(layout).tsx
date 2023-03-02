import { useRouteData, Outlet } from 'solid-start';
import { createServerData$ } from 'solid-start/server';
import { Header, Footer } from '~/components';
import { Framework, FrameworkProvider } from '~/contexts';
import { frameworkCookie } from '~/cookies';

export function routeData() {
  return {
    getFramework: createServerData$<Framework>(async (_, { request }) => {
      const framework = await frameworkCookie.parse(
        request.headers.get('Cookie')
      );
      if (framework === 'solid' || framework === 'qwik') {
        return framework;
      }
      return 'solid';
    }),
  };
}

export default function Layout() {
  // Use route data
  const { getFramework } = useRouteData<typeof routeData>();

  return (
    <FrameworkProvider framework={getFramework()!}>
      <Header />
      <Outlet />
      <Footer />
    </FrameworkProvider>
  );
}

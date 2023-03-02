import { Outlet } from 'solid-start';

export default function LegalLayout() {
  return (
    <main class="flex w-full max-w-screen-lg flex-1 flex-col self-center py-12 md:py-20 lg:py-32">
      <article>
        <Outlet />
      </article>
    </main>
  );
}

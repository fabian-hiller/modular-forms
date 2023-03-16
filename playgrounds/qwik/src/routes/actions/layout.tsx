import { component$, Slot } from '@builder.io/qwik';
import { Tabs } from '~/components';

export default component$(() => (
  <>
    <Tabs items={['Login', 'Todos', 'Special']} />
    <main>
      <Slot />
    </main>
  </>
));

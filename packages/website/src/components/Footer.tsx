import { For } from 'solid-js';

/**
 * Footer with copyright notice and links to legal text.
 */
export function Footer() {
  return (
    <footer class="flex justify-between p-4 text-sm md:text-base lg:py-6 lg:px-8 lg:text-[17px]">
      <div>&copy; {new Date().getFullYear()} Fabian Hiller</div>
      <nav class="space-x-5 lg:space-x-12">
        <For each={['Imprint', 'Privacy']}>
          {(item) => <a href={`/legal/${item.toLowerCase()}`}>{item}</a>}
        </For>
      </nav>
    </footer>
  );
}

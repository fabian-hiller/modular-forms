import { For } from 'solid-js';
import { TextLink } from './TextLink';

/**
 * Footer with copyright notice and links to legal text.
 */
export function Footer() {
  return (
    <footer class="flex justify-between p-4 text-sm md:text-base lg:px-8 lg:py-6 lg:text-[17px]">
      <div>&copy; {new Date().getFullYear()} Fabian Hiller</div>
      <nav class="space-x-5 lg:space-x-12">
        <For each={['Contact', 'Privacy']}>
          {(item) => (
            <TextLink href={`/legal/${item.toLowerCase()}`}>{item}</TextLink>
          )}
        </For>
      </nav>
    </footer>
  );
}

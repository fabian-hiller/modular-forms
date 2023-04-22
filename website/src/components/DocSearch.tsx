import '@docsearch/css';
import docsearch from '@docsearch/js';
import { createSignal, onMount } from 'solid-js';
import { SearchIcon } from '~/icons';

export function DocSearch() {
  // Create element signal
  const [getElement, setElement] = createSignal<HTMLDivElement>();

  // Initialize Algolia DocSearch
  onMount(() =>
    docsearch({
      container: '#docsearch',
      appId: 'WPUKVFFXAK',
      indexName: 'modularforms',
      apiKey: 'a1341ad26a8e6ef7890b254961746f93',
    })
  );

  return (
    <div>
      <button
        class="focus-ring box-content flex h-5 w-5 justify-center rounded-lg p-2 transition-colors hover:text-slate-900 dark:hover:text-slate-200 md:h-[22px] md:w-[22px] lg:h-6 lg:w-6"
        type="button"
        // Trigger hidden Algolia DocSearch button
        onClick={() => getElement()!.querySelector('button')?.click()}
        aria-label="Open search"
      >
        <SearchIcon class="h-full" />
      </button>
      <div id="docsearch" class="hidden" ref={setElement} />
    </div>
  );
}

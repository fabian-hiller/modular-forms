import { Show } from 'solid-js';
import { useFramework } from '~/contexts';
import { QwikIcon, SolidIcon } from '~/icons';

/**
 * Button to display and switch between the supported frameworks.
 */
export function FrameworkToggle() {
  const [getFramework, setFramework] = useFramework();
  const isSolid = () => getFramework() === 'solid';
  const getInactiveFramework = () => (isSolid() ? 'qwik' : 'solid');
  return (
    <button
      class="box-content h-6 w-6 p-4 opacity-75 grayscale-[25%] transition-opacity hover:opacity-100 md:h-[26px] md:w-[26px] lg:h-[30px] lg:w-[30px]"
      type="button"
      onClick={() => setFramework(getInactiveFramework())}
      aria-label={`Change framework to ${getInactiveFramework()}`}
    >
      <Show when={isSolid()} fallback={<QwikIcon />}>
        <SolidIcon />
      </Show>
    </button>
  );
}

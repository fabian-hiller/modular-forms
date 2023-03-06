import { makeEventListener } from '@solid-primitives/event-listener';
import { isClient } from '@solid-primitives/utils';
import clsx from 'clsx';
import { createEffect, createSignal, JSX, on, onMount } from 'solid-js';

type ExpandableProps = {
  class?: string;
  children: JSX.Element;
  expanded: boolean;
};

/**
 * Wrapper component to vertically expand or collapse content.
 */
export function Expandable(props: ExpandableProps) {
  // Create painted, element, element height and frozen children signal
  const [getPainted, setPainted] = createSignal(false);
  const [getElement, setElement] = createSignal<HTMLDivElement>();
  const [getElementHeight, setElementHeight] = createSignal<number>(0);
  const [getFrozenChildren, setFrozenChildren] = createSignal<JSX.Element>();

  // Set painted to true after DOM has had time to paint
  onMount(() => setTimeout(() => setPainted(true)));

  // Freeze children while element collapses to prevent UI from jumping
  createEffect(
    on<boolean, JSX.Element>(
      () => props.expanded,
      (expanded, _, prevChildren) => {
        if (!expanded) {
          setFrozenChildren(prevChildren);
          setTimeout(
            () => setFrozenChildren(),
            parseFloat(getComputedStyle(getElement()!).transitionDuration) *
              1000
          );
        }
        return props.children;
      }
    )
  );

  /**
   * Handles the expandable element height.
   */
  const handleElementHeight = () =>
    setElementHeight(props.expanded ? getElement()!.scrollHeight : 0);

  // Expand or collapse content when expanded prop change
  createEffect(on(() => props.expanded, handleElementHeight));

  // Update element height when window size change
  if (isClient) {
    makeEventListener(window, 'resize', handleElementHeight);
  }

  return (
    <div
      class={clsx(
        'h-0 origin-top',
        getPainted() && 'duration-200',
        !props.expanded && 'invisible -translate-y-2 scale-y-75 opacity-0',
        props.class
      )}
      ref={setElement}
      style={{ height: `${getElementHeight()}px` }}
      aria-hidden={!props.expanded}
    >
      {getFrozenChildren() || props.children}
    </div>
  );
}

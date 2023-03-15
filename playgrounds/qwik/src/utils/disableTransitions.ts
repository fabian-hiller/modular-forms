/**
 * Disables CSS transitions for a short moment.
 */
export function disableTransitions() {
  const { classList } = document.documentElement;
  classList.add('disable-transitions');
  setTimeout(() => classList.remove('disable-transitions'));
}

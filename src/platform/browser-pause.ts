/** Return a disposer so StrictMode remounts never accumulate browser listeners. */
export function observeBackgroundPause(onChange: (background: boolean) => void): () => void {
  const update = () => onChange(document.hidden || !document.hasFocus());
  window.addEventListener('blur', update);
  window.addEventListener('focus', update);
  document.addEventListener('visibilitychange', update);
  update();
  return () => {
    window.removeEventListener('blur', update);
    window.removeEventListener('focus', update);
    document.removeEventListener('visibilitychange', update);
  };
}

import { useEffect, useRef } from 'react';
export function InteractionDialog({
  message,
  close,
}: {
  message: { title: string; body: string };
  close: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (!ref.current?.open) ref.current?.showModal();
  }, []);
  return (
    <dialog
      ref={ref}
      className="interaction-dialog"
      aria-label={message.title}
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
    >
      <p className="eyebrow">A MOMENT IN THE CLEARING</p>
      <h2>{message.title}</h2>
      <p>{message.body}</p>
      <button className="button" autoFocus onClick={close}>
        Continue exploring
      </button>
    </dialog>
  );
}

export function downloadBackup(name: string, text: string) {
  const url = URL.createObjectURL(new Blob([text], { type: 'application/json' })),
    link = document.createElement('a');
  link.href = url;
  link.download = name;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

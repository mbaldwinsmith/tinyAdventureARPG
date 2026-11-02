/** Only validated JSON-shaped data enters the state owner. Copies cross adapter/save boundaries. */
export function copyData<T>(data: T): T {
  return structuredClone(data);
}
export function freezeData<T>(data: T): Readonly<T> {
  if (data !== null && typeof data === 'object') {
    for (const child of Object.values(data)) freezeData(child);
    Object.freeze(data);
  }
  return data;
}

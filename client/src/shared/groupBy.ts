export function groupBy<T, K extends keyof any>(
  array: T[],
  keyFunc: (t: T) => K
): Record<K, T[]> {
  return array.reduce((result, currentValue) => {
    const key = keyFunc(currentValue);
    (result[key] = result[key] || []).push(currentValue);
    return result;
  }, {} as Record<K, T[]>);
}
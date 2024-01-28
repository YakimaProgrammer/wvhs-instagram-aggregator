export function partition<T>(array: T[], filter: (e: T, idx: number, arr: T[]) => boolean) {
  let pass: T[] = [], fail: T[] = [];
  array.forEach((e, idx, arr) => (filter(e, idx, arr) ? pass : fail).push(e));
  return [pass, fail];
}
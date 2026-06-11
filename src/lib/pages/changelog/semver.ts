export const compareSemver = (a: string, b: string): number =>
  b.localeCompare(a, undefined, { numeric: true });

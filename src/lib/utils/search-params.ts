export function parseSearchParams(search: string): Record<string, unknown> {
  return Object.fromEntries(new URLSearchParams(search));
}

export function stringifySearchParams(search: Record<string, unknown>): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(search)) {
    if (value === undefined) {
      continue;
    }
    params.set(key, typeof value === 'string' ? value : JSON.stringify(value));
  }
  const searchStr = params.toString();
  return searchStr ? `?${searchStr}` : '';
}

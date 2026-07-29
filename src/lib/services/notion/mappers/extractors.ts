import type { NotionPage } from '@/lib/services/notion/types';

type NotionProperties = NotionPage['properties'];

export function getTitleText(
  properties: NotionProperties,
  key: string,
): string {
  const prop = properties[key as keyof NotionProperties];
  if (prop?.type !== 'title') {
    return '';
  }
  const title = prop.title as Array<{ plain_text: string }> | undefined;
  return title?.[0]?.plain_text ?? '';
}

export function getUrl(properties: NotionProperties, key: string): string {
  const prop = properties[key as keyof NotionProperties];
  if (prop?.type !== 'url') {
    return '';
  }
  const urlProp = prop as { url?: string | null };
  return urlProp.url ?? '';
}

export function getMultiSelectNames(
  properties: NotionProperties,
  key: string,
): Array<{ name: string }> {
  const prop = properties[key as keyof NotionProperties];
  if (prop?.type !== 'multi_select') {
    return [];
  }
  const multiSelect = prop as { multi_select: Array<{ name: string }> };
  return multiSelect.multi_select;
}

export function getCreatedTime(
  properties: NotionProperties,
  key: string,
): string {
  const prop = properties[key as keyof NotionProperties];
  if (prop?.type !== 'created_time') {
    return '';
  }
  const timeProp = prop as { created_time: string };
  return timeProp.created_time;
}

export function getFilesImage(
  properties: NotionProperties,
  key: string,
): string {
  const prop = properties[key as keyof NotionProperties];
  if (prop?.type !== 'files') {
    return '';
  }
  const files = (
    prop as {
      files: Array<{ external?: { url: string }; file?: { url: string } }>;
    }
  ).files;
  const first = files?.[0];
  return first?.external?.url ?? first?.file?.url ?? '';
}

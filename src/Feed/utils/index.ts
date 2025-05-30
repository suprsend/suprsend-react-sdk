import { Dictionary, ITranslations } from '@suprsend/react-core';

export function formatActionLink(link: string) {
  if (!link) return;

  return link.startsWith('http') || link.startsWith('/')
    ? link
    : `https://${link}`;
}

export async function isImgUrl(url?: string): Promise<boolean> {
  if (!url) return false;

  const img = new window.Image();
  img.src = url;
  return new Promise((resolve) => {
    img.onerror = () => resolve(false);
    img.onload = () => resolve(true);
  });
}

export function getLongFormattedTime(
  value: number,
  unit: string,
  t: (key: keyof ITranslations) => string
) {
  switch (unit) {
    case 'second':
      return `1 ${t('minute')}`;
    case 'minute':
      return value === 1
        ? `${value} ${t('minute')}`
        : `${value} ${t('minutes')}`;
    case 'hour':
      return value === 1 ? `${value} ${t('hour')}` : `${value} ${t('hours')}`;
    case 'day':
      return value === 1 ? `${value} ${t('day')}` : `${value} ${t('days')}`;
    case 'week':
      return value === 1 ? `${value} ${t('week')}` : `${value} ${t('weeks')}`;
    case 'month':
      return value === 1 ? `${value} ${t('month')}` : `${value} ${t('months')}`;
    case 'year':
      return value === 1 ? `${value} ${t('year')}` : `${value} ${t('years')}`;
    default:
      return value;
  }
}

export function getShortFormattedTime(value: number, unit: string) {
  switch (unit) {
    case 'second':
      return '1m';
    case 'minute':
      return `${value}m`;
    case 'hour':
      return `${value}h`;
    case 'day':
      return `${value}d`;
    case 'week':
      return `${value}w`;
    case 'month':
      return `${value}mo`;
    case 'year':
      return `${value}y`;
    default:
      return value;
  }
}

function isObject(item: unknown) {
  return item && typeof item === 'object' && !Array.isArray(item);
}

export function mergeDeep(target?: Dictionary, source?: Dictionary) {
  const output = Object.assign({}, target);
  if (target && isObject(target) && source && isObject(source)) {
    Object.keys(source).forEach((key) => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = mergeDeep(
            target[key] as Dictionary,
            source[key] as Dictionary
          );
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  return output;
}

function hasTouchSupport() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

export function isMobile() {
  return hasTouchSupport();
}

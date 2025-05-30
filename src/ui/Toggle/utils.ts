import useSendbird from '../../lib/Sendbird/context/hooks/useSendbird';

export function filterNumber(input: string | number): Array<number> {
  if (typeof input !== 'string' && typeof input !== 'number') {
    try {
      const { state: { config: { logger } } } = useSendbird();
      logger.warning('@sendbird/uikit-react/ui/Toggle: TypeError - expected string or number.', input);
    } catch (_) { /* noop */ }
    return [];
  }
  if (typeof input === 'number') {
    return [input];
  }
  const regex = /(-?\d+)(\.\d+)?/g;
  const numbers = input.match(regex) || [];
  return numbers.map(parseFloat);
}

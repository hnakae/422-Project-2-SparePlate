import type { WindowState } from '../types';

export function fmtTime(iso: string): string {
  const d = new Date(iso);
  let h = d.getHours();
  const m = d.getMinutes();
  const am = h < 12;
  h = h % 12 || 12;
  return `${h}:${m.toString().padStart(2, '0')}${am ? 'a' : 'p'}`;
}

export function windowState(win: { start: string; end: string }, now: Date): WindowState {
  const start = new Date(win.start);
  const end = new Date(win.end);
  const diffStart = (start.getTime() - now.getTime()) / 60000;
  const diffEnd = (end.getTime() - now.getTime()) / 60000;
  if (diffEnd < 0) return { kind: 'past', label: 'Window closed' };
  if (diffStart > 0) {
    if (diffStart < 90) return { kind: 'future', label: `Opens in ${Math.round(diffStart)}m` };
    return { kind: 'future', label: `Opens ${fmtTime(win.start)}` };
  }
  if (diffEnd < 60) return { kind: 'urgent', label: `Closes in ${Math.round(diffEnd)}m` };
  return { kind: 'now', label: `Open · until ${fmtTime(win.end)}` };
}

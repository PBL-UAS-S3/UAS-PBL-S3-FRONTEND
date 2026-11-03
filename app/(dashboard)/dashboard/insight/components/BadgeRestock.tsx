import type { Insight } from '../types';
import { sudahAman } from '../helpers';

export function BadgeRestock({ item }: { item: Insight }) {
  if (sudahAman(item)) {
    return (
      <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-sm font-bold px-3 py-1 rounded-full whitespace-nowrap">
        Aman
      </span>
    );
  }
  return (
    <span className="bg-amber-100 text-amber-900 border border-amber-300 text-sm font-bold px-3 py-1 rounded-full whitespace-nowrap">
      Perlu restock
    </span>
  );
}
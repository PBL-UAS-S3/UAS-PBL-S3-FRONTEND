import { api } from '@/lib/api';
import type { Insight } from '@/types/insight';

export function ambilInsight() {
  return api<Insight[]>('/ai-insights');
}

export function buatInsightBaru() {
  return api<{ error?: string }>('/ai-insights/generate', { method: 'POST' });
}
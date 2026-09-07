import { CommitmentType, HelpType } from './types';

export function formatTimeAgo(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays}d ago`;
  return `${Math.floor(diffInDays / 7)}w ago`;
}

export const COMMITMENT_OPTIONS: CommitmentType[] = [
  '1 day',
  'weekend',
  '1 week',
  'a few weeks',
  'ongoing but light',
  'not sure yet'
];

export const HELP_OPTIONS: HelpType[] = [
  'frontend',
  'backend',
  'mobile',
  'design',
  'UX',
  'prompt engineering',
  'testing',
  'content',
  'marketing',
  'automation',
  'game dev',
  'AI wiring',
  'polish',
  'bug fixing',
  'shipping help'
];

export function getCommitmentColor(commitment: CommitmentType): string {
  switch (commitment) {
    case '1 day':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200/60';
    case 'weekend':
      return 'bg-blue-50 text-blue-700 border-blue-200/60';
    case '1 week':
      return 'bg-indigo-50 text-indigo-700 border-indigo-200/60';
    case 'a few weeks':
      return 'bg-purple-50 text-purple-700 border-purple-200/60';
    case 'ongoing but light':
      return 'bg-amber-50 text-amber-700 border-amber-200/60';
    case 'not sure yet':
    default:
      return 'bg-zinc-100 text-zinc-700 border-zinc-200';
  }
}

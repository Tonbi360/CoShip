export type CommitmentType =
  | '1 day'
  | 'weekend'
  | '1 week'
  | 'a few weeks'
  | 'ongoing but light'
  | 'not sure yet';

export type HelpType =
  | 'frontend'
  | 'backend'
  | 'mobile'
  | 'design'
  | 'UX'
  | 'prompt engineering'
  | 'testing'
  | 'content'
  | 'marketing'
  | 'automation'
  | 'game dev'
  | 'AI wiring'
  | 'polish'
  | 'bug fixing'
  | 'shipping help';

export interface UserContact {
  type: 'discord' | 'telegram' | 'x' | 'email';
  handle: string;
}

export interface User {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  email?: string;
  github?: string;
  blurb: string;
  contact: UserContact;
}

export interface ExchangeNote {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
}

export interface JoinRequest {
  id: string;
  projectId: string;
  applicant: User;
  casualNote: string;
  applicantContact: UserContact;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
  exchangeNotes: ExchangeNote[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  projectLink?: string;
  owner: User;
  helpNeeded: HelpType[];
  commitment: CommitmentType;
  maxContributors: number;
  createdAt: string; // ISO string
  status: 'open' | 'matched' | 'closed';
  requests: JoinRequest[];
  contributorIds: string[]; // marked as contributed
}

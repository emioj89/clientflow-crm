export type ContactType = 'lead' | 'client';

export type ContactStatus = 'new' | 'contacted' | 'qualified' | 'won' | 'lost';

export interface Contact {
  id: string;
  user_id: string;
  name: string;
  company: string | null;
  email: string | null;
  phone: string | null;
  type: ContactType;
  status: ContactStatus;
  estimated_value: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContactFormData {
  name: string;
  company: string;
  email: string;
  phone: string;
  type: ContactType;
  status: ContactStatus;
  estimated_value: number;
  notes: string;
}

export interface ContactStats {
  totalContacts: number;
  leadsCount: number;
  clientsCount: number;
  qualifiedCount: number;
  wonCount: number;
  pipelineValue: number;
}

export type SortField = 'newest' | 'oldest' | 'name-asc' | 'value-desc' | 'value-asc';


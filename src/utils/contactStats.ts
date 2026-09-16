import type { Contact, ContactStats } from '../types/contact';

/**
 * Calculates CRM KPI metrics from a set of contacts.
 * Pipeline Value sums estimated_value of all non-lost opportunities (status !== 'lost').
 * Qualified Leads counts only contacts where type === 'lead' AND status === 'qualified'.
 */
export function calculateContactStats(contacts: Contact[]): ContactStats {
  if (!contacts || contacts.length === 0) {
    return {
      totalContacts: 0,
      leadsCount: 0,
      clientsCount: 0,
      qualifiedCount: 0,
      wonCount: 0,
      pipelineValue: 0,
    };
  }

  let leadsCount = 0;
  let clientsCount = 0;
  let qualifiedCount = 0;
  let wonCount = 0;
  let pipelineValue = 0;

  for (const contact of contacts) {
    if (contact.type === 'lead') {
      leadsCount += 1;
      if (contact.status === 'qualified') {
        qualifiedCount += 1;
      }
    } else if (contact.type === 'client') {
      clientsCount += 1;
    }

    if (contact.status === 'won') {
      wonCount += 1;
    }

    // Pipeline Value sums estimated_value for all non-lost opportunities (status !== 'lost')
    if (contact.status !== 'lost') {
      pipelineValue += Number(contact.estimated_value) || 0;
    }
  }

  return {
    totalContacts: contacts.length,
    leadsCount,
    clientsCount,
    qualifiedCount,
    wonCount,
    pipelineValue: Number(pipelineValue.toFixed(2)),
  };
}

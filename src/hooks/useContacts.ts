import { useCallback, useEffect, useState } from 'react';
import { contactsService } from '../services/contactsService';
import type { Contact, ContactFormData } from '../types/contact';
import { useAuth } from '../context/AuthContext';

export function useContacts() {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContacts = useCallback(async () => {
    if (!user) {
      setContacts([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await contactsService.getContacts();
      setContacts(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unable to load your contacts. Please try again.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const createContact = async (formData: ContactFormData): Promise<Contact> => {
    if (!user) throw new Error('User is not authenticated.');
    const newContact = await contactsService.createContact(formData);
    setContacts((prev) => [newContact, ...prev]);
    return newContact;
  };

  const updateContact = async (id: string, formData: Partial<ContactFormData>): Promise<Contact> => {
    const updated = await contactsService.updateContact(id, formData);
    setContacts((prev) => prev.map((c) => (c.id === id ? updated : c)));
    return updated;
  };

  const deleteContact = async (id: string): Promise<void> => {
    await contactsService.deleteContact(id);
    setContacts((prev) => prev.filter((c) => c.id !== id));
  };

  return {
    contacts,
    isLoading,
    error,
    refetch: fetchContacts,
    createContact,
    updateContact,
    deleteContact,
  };
}

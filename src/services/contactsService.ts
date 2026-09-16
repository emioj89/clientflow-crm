import { getSupabaseClient } from '../lib/supabase';
import type { Contact, ContactFormData } from '../types/contact';

export const contactsService = {
  async getContacts(): Promise<Contact[]> {
    const client = getSupabaseClient();

    const { data, error } = await client
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error('Unable to load your contacts. Please try again.');
    }

    return (data as Contact[]) || [];
  },

  async getContactById(id: string): Promise<Contact> {
    const client = getSupabaseClient();

    const { data, error } = await client
      .from('contacts')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      throw new Error('Unable to load this contact. Please try again.');
    }

    return data as Contact;
  },

  async createContact(formData: ContactFormData): Promise<Contact> {
    const client = getSupabaseClient();

    const { data: userData, error: userError } = await client.auth.getUser();
    if (userError || !userData.user) {
      throw new Error('Unable to create the contact. Please try again.');
    }

    const payload = {
      user_id: userData.user.id,
      name: formData.name.trim(),
      company: formData.company.trim() || null,
      email: formData.email.trim() || null,
      phone: formData.phone.trim() || null,
      type: formData.type,
      status: formData.status,
      estimated_value: Number(formData.estimated_value) || 0,
      notes: formData.notes.trim() || null,
    };

    const { data, error } = await client
      .from('contacts')
      .insert([payload])
      .select()
      .single();

    if (error || !data) {
      throw new Error('Unable to create the contact. Please try again.');
    }

    return data as Contact;
  },

  async updateContact(id: string, formData: Partial<ContactFormData>): Promise<Contact> {
    const client = getSupabaseClient();

    const payload: Record<string, unknown> = {};
    if (formData.name !== undefined) payload.name = formData.name.trim();
    if (formData.company !== undefined) payload.company = formData.company.trim() || null;
    if (formData.email !== undefined) payload.email = formData.email.trim() || null;
    if (formData.phone !== undefined) payload.phone = formData.phone.trim() || null;
    if (formData.type !== undefined) payload.type = formData.type;
    if (formData.status !== undefined) payload.status = formData.status;
    if (formData.estimated_value !== undefined) payload.estimated_value = Number(formData.estimated_value) || 0;
    if (formData.notes !== undefined) payload.notes = formData.notes.trim() || null;

    const { data, error } = await client
      .from('contacts')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      throw new Error('Unable to save the changes. Please try again.');
    }

    return data as Contact;
  },

  async deleteContact(id: string): Promise<void> {
    const client = getSupabaseClient();

    const { error } = await client
      .from('contacts')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error('Unable to delete the contact. Please try again.');
    }
  },
};

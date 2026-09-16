import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useContacts } from '../hooks/useContacts';
import { contactsService } from '../services/contactsService';
import type { ContactFormData } from '../types/contact';
import { ContactForm } from '../components/contacts/ContactForm';
import { LoadingState } from '../components/ui/LoadingState';
import { ErrorState } from '../components/ui/ErrorState';

export const ContactFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const { createContact, updateContact } = useContacts();

  const [initialData, setInitialData] = useState<ContactFormData | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(isEditMode);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!isEditMode || !id) return;

    const fetchExistingContact = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const contact = await contactsService.getContactById(id);
        setInitialData({
          name: contact.name,
          company: contact.company || '',
          email: contact.email || '',
          phone: contact.phone || '',
          type: contact.type,
          status: contact.status,
          estimated_value: contact.estimated_value,
          notes: contact.notes || '',
        });
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Unable to load contact data for editing.';
        setError(msg);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExistingContact();
  }, [id, isEditMode]);

  const handleSubmit = async (formData: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      if (isEditMode && id) {
        await updateContact(id, formData);
        navigate(`/contacts/${id}`);
      } else {
        const created = await createContact(formData);
        navigate(`/contacts/${created.id}`);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save contact. Please try again.';
      setSubmitError(msg);
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (isEditMode && id) {
      navigate(`/contacts/${id}`);
    } else {
      navigate('/contacts');
    }
  };

  if (isLoading) {
    return <LoadingState message="Loading contact record for editing..." />;
  }

  if (error) {
    return (
      <ErrorState
        title="Contact not found"
        message={error}
        onRetry={() => navigate('/contacts')}
      />
    );
  }

  return (
    <div className="page-container page-container--narrow">
      <div className="page-header">
        <div>
          <h2 className="page-title">{isEditMode ? 'Edit Contact' : 'Create New Contact'}</h2>
          <p className="page-subtitle">
            {isEditMode
              ? 'Update commercial details and pipeline status'
              : 'Add a new lead or client opportunity to your pipeline'}
          </p>
        </div>
      </div>

      {submitError && (
        <div className="alert alert--error" role="alert">
          {submitError}
        </div>
      )}

      <div className="form-card">
        <ContactForm
          initialData={initialData}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
          submitLabel={isEditMode ? 'Save Changes' : 'Create Contact'}
        />
      </div>
    </div>
  );
};


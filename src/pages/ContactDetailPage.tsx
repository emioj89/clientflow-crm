import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { contactsService } from '../services/contactsService';
import type { Contact } from '../types/contact';
import { formatCurrency, formatDate, capitalize } from '../utils/formatters';
import { LoadingState } from '../components/ui/LoadingState';
import { ErrorState } from '../components/ui/ErrorState';

export const ContactDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [contact, setContact] = useState<Contact | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchContact = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await contactsService.getContactById(id);
      setContact(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unable to load contact details.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchContact();
  }, [fetchContact]);

  const handleDelete = async () => {
    if (!id || !contact) return;
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${contact.name}"? This action cannot be undone.`
    );
    if (!confirmDelete) return;

    setIsDeleting(true);
    try {
      await contactsService.deleteContact(id);
      navigate('/contacts', { replace: true });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete contact.';
      alert(msg);
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return <LoadingState message="Loading contact profile..." />;
  }

  if (error || !contact) {
    return (
      <ErrorState
        title="Contact not found"
        message={error || 'The requested contact does not exist or was deleted.'}
        onRetry={fetchContact}
      />
    );
  }

  return (
    <div className="page-container">
      <div className="detail-navigation">
        <Link to="/contacts" className="back-link">
          ← Back to Contacts
        </Link>
      </div>

      <div className="detail-card">
        <div className="detail-card__header">
          <div>
            <div className="detail-title-group">
              <h2 className="detail-name">{contact.name}</h2>
              <span className={`badge badge--type-${contact.type}`}>
                {capitalize(contact.type)}
              </span>
              <span className={`badge badge--status-${contact.status}`}>
                {capitalize(contact.status)}
              </span>
            </div>
            {contact.company && <p className="detail-company">🏢 {contact.company}</p>}
          </div>

          <div className="detail-actions">
            <Link to={`/contacts/${contact.id}/edit`} className="btn btn--outline">
              ✏️ Edit
            </Link>
            <button
              type="button"
              className="btn btn--danger"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : '🗑️ Delete'}
            </button>
          </div>
        </div>

        <div className="detail-card__grid">
          <div className="info-block">
            <span className="info-label">Estimated Deal Value</span>
            <span className="info-value font-semibold text-lg">
              {formatCurrency(contact.estimated_value)}
            </span>
          </div>

          <div className="info-block">
            <span className="info-label">Email Address</span>
            {contact.email ? (
              <a href={`mailto:${contact.email}`} className="email-link info-value">
                {contact.email}
              </a>
            ) : (
              <span className="info-value text-muted">Not provided</span>
            )}
          </div>

          <div className="info-block">
            <span className="info-label">Phone Number</span>
            {contact.phone ? (
              <a href={`tel:${contact.phone}`} className="info-value">
                {contact.phone}
              </a>
            ) : (
              <span className="info-value text-muted">Not provided</span>
            )}
          </div>

          <div className="info-block">
            <span className="info-label">Created Date</span>
            <span className="info-value">{formatDate(contact.created_at)}</span>
          </div>

          <div className="info-block">
            <span className="info-label">Last Updated</span>
            <span className="info-value">{formatDate(contact.updated_at)}</span>
          </div>
        </div>

        {contact.notes && (
          <div className="detail-notes-section">
            <h4 className="notes-title">Commercial History & Notes</h4>
            <div className="notes-content">{contact.notes}</div>
          </div>
        )}
      </div>
    </div>
  );
};

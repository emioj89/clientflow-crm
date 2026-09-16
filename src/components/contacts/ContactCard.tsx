import React from 'react';
import { Link } from 'react-router-dom';
import type { Contact } from '../../types/contact';
import { formatCurrency, formatDate, capitalize } from '../../utils/formatters';

interface ContactCardProps {
  contact: Contact;
}

export const ContactCard: React.FC<ContactCardProps> = ({ contact }) => {
  return (
    <div className="contact-card">
      <div className="contact-card__header">
        <div>
          <Link to={`/contacts/${contact.id}`} className="contact-card__title">
            {contact.name}
          </Link>
          {contact.company && <div className="contact-card__subtitle">{contact.company}</div>}
        </div>
        <span className={`badge badge--type-${contact.type}`}>
          {capitalize(contact.type)}
        </span>
      </div>

      <div className="contact-card__body">
        <div className="contact-card__meta">
          <span className="meta-label">Status:</span>
          <span className={`badge badge--status-${contact.status}`}>
            {capitalize(contact.status)}
          </span>
        </div>

        <div className="contact-card__meta">
          <span className="meta-label">Est. Value:</span>
          <span className="meta-value font-semibold">
            {formatCurrency(contact.estimated_value)}
          </span>
        </div>

        {contact.email && (
          <div className="contact-card__meta">
            <span className="meta-label">Email:</span>
            <a href={`mailto:${contact.email}`} className="email-link meta-value truncate">
              {contact.email}
            </a>
          </div>
        )}

        {contact.phone && (
          <div className="contact-card__meta">
            <span className="meta-label">Phone:</span>
            <span className="meta-value">{contact.phone}</span>
          </div>
        )}
      </div>

      <div className="contact-card__footer">
        <span className="text-muted text-xs">Updated {formatDate(contact.updated_at)}</span>
        <div className="table-actions">
          <Link to={`/contacts/${contact.id}`} className="btn btn--outline btn--sm">
            View
          </Link>
          <Link to={`/contacts/${contact.id}/edit`} className="btn btn--outline btn--sm">
            Edit
          </Link>
        </div>
      </div>
    </div>
  );
};


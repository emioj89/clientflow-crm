import React from 'react';
import { Link } from 'react-router-dom';
import type { Contact } from '../../types/contact';
import { formatCurrency, formatDate, capitalize } from '../../utils/formatters';

interface ContactsTableProps {
  contacts: Contact[];
}

export const ContactsTable: React.FC<ContactsTableProps> = ({ contacts }) => {
  return (
    <div className="table-responsive">
      <table className="contacts-table">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Company</th>
            <th scope="col">Type</th>
            <th scope="col">Status</th>
            <th scope="col">Email</th>
            <th scope="col">Est. Value</th>
            <th scope="col">Updated At</th>
            <th scope="col" className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((contact) => (
            <tr key={contact.id} className="contact-row">
              <td className="font-semibold">
                <Link to={`/contacts/${contact.id}`} className="contact-name-link">
                  {contact.name}
                </Link>
              </td>
              <td>{contact.company || '—'}</td>
              <td>
                <span className={`badge badge--type-${contact.type}`}>
                  {capitalize(contact.type)}
                </span>
              </td>
              <td>
                <span className={`badge badge--status-${contact.status}`}>
                  {capitalize(contact.status)}
                </span>
              </td>
              <td>
                {contact.email ? (
                  <a href={`mailto:${contact.email}`} className="email-link">
                    {contact.email}
                  </a>
                ) : (
                  '—'
                )}
              </td>
              <td className="font-medium">{formatCurrency(contact.estimated_value)}</td>
              <td className="text-muted">{formatDate(contact.updated_at)}</td>
              <td className="text-right">
                <div className="table-actions">
                  <Link
                    to={`/contacts/${contact.id}`}
                    className="btn btn--icon btn--sm"
                    title="View details"
                    aria-label={`View details for ${contact.name}`}
                  >
                    👁️
                  </Link>
                  <Link
                    to={`/contacts/${contact.id}/edit`}
                    className="btn btn--icon btn--sm"
                    title="Edit contact"
                    aria-label={`Edit ${contact.name}`}
                  >
                    ✏️
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


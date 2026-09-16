import React, { useState } from 'react';
import type { ContactFormData } from '../../types/contact';

interface ContactFormProps {
  initialData?: ContactFormData;
  onSubmit: (data: ContactFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
  submitLabel: string;
}

const defaultFormData: ContactFormData = {
  name: '',
  company: '',
  email: '',
  phone: '',
  type: 'lead',
  status: 'new',
  estimated_value: 0,
  notes: '',
};

export const ContactForm: React.FC<ContactFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting,
  submitLabel,
}) => {
  const [formData, setFormData] = useState<ContactFormData>(initialData || defaultFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required.';
    }

    if (formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = 'Please enter a valid email address.';
      }
    }

    if (formData.estimated_value < 0) {
      newErrors.estimated_value = 'Estimated value cannot be negative.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'estimated_value' ? Math.max(0, Number(value) || 0) : value,
    }));
    // Clear field error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="contact-form" noValidate>
      <div className="form-grid">
        <div className="form-group col-span-2">
          <label htmlFor="name" className="form-label">
            Full Name <span className="required-asterisk">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            className={`form-control ${errors.name ? 'form-control--error' : ''}`}
            placeholder="e.g. Jane Doe"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          />
          {errors.name && <span className="field-error-text">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="company" className="form-label">
            Company
          </label>
          <input
            id="company"
            name="company"
            type="text"
            className="form-control"
            placeholder="e.g. Acme Corp"
            value={formData.company}
            onChange={handleChange}
            disabled={isSubmitting}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className={`form-control ${errors.email ? 'form-control--error' : ''}`}
            placeholder="e.g. jane@acme.com"
            value={formData.email}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          {errors.email && <span className="field-error-text">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="phone" className="form-label">
            Phone Number
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            className="form-control"
            placeholder="e.g. +1 (555) 000-0000"
            value={formData.phone}
            onChange={handleChange}
            disabled={isSubmitting}
          />
        </div>

        <div className="form-group">
          <label htmlFor="estimated_value" className="form-label">
            Estimated Value ($)
          </label>
          <input
            id="estimated_value"
            name="estimated_value"
            type="number"
            min="0"
            step="any"
            className={`form-control ${errors.estimated_value ? 'form-control--error' : ''}`}
            placeholder="0"
            value={formData.estimated_value}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          {errors.estimated_value && (
            <span className="field-error-text">{errors.estimated_value}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="type" className="form-label">
            Contact Type <span className="required-asterisk">*</span>
          </label>
          <select
            id="type"
            name="type"
            className="form-select"
            value={formData.type}
            onChange={handleChange}
            disabled={isSubmitting}
          >
            <option value="lead">Lead</option>
            <option value="client">Client</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="status" className="form-label">
            Pipeline Status <span className="required-asterisk">*</span>
          </label>
          <select
            id="status"
            name="status"
            className="form-select"
            value={formData.status}
            onChange={handleChange}
            disabled={isSubmitting}
          >
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="won">Won</option>
            <option value="lost">Lost</option>
          </select>
        </div>

        <div className="form-group col-span-2">
          <label htmlFor="notes" className="form-label">
            Notes & Commercial History
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={4}
            className="form-control"
            placeholder="Add relevant deal notes, background details, or meeting summaries..."
            value={formData.notes}
            onChange={handleChange}
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div className="form-actions">
        <button
          type="button"
          className="btn btn--outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button type="submit" className="btn btn--primary" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  );
};

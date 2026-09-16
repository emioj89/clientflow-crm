import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useContacts } from '../hooks/useContacts';
import { calculateContactStats } from '../utils/contactStats';
import { formatCurrency, formatDate, capitalize } from '../utils/formatters';
import { KpiCard } from '../components/ui/KpiCard';
import { LoadingState } from '../components/ui/LoadingState';
import { ErrorState } from '../components/ui/ErrorState';

export const DashboardPage: React.FC = () => {
  const { contacts, isLoading, error, refetch } = useContacts();

  const stats = useMemo(() => {
    return calculateContactStats(contacts);
  }, [contacts]);

  const recentContacts = useMemo(() => {
    return contacts.slice(0, 5);
  }, [contacts]);

  if (isLoading) {
    return <LoadingState message="Calculating metrics and loading pipeline..." />;
  }

  if (error) {
    return (
      <ErrorState
        title="Unable to load dashboard metrics"
        message={error}
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2 className="page-title">Executive Dashboard</h2>
          <p className="page-subtitle">
            Overview of commercial performance and commercial deal pipeline.
          </p>
        </div>
        <Link to="/contacts/new" className="btn btn--primary">
          ➕ New Contact
        </Link>
      </div>

      {/* KPI Section */}
      <section className="kpi-grid" aria-label="Key Performance Indicators">
        <KpiCard
          title="Total Contacts"
          value={stats.totalContacts}
          icon="👥"
          subtext="Total registered leads & clients"
          badgeType="default"
        />
        <KpiCard
          title="Leads"
          value={stats.leadsCount}
          icon="🎯"
          subtext="Prospects in pipeline"
          badgeType="info"
        />
        <KpiCard
          title="Clients"
          value={stats.clientsCount}
          icon="🤝"
          subtext="Registered client accounts"
          badgeType="success"
        />
        <KpiCard
          title="Qualified Leads"
          value={stats.qualifiedCount}
          icon="⭐"
          subtext="Leads ready for the next sales step"
          badgeType="info"
        />
        <KpiCard
          title="Won Opportunities"
          value={stats.wonCount}
          icon="🏆"
          subtext="Closed won revenue deals"
          badgeType="success"
        />
        <KpiCard
          title="Pipeline Value"
          value={formatCurrency(stats.pipelineValue)}
          icon="💰"
          subtext="Value of all non-lost opportunities"
          badgeType="success"
        />
      </section>

      {/* Recent Contacts Section */}
      <section className="dashboard-section">
        <div className="section-header">
          <div>
            <h3 className="section-title">Recent Contacts</h3>
            <p className="section-subtitle">Latest commercial entries added to your CRM</p>
          </div>
          <Link to="/contacts" className="btn btn--outline btn--sm">
            View All Contacts ({contacts.length})
          </Link>
        </div>

        {recentContacts.length === 0 ? (
          <div className="empty-panel">
            <p className="text-muted">No contacts created yet.</p>
            <Link to="/contacts/new" className="btn btn--primary btn--sm margin-top-sm">
              Create Your First Contact
            </Link>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="contacts-table">
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Company</th>
                  <th scope="col">Type</th>
                  <th scope="col">Status</th>
                  <th scope="col">Value</th>
                  <th scope="col">Added</th>
                </tr>
              </thead>
              <tbody>
                {recentContacts.map((contact) => (
                  <tr key={contact.id}>
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
                    <td className="font-medium">{formatCurrency(contact.estimated_value)}</td>
                    <td className="text-muted">{formatDate(contact.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};


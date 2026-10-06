import { useCallback, useEffect, useState } from 'react';
import api from '../api/axios.js';
import Navbar from '../components/Navbar.jsx';
import StatCard from '../components/StatCard.jsx';
import ApplicationCard from '../components/ApplicationCard.jsx';
import ApplicationModal from '../components/ApplicationModal.jsx';
import { STATUS_STYLES } from '../constants/status.js';

const COLUMNS = [
  { status: 'applied', title: 'Applied' },
  { status: 'interview', title: 'Interview' },
  { status: 'offer', title: 'Offer' },
  { status: 'rejected', title: 'Rejected' },
];

export default function Dashboard() {
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingApplication, setEditingApplication] = useState(null);

  const loadApplications = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (search) params.search = search;

      const [appsRes, statsRes] = await Promise.all([
        api.get('/applications', { params }),
        api.get('/applications/stats'),
      ]);
      setApplications(appsRes.data);
      setStats(statsRes.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load applications.');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search]);

  useEffect(() => {
    const timer = setTimeout(loadApplications, 300);
    return () => clearTimeout(timer);
  }, [loadApplications]);

  const refreshStats = async () => {
    try {
      const res = await api.get('/applications/stats');
      setStats(res.data);
    } catch {
      // stats refresh failures are non-fatal
    }
  };

  const handleOpenAdd = () => {
    setEditingApplication(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (application) => {
    setEditingApplication(application);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingApplication(null);
  };

  const handleSave = async (form, id) => {
    if (id) {
      const res = await api.patch(`/applications/${id}`, form);
      setApplications((prev) => prev.map((app) => (app._id === id ? res.data : app)));
    } else {
      const res = await api.post('/applications', form);
      setApplications((prev) => [res.data, ...prev]);
    }
    refreshStats();
  };

  const handleDelete = async (id) => {
    await api.delete(`/applications/${id}`);
    setApplications((prev) => prev.filter((app) => app._id !== id));
    refreshStats();
  };

  const handleStatusChange = async (id, status) => {
    try {
      const res = await api.patch(`/applications/${id}`, { status });
      setApplications((prev) => prev.map((app) => (app._id === id ? res.data : app)));
      refreshStats();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update status.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50/60 via-slate-50 to-slate-50">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-6">
        {error && (
          <div className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard label="Total" value={stats ? stats.total : '-'} accent="indigo" icon="📊" />
          <StatCard label="Interviews" value={stats ? stats.interview : '-'} accent="amber" icon="🗣️" />
          <StatCard label="Offers" value={stats ? stats.offer : '-'} accent="emerald" icon="🎉" />
          <StatCard label="Response Rate" value={stats ? `${stats.responseRate}%` : '-'} accent="violet" icon="📈" />
        </div>

        <div className="mb-6 flex flex-wrap items-center gap-3">
          <input
            type="text"
            placeholder="Search company or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          >
            <option value="">All statuses</option>
            <option value="applied">Applied</option>
            <option value="interview">Interview</option>
            <option value="offer">Offer</option>
            <option value="rejected">Rejected</option>
          </select>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="ml-auto rounded-md bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:from-indigo-500 hover:to-violet-500"
          >
            + Add Application
          </button>
        </div>

        {loading ? (
          <div className="py-16 text-center text-slate-500">Loading applications...</div>
        ) : applications.length === 0 ? (
          <div className="rounded-xl border border-dashed border-indigo-200 bg-white py-16 text-center">
            <p className="text-3xl">📝</p>
            <p className="mt-2 text-slate-600">No applications yet.</p>
            <p className="mt-1 text-sm text-slate-400">
              Click "Add Application" to log the first one you sent.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {COLUMNS.map((column) => {
              const columnApps = applications.filter((app) => app.status === column.status);
              const styles = STATUS_STYLES[column.status];
              return (
                <div key={column.status} className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-100">
                  <div className={`h-1.5 ${styles.bar}`} />
                  <div className="p-3">
                    <h3 className="mb-3 flex items-center justify-between text-sm font-semibold text-slate-700">
                      <span className="flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${styles.dot}`} />
                        {column.title}
                      </span>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${styles.badge}`}>
                        {columnApps.length}
                      </span>
                    </h3>
                    <div className="space-y-3">
                      {columnApps.length === 0 ? (
                        <p className="text-xs text-slate-400">Nothing here yet.</p>
                      ) : (
                        columnApps.map((app) => (
                          <ApplicationCard
                            key={app._id}
                            application={app}
                            onClick={handleOpenEdit}
                            onStatusChange={handleStatusChange}
                          />
                        ))
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <ApplicationModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        onDelete={handleDelete}
        initialData={editingApplication}
      />
    </div>
  );
}

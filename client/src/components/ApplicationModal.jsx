import { useEffect, useState } from 'react';
import { STATUS_OPTIONS, STATUS_LABELS, STATUS_STYLES } from '../constants/status.js';

const emptyForm = {
  company: '',
  role: '',
  status: 'applied',
  dateApplied: new Date().toISOString().slice(0, 10),
  jobLink: '',
  salary: '',
  location: '',
  notes: '',
};

export default function ApplicationModal({ isOpen, onClose, onSave, onDelete, initialData }) {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const isEdit = Boolean(initialData);

  useEffect(() => {
    if (!isOpen) return;
    setError('');
    setConfirmingDelete(false);
    if (initialData) {
      setForm({
        company: initialData.company || '',
        role: initialData.role || '',
        status: initialData.status || 'applied',
        dateApplied: initialData.dateApplied
          ? new Date(initialData.dateApplied).toISOString().slice(0, 10)
          : new Date().toISOString().slice(0, 10),
        jobLink: initialData.jobLink || '',
        salary: initialData.salary || '',
        location: initialData.location || '',
        notes: initialData.notes || '',
      });
    } else {
      setForm(emptyForm);
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.company.trim() || !form.role.trim()) {
      setError('Company and role are required');
      return;
    }

    setSubmitting(true);
    try {
      await onSave(form, initialData?._id);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setSubmitting(true);
    try {
      await onDelete(initialData._id);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not delete application.');
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-4">
          <h2 className="text-lg font-semibold text-slate-900">
            {isEdit ? 'Edit application' : 'Add application'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Company *</label>
              <input
                name="company"
                value={form.company}
                onChange={handleChange}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Role *</label>
              <input
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className={`w-full rounded-md border px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 ${STATUS_STYLES[form.status].select}`}
              >
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>{STATUS_LABELS[status]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Date applied</label>
              <input
                type="date"
                name="dateApplied"
                value={form.dateApplied}
                onChange={handleChange}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Job link</label>
            <input
              name="jobLink"
              value={form.jobLink}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Salary</label>
              <input
                name="salary"
                value={form.salary}
                onChange={handleChange}
                placeholder="e.g. 6 LPA"
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Location</label>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Notes</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <div>
              {isEdit && !confirmingDelete && (
                <button
                  type="button"
                  onClick={() => setConfirmingDelete(true)}
                  className="text-sm font-medium text-red-600 hover:text-red-700"
                >
                  Delete
                </button>
              )}
              {isEdit && confirmingDelete && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-slate-600">Delete this application?</span>
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={submitting}
                    className="font-medium text-red-600 hover:text-red-700"
                  >
                    Yes, delete
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmingDelete(false)}
                    className="font-medium text-slate-500 hover:text-slate-700"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="rounded-md bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-indigo-500 hover:to-violet-500 disabled:opacity-60"
              >
                {submitting ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

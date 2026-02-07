import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import api from "../api/axios";
import { useNotifications } from "../context/NotificationsContext";

const STATUS_OPTIONS = ["Applied", "Interview", "Offer", "Rejected"];
const STATUS_STYLES = {
  Applied: "border-blue-200 text-blue-700 hover:bg-blue-50",
  Interview: "border-amber-200 text-amber-700 hover:bg-amber-50",
  Offer: "border-emerald-200 text-emerald-700 hover:bg-emerald-50",
  Rejected: "border-red-200 text-red-700 hover:bg-red-50",
};
const STATUS_ACTIVE = {
  Applied: "bg-blue-100 text-blue-800 border-blue-200",
  Interview: "bg-amber-100 text-amber-800 border-amber-200",
  Offer: "bg-emerald-100 text-emerald-800 border-emerald-200",
  Rejected: "bg-red-100 text-red-800 border-red-200",
};

export default function JobCard({ job, onUpdate, onDelete, expandOnEdit = false }) {
  const { addNotification } = useNotifications();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const toDateInput = (value) =>
    value ? new Date(value).toISOString().slice(0, 10) : "";
  const [checklistItems, setChecklistItems] = useState(
    Array.isArray(job.checklist) ? job.checklist : []
  );
  const [newChecklistItem, setNewChecklistItem] = useState("");
  const [form, setForm] = useState({
    company: job.company,
    role: job.role,
    jobDescription: job.jobDescription || "",
    status: job.status,
    appliedDate: job.appliedDate ? job.appliedDate.slice(0, 10) : "",
    interviewDate: toDateInput(job.interviewDate),
    reminderAt: toDateInput(job.reminderAt),
    notes: job.notes || "",
  });

  useEffect(() => {
    setChecklistItems(Array.isArray(job.checklist) ? job.checklist : []);
  }, [job.checklist]);

  const handleSave = async () => {
    setLoading(true);
    try {
      await api.put(`/jobs/${job._id}`, {
        ...form,
        appliedDate: form.appliedDate || undefined,
        interviewDate: form.interviewDate || undefined,
        reminderAt: form.reminderAt || undefined,
        notes: form.notes || undefined,
        checklist: checklistItems,
      });
      onUpdate?.();
      setIsEditing(false);
      addNotification({
        title: "Job updated",
        message: `${form.company} · ${form.role}`,
        type: "success",
      });
    } catch (err) {
      console.error(err);
      addNotification({
        title: "Update failed",
        message: err.response?.data?.message || "Could not update job",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await api.delete(`/jobs/${job._id}`);
      onDelete?.();
      addNotification({
        title: "Job deleted",
        message: `${job.company} · ${job.role}`,
        type: "success",
      });
    } catch (err) {
      console.error(err);
      addNotification({
        title: "Delete failed",
        message: err.response?.data?.message || "Could not delete job",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    setLoading(true);
    try {
      await api.put(`/jobs/${job._id}`, { ...job, status: newStatus });
      onUpdate?.();
      addNotification({
        title: "Status updated",
        message: `${job.company} moved to ${newStatus}`,
        type: "success",
      });
    } catch (err) {
      console.error(err);
      addNotification({
        title: "Status update failed",
        message: err.response?.data?.message || "Could not update status",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePin = async () => {
    setLoading(true);
    try {
      await api.put(`/jobs/${job._id}`, { ...job, pinned: !job.pinned });
      onUpdate?.();
      addNotification({
        title: job.pinned ? "Unpinned job" : "Pinned job",
        message: `${job.company} · ${job.role}`,
        type: "success",
      });
    } catch (err) {
      console.error(err);
      addNotification({
        title: "Pin failed",
        message: err.response?.data?.message || "Could not update pin",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReminder = async (date) => {
    setLoading(true);
    try {
      await api.put(`/jobs/${job._id}`, { ...job, reminderAt: date || null });
      onUpdate?.();
      addNotification({
        title: date ? "Reminder set" : "Reminder cleared",
        message: `${job.company} · ${job.role}`,
        type: "success",
      });
    } catch (err) {
      console.error(err);
      addNotification({
        title: "Reminder update failed",
        message: err.response?.data?.message || "Could not update reminder",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleChecklistItem = async (index) => {
    const updated = checklistItems.map((item, idx) =>
      idx === index ? { ...item, done: !item.done } : item
    );
    setChecklistItems(updated);
    setLoading(true);
    try {
      await api.put(`/jobs/${job._id}`, { ...job, checklist: updated });
      onUpdate?.();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddChecklistItem = () => {
    const text = newChecklistItem.trim();
    if (!text) return;
    setChecklistItems((prev) => [...prev, { text, done: false }]);
    setNewChecklistItem("");
  };

  const handleRemoveChecklistItem = (index) => {
    setChecklistItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  const editForm = (
    <div className="card p-6 animate-slide-up max-h-[85vh] overflow-auto">
      <div className="mb-3">
        <p className="text-xs uppercase tracking-wide text-slate-400">Edit Job</p>
        <h3 className="text-lg font-semibold text-slate-900">
          {form.company || "Company"} · {form.role || "Role"}
        </h3>
      </div>
      <input
        className="input-field mb-3"
        placeholder="Company"
        value={form.company}
        onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
      />
      <input
        className="input-field mb-3"
        placeholder="Role"
        value={form.role}
        onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
      />
      <textarea
        className="input-field mb-3 min-h-[64px] resize-none"
        placeholder="Job description (optional)"
        value={form.jobDescription}
        onChange={(e) =>
          setForm((f) => ({ ...f, jobDescription: e.target.value }))
        }
      />
      <textarea
        className="input-field mb-3 min-h-[64px] resize-none"
        placeholder="Notes (optional)"
        value={form.notes}
        onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
      />
      <input
        type="date"
        className="input-field mb-4"
        value={form.appliedDate}
        onChange={(e) =>
          setForm((f) => ({ ...f, appliedDate: e.target.value }))
        }
      />
      <input
        type="date"
        className="input-field mb-4"
        value={form.interviewDate}
        onChange={(e) =>
          setForm((f) => ({ ...f, interviewDate: e.target.value }))
        }
        placeholder="Interview date"
      />
      <input
        type="date"
        className="input-field mb-4"
        value={form.reminderAt}
        onChange={(e) =>
          setForm((f) => ({ ...f, reminderAt: e.target.value }))
        }
        placeholder="Reminder date"
      />
      <div className="mb-4">
        <p className="text-sm font-medium text-slate-700 mb-2">Checklist</p>
        <div className="space-y-2">
          {checklistItems.length === 0 && (
            <p className="text-xs text-slate-500">No checklist items yet.</p>
          )}
          {checklistItems.map((item, idx) => (
            <div key={`check-${idx}`} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={!!item.done}
                onChange={() => handleToggleChecklistItem(idx)}
              />
              <span className="text-sm text-slate-700">{item.text}</span>
              <button
                type="button"
                onClick={() => handleRemoveChecklistItem(idx)}
                className="ml-auto text-xs text-slate-400 hover:text-slate-600"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <div className="mt-3 flex gap-2">
          <input
            className="input-field"
            placeholder="Add checklist item"
            value={newChecklistItem}
            onChange={(e) => setNewChecklistItem(e.target.value)}
          />
          <button
            type="button"
            onClick={handleAddChecklistItem}
            className="btn-secondary"
          >
            Add
          </button>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={handleSave}
          disabled={loading}
          className="btn-primary flex-1 disabled:opacity-60"
        >
          {loading ? "Saving..." : "Save"}
        </button>
        <button
          onClick={() => setIsEditing(false)}
          disabled={loading}
          className="btn-secondary"
        >
          Cancel
        </button>
      </div>
    </div>
  );

  if (isEditing) {
    return createPortal(
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6">
        <div
          className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
          onClick={() => setIsEditing(false)}
        />
        <div className="relative w-full max-w-lg">{editForm}</div>
      </div>,
      document.body
    );
  }

  if (showDeleteConfirm) {
    return createPortal(
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6">
        <div
          className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
          onClick={() => setShowDeleteConfirm(false)}
        />
        <div className="relative w-full max-w-sm card p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            Delete job?
          </h3>
          <p className="text-sm text-slate-500 mb-6">
            This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="flex-1 btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                await handleDelete();
                setShowDeleteConfirm(false);
              }}
              className="flex-1 px-4 py-2.5 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors disabled:opacity-60"
              disabled={loading}
            >
              {loading ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>,
      document.body
    );
  }

  return (
    <div className="card p-6 hover:shadow-lg transition-shadow duration-300 group">
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-slate-900">{job.company}</h3>
            {job.pinned && (
              <span className="text-[11px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                Pinned
              </span>
            )}
          </div>
          <p className="text-slate-600">{job.role}</p>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleTogglePin}
            disabled={loading}
            className="p-2 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
            title={job.pinned ? "Unpin" : "Pin"}
          >
            {job.pinned ? (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16 3a1 1 0 0 1 1 1v4.586l2.707 2.707a1 1 0 0 1-.707 1.707H14v6a1 1 0 0 1-2 0v-6H5a1 1 0 0 1-.707-1.707L7 8.586V4a1 1 0 0 1 1-1h8z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 3H8a1 1 0 00-1 1v4.586L4.293 11.293A1 1 0 005 13h6v6a1 1 0 102 0v-6h6a1 1 0 00.707-1.707L17 8.586V4a1 1 0 00-1-1z" />
              </svg>
            )}
          </button>
          <button
            onClick={() => setIsEditing(true)}
            disabled={loading}
            className="p-2 text-slate-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
            title="Edit"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            disabled={loading}
            className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {job.jobDescription && (
        <p className="text-sm text-slate-500 mb-3 line-clamp-2">{job.jobDescription}</p>
      )}
      {job.notes && (
        <p className="text-sm text-slate-500 mb-3 line-clamp-2">{job.notes}</p>
      )}

      {job.appliedDate && (
        <p className="text-xs text-slate-400 mb-3">
          Applied: {new Date(job.appliedDate).toLocaleDateString()}
        </p>
      )}
      {job.interviewDate && (
        <p className="text-xs text-slate-400 mb-3">
          Interview: {new Date(job.interviewDate).toLocaleDateString()}
        </p>
      )}
      {job.reminderAt && (
        <p className="text-xs text-slate-400 mb-3">
          Reminder: {new Date(job.reminderAt).toLocaleDateString()}
        </p>
      )}

      {Array.isArray(job.checklist) && job.checklist.length > 0 && (
        <div className="mb-3 space-y-2">
          <p className="text-xs font-semibold text-slate-600">Checklist</p>
          {job.checklist.map((item, idx) => (
            <label key={`list-${idx}`} className="flex items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={!!item.done}
                onChange={() => handleToggleChecklistItem(idx)}
              />
              <span className={item.done ? "line-through text-slate-400" : ""}>
                {item.text}
              </span>
            </label>
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        {STATUS_OPTIONS.map((status) => {
          const active = status === job.status;
          return (
            <button
              key={status}
              onClick={() => handleStatusChange(status)}
              disabled={loading || active}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                active ? STATUS_ACTIVE[status] : STATUS_STYLES[status]
              } ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
            >
              {status}
            </button>
          );
        })}
        <button
          onClick={() => handleReminder(new Date(Date.now() + 86400000).toISOString())}
          disabled={loading}
          className="text-xs font-semibold px-3 py-1.5 rounded-full border border-slate-200 text-slate-600 hover:border-primary-300 hover:text-primary-700 transition-colors"
        >
          Remind Tomorrow
        </button>
        {job.reminderAt && (
          <button
            onClick={() => handleReminder(null)}
            disabled={loading}
            className="text-xs font-semibold px-3 py-1.5 rounded-full border border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700 transition-colors"
          >
            Clear Reminder
          </button>
        )}
      </div>
    </div>
  );
}

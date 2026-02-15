import { useState } from "react";
import api from "../api/axios";
import { useNotifications } from "../context/NotificationsContext";
import JobCard from "./JobCard";

const STATUS_OPTIONS = ["Applied", "Interview", "Offer", "Rejected"];

export default function JobTable({ jobs, onRefresh, formatDate }) {
  const { addNotification } = useNotifications();
  const [editingJob, setEditingJob] = useState(null);
  const [busyJobId, setBusyJobId] = useState(null);

  const withBusy = async (jobId, action) => {
    setBusyJobId(jobId);
    try {
      await action();
    } finally {
      setBusyJobId(null);
    }
  };

  const handleStatusChange = async (job, newStatus) => {
    if (job.status === newStatus) return;
    await withBusy(job._id, async () => {
      try {
        await api.put(`/jobs/${job._id}`, { ...job, status: newStatus });
        onRefresh?.();
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
      }
    });
  };

  const handleTogglePin = async (job) => {
    await withBusy(job._id, async () => {
      try {
        await api.put(`/jobs/${job._id}`, { ...job, pinned: !job.pinned });
        onRefresh?.();
        addNotification({
          title: job.pinned ? "Unpinned job" : "Pinned job",
          message: `${job.company} - ${job.role}`,
          type: "success",
        });
      } catch (err) {
        console.error(err);
        addNotification({
          title: "Pin failed",
          message: err.response?.data?.message || "Could not update pin",
          type: "error",
        });
      }
    });
  };

  const handleDelete = async (job) => {
    const confirmed =
      typeof window !== "undefined"
        ? window.confirm("Delete this job? This action cannot be undone.")
        : true;
    if (!confirmed) return;
    await withBusy(job._id, async () => {
      try {
        await api.delete(`/jobs/${job._id}`);
        onRefresh?.();
        addNotification({
          title: "Job deleted",
          message: `${job.company} - ${job.role}`,
          type: "success",
        });
      } catch (err) {
        console.error(err);
        addNotification({
          title: "Delete failed",
          message: err.response?.data?.message || "Could not delete job",
          type: "error",
        });
      }
    });
  };

  const handleReminder = async (job, date) => {
    await withBusy(job._id, async () => {
      try {
        await api.put(`/jobs/${job._id}`, { ...job, reminderAt: date || null });
        onRefresh?.();
        addNotification({
          title: date ? "Reminder set" : "Reminder cleared",
          message: `${job.company} - ${job.role}`,
          type: "success",
        });
      } catch (err) {
        console.error(err);
        addNotification({
          title: "Reminder update failed",
          message: err.response?.data?.message || "Could not update reminder",
          type: "error",
        });
      }
    });
  };

  return (
    <div className="card p-0 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-900 text-white">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Company</th>
              <th className="px-4 py-3 text-left font-semibold">Role</th>
              <th className="px-4 py-3 text-left font-semibold">Status</th>
              <th className="px-4 py-3 text-left font-semibold">Applied</th>
              <th className="px-4 py-3 text-left font-semibold">Interview</th>
              <th className="px-4 py-3 text-left font-semibold">Reminder</th>
              <th className="px-4 py-3 text-left font-semibold">Pinned</th>
              <th className="px-4 py-3 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white dark:divide-slate-800 dark:bg-slate-900">
            {jobs.map((job) => (
              <tr
                key={`row-${job._id}`}
                className="hover:bg-slate-50 dark:hover:bg-slate-800/60"
              >
                <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">
                  {job.company}
                </td>
                <td className="px-4 py-3 text-slate-700 dark:text-slate-200">
                  {job.role}
                </td>
                <td className="px-4 py-3">
                  <select
                    value={job.status}
                    onChange={(e) => handleStatusChange(job, e.target.value)}
                    disabled={busyJobId === job._id}
                    className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-sm focus:border-primary-400 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={`${job._id}-${status}`} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                  {formatDate(job.appliedDate) || "-"}
                </td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                  {formatDate(job.interviewDate) || "-"}
                </td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                  <div className="flex flex-col gap-2">
                    <span>{formatDate(job.reminderAt) || "-"}</span>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() =>
                          handleReminder(
                            job,
                            new Date(Date.now() + 86400000).toISOString()
                          )
                        }
                        disabled={busyJobId === job._id}
                        className="rounded-full border border-slate-200 px-2.5 py-1 text-[11px] font-semibold text-slate-600 hover:border-primary-300 hover:text-primary-700 dark:border-slate-700 dark:text-slate-300"
                      >
                        Tomorrow
                      </button>
                      {job.reminderAt && (
                        <button
                          onClick={() => handleReminder(job, null)}
                          disabled={busyJobId === job._id}
                          className="rounded-full border border-slate-200 px-2.5 py-1 text-[11px] font-semibold text-slate-500 hover:border-slate-300 dark:border-slate-700 dark:text-slate-400"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleTogglePin(job)}
                    disabled={busyJobId === job._id}
                    className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                      job.pinned
                        ? "border-amber-200 bg-amber-50 text-amber-700"
                        : "border-slate-200 text-slate-600 hover:border-amber-200 hover:text-amber-700 dark:border-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {job.pinned ? "Pinned" : "Pin"}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => setEditingJob(job)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-primary-600 hover:text-primary-700"
                      title="Edit job"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(job)}
                      disabled={busyJobId === job._id}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700"
                      title="Delete job"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingJob && (
        <JobCard
          job={editingJob}
          onUpdate={() => onRefresh?.()}
          onDelete={() => onRefresh?.()}
          autoEdit
          hideCard
          onCloseEdit={() => setEditingJob(null)}
        />
      )}
    </div>
  );
}

import { createContext, useContext, useMemo, useState } from "react";

const NotificationsContext = createContext(null);

const buildNotification = ({ title, message, type = "info" }) => ({
  id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
  title,
  message,
  type,
  read: false,
  createdAt: new Date().toISOString(),
});

export function NotificationsProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [toasts, setToasts] = useState([]);

  const addNotification = (payload) => {
    const notification = buildNotification(payload);
    setNotifications((prev) => [notification, ...prev].slice(0, 30));
    setToasts((prev) => [...prev, notification].slice(-4));
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== notification.id));
    }, 4000);
  };

  const markRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const value = useMemo(
    () => ({
      notifications,
      addNotification,
      markRead,
      markAllRead,
      unreadCount: notifications.filter((n) => !n.read).length,
    }),
    [notifications]
  );

  return (
    <NotificationsContext.Provider value={value}>
      {children}
      <div className="fixed bottom-6 right-6 z-[9999] space-y-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`rounded-xl border px-4 py-3 shadow-lg bg-white ${
              toast.type === "success"
                ? "border-emerald-200"
                : toast.type === "error"
                ? "border-red-200"
                : "border-slate-200"
            }`}
          >
            <p className="text-sm font-semibold text-slate-800">{toast.title}</p>
            {toast.message && (
              <p className="text-xs text-slate-500 mt-1">{toast.message}</p>
            )}
          </div>
        ))}
      </div>
    </NotificationsContext.Provider>
  );
}

export const useNotifications = () => {
  const ctx = useContext(NotificationsContext);
  if (!ctx) {
    throw new Error("useNotifications must be used within NotificationsProvider");
  }
  return ctx;
};

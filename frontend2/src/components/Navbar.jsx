import { useState } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const isAuth = !!localStorage.getItem("token");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  if (!isAuth) return null;

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/dashboard" className="flex items-center gap-2">
            <span className="text-2xl font-extrabold text-primary-600 tracking-tight">
              JobFlow
            </span>
          </Link>

          <div className="flex items-center gap-6">
            <Link
              to="/dashboard"
              className={`font-medium transition-colors ${
                location.pathname === "/dashboard"
                  ? "text-primary-600"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/resume-review"
              className={`font-medium transition-colors ${
                location.pathname === "/resume-review"
                  ? "text-primary-600"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Resume Review
            </Link>
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="text-slate-600 hover:text-red-600 font-medium transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {showLogoutConfirm &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" style={{ minHeight: "100dvh" }}>
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setShowLogoutConfirm(false)}
              aria-hidden="true"
            />
            <div className="relative bg-white rounded-xl shadow-xl p-6 w-full max-w-sm mx-auto">
              <p className="text-slate-800 font-medium mb-1">Sign out?</p>
              <p className="text-slate-500 text-sm mb-6">Are you sure you want to sign out?</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors"
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </nav>
  );
}

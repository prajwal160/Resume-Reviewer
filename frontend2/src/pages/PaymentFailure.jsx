import { Link } from "react-router-dom";

export default function PaymentFailure() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="mx-auto h-16 w-16 rounded-2xl bg-red-100 flex items-center justify-center">
          <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mt-6 dark:text-slate-100">
          Payment failed
        </h1>
        <p className="text-slate-600 mt-2 dark:text-slate-300">
          Your payment did not go through. Please try again.
        </p>
        <div className="flex items-center justify-center gap-3 mt-6">
          <Link to="/pricing" className="btn-primary inline-flex">
            Try again
          </Link>
          <Link to="/dashboard" className="btn-secondary inline-flex">
            Back to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

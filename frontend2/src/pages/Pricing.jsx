import { useState } from "react";
import api from "../api/axios";

export default function Pricing() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [payu, setPayu] = useState(null);
  const [billing, setBilling] = useState("monthly");

  const priceMonthly = 199;
  const priceYearly = 1990;

  const handleUpgrade = async () => {
    setError("");
    setLoading(true);
    try {
      const amount = billing === "yearly" ? priceYearly : priceMonthly;
      const res = await api.post("/payments/payu/init", {
        amount,
        plan: billing,
        productinfo: `JobFlow Premium (${billing})`,
      });
      setPayu(res.data);
      setTimeout(() => {
        const form = document.getElementById("payu-form");
        if (form) form.submit();
      }, 300);
    } catch (err) {
      setError(err.response?.data?.message || "Payment init failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            Choose your plan
          </h1>
          <p className="text-slate-600 mt-2 dark:text-slate-300">
            Unlock unlimited AI resume reviews and premium insights.
          </p>
          <div className="mt-6 inline-flex items-center rounded-full border border-slate-200 bg-white p-1 text-sm dark:border-slate-800 dark:bg-slate-900">
            <button
              onClick={() => setBilling("monthly")}
              className={`px-4 py-1.5 rounded-full transition-colors ${
                billing === "monthly"
                  ? "bg-slate-900 text-white dark:bg-primary-600"
                  : "text-slate-600 dark:text-slate-300"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling("yearly")}
              className={`px-4 py-1.5 rounded-full transition-colors ${
                billing === "yearly"
                  ? "bg-slate-900 text-white dark:bg-primary-600"
                  : "text-slate-600 dark:text-slate-300"
              }`}
            >
              Yearly
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-600 text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Free
            </h2>
            <p className="text-slate-500 text-sm mt-1 dark:text-slate-400">
              Best for trying the platform
            </p>
            <p className="text-3xl font-bold text-slate-900 mt-6 dark:text-slate-100">
              ₹0
            </p>
            <ul className="mt-6 space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <li>• 1 AI resume review</li>
              <li>• Basic ATS score</li>
              <li>• Standard feedback</li>
              <li>• Job tracker with list & kanban</li>
              <li>• Reminders + calendar view</li>
            </ul>
          </div>

          <div className="card p-6 border-2 border-primary-500">
            <div className="inline-flex items-center rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold text-primary-700">
              Recommended
            </div>
            <h2 className="text-lg font-semibold text-slate-900 mt-4 dark:text-slate-100">
              Premium
            </h2>
            <p className="text-slate-500 text-sm mt-1 dark:text-slate-400">
              Best for job seekers
            </p>
            <p className="text-3xl font-bold text-slate-900 mt-6 dark:text-slate-100">
              ₹{billing === "yearly" ? priceYearly : priceMonthly}
              <span className="text-sm font-normal text-slate-500">
                /{billing === "yearly" ? "year" : "month"}
              </span>
            </p>
            <ul className="mt-6 space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <li>• Unlimited AI resume reviews</li>
              <li>• Detailed ATS insights</li>
              <li>• Priority processing</li>
              <li>• Exportable reports</li>
              <li>• Smart reminders + follow-up tips</li>
              <li>• Advanced analytics</li>
            </ul>
            <button
              onClick={handleUpgrade}
              disabled={loading}
              className="btn-primary w-full mt-6 disabled:opacity-60"
            >
              {loading ? "Starting checkout..." : "Upgrade to Premium"}
            </button>
            <p className="text-xs text-slate-500 mt-3">
              Test mode: use PayU test UPI IDs/cards only. Real UPI IDs will fail in sandbox.
            </p>
          </div>
        </div>
      </div>

      {payu && (
        <form id="payu-form" method="post" action={payu.action} className="hidden">
          {Object.entries(payu.payload || {}).map(([key, value]) => (
            <input key={key} type="hidden" name={key} value={value} />
          ))}
        </form>
      )}
    </div>
  );
}

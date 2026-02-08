export default function Help() {
  const faqs = [
    {
      q: "How does Resume Review work?",
      a: "Upload a PDF or paste your resume, add a job description, and we generate ATS-focused feedback with strengths, gaps, and action steps.",
    },
    {
      q: "Why is my ATS score different each time?",
      a: "AI models can vary slightly. Keep the job description consistent and aim for stable improvements rather than exact scores.",
    },
    {
      q: "What counts as a free review?",
      a: "Each analysis you run counts as one review. Free users get one review; Premium unlocks unlimited reviews.",
    },
    {
      q: "How do reminders work?",
      a: "Set a reminder date per job and snooze when needed. Reminders show on the dashboard and calendar.",
    },
    {
      q: "Can I export my data?",
      a: "Premium includes exportable reports. We can add CSV/PDF export if you want it sooner.",
    },
    {
      q: "How do I reset my password?",
      a: "Use the 'Forgot password' link on the login page. If you don’t see the email, check spam and ensure SMTP is configured.",
    },
    {
      q: "Why did payment succeed but Premium is still locked?",
      a: "In test mode, PayU must redirect to the backend callback. If Premium stays locked, the callback didn’t validate the hash.",
    },
    {
      q: "Which UPI should I use in test mode?",
      a: "PayU sandbox accepts only test UPI IDs. Real UPI IDs will fail in test mode.",
    },
    {
      q: "Is my data private?",
      a: "Your data is stored in your MongoDB. We don’t share it outside your application.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          Help & Docs
        </h1>
        <p className="text-slate-600 mt-2 dark:text-slate-300">
          Quick answers to common questions.
        </p>

        <div className="mt-8 space-y-3">
          {faqs.map((item) => (
            <details
              key={item.q}
              className="group rounded-2xl border border-slate-300 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold text-slate-900 dark:text-slate-100">
                {item.q}
                <span className="ml-4 text-slate-400 transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                {item.a}
              </p>
            </details>
          ))}
          <div className="rounded-2xl border border-slate-300 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Contact support
            </h2>
            <p className="text-sm text-slate-600 mt-2 dark:text-slate-300">
              Email us at{" "}
              <a className="text-primary-600" href="mailto:support@jobflow.app">
                support@jobflow.app
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

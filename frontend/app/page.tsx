import Link from "next/link";

const categories = ["Driver", "Helper", "Delivery", "Cleaner", "Store Assistant"];
const steps = ["Sign up", "Complete profile", "Connect directly"];

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
        <h1 className="text-xl font-bold tracking-tight">KaamConnect</h1>
        <nav className="flex items-center gap-2">
          <Link href="/auth/login" className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold hover:bg-slate-100">Login</Link>
          <Link href="/auth/register" className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500">Register</Link>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-emerald-700">Trusted blue-collar jobs</p>
              <h2 className="mt-3 text-3xl font-extrabold leading-tight sm:text-4xl">Find Work. Hire Workers. Instantly.</h2>
              <p className="mt-4 text-lg text-slate-600">KaamConnect links job seekers and employers in a few taps. Clean, simple, and reliable for everyone.</p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/job-seeker/jobs" className="rounded-lg bg-sky-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-500">Find a Job</Link>
                <Link href="/employer/post" className="rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100">Hire Workers</Link>
              </div>
            </div>

            <div className="space-y-3 rounded-xl bg-slate-50 p-5">
              <h3 className="text-lg font-semibold">Popular categories</h3>
              <div className="grid grid-cols-2 gap-3">
                {categories.map((category) => (
                  <div key={category} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-center text-sm font-medium text-slate-700 shadow-sm">
                    {category}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
          <h3 className="text-2xl font-bold">How it works</h3>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step} className="rounded-xl border border-slate-200 bg-slate-50 p-5 text-center">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-white">{index + 1}</div>
                <p className="mt-3 text-sm font-semibold text-slate-700">{step}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
          <h3 className="text-xl font-bold">Ready to get started?</h3>
          <p className="mt-2 text-slate-600">Create your profile and start connecting today.</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/auth/register" className="rounded-lg bg-sky-600 px-6 py-3 text-sm font-semibold text-white hover:bg-sky-500">Create Account</Link>
            <Link href="/auth/login" className="rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100">Login</Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white py-6 text-center text-sm text-slate-600">
        © {new Date().getFullYear()} KaamConnect. Built for workers and employers with simplicity in mind.
      </footer>
    </div>
  );
}

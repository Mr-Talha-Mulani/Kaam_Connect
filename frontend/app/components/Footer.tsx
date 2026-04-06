import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-[#1E3A8A] to-[#3B5BDB] text-white mt-20">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Logo + Tagline */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <span className="text-white font-bold text-lg">K</span>
              </div>
              <span className="text-2xl font-semibold" style={{ fontFamily: "Sora, sans-serif" }}>
                कामConnect
              </span>
            </div>
            <p className="text-white/70 text-sm">
              Connecting Workers with Opportunity across India
            </p>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="text-center">
              <h3 className="font-semibold mb-4 text-lg">Platform</h3>
              <div className="flex flex-col gap-3">
                <Link href="/" className="text-gray-200 hover:text-white transition-colors text-sm">
                  About KaamConnect
                </Link>
                <Link href="/how-it-works" className="text-gray-200 hover:text-white transition-colors text-sm">
                  How It Works
                </Link>
                <a href="#careers" className="text-gray-200 hover:text-white transition-colors text-sm">
                  Careers
                </a>
              </div>
            </div>

            <div className="text-center">
              <h3 className="font-semibold mb-4 text-lg">For Workers</h3>
              <div className="flex flex-col gap-3">
                <Link href="/auth/register" className="text-gray-200 hover:text-white transition-colors text-sm">
                  Create Profile
                </Link>
                <Link href="/job-seeker/jobs" className="text-gray-200 hover:text-white transition-colors text-sm">
                  Find Jobs
                </Link>
                <Link href="/job-seeker/dashboard" className="text-gray-200 hover:text-white transition-colors text-sm">
                  Dashboard
                </Link>
              </div>
            </div>

            <div className="text-center">
              <h3 className="font-semibold mb-4 text-lg">For Employers</h3>
              <div className="flex flex-col gap-3">
                <Link href="/employer/post" className="text-gray-200 hover:text-white transition-colors text-sm">
                  Post Jobs
                </Link>
                <Link href="/employer/dashboard" className="text-gray-200 hover:text-white transition-colors text-sm">
                  Browse Workers
                </Link>
                <Link href="/employer/manage-jobs" className="text-gray-200 hover:text-white transition-colors text-sm">
                  Manage Jobs
                </Link>
              </div>
            </div>

            <div className="text-center">
              <h3 className="font-semibold mb-4 text-lg">Support</h3>
              <div className="flex flex-col gap-3">
                <a href="#help" className="text-gray-200 hover:text-white transition-colors text-sm">
                  Help Center
                </a>
                <a href="#contact" className="text-gray-200 hover:text-white transition-colors text-sm">
                  Contact
                </a>
                <a href="#privacy" className="text-gray-200 hover:text-white transition-colors text-sm">
                  Privacy Policy
                </a>
                <a href="#terms" className="text-gray-200 hover:text-white transition-colors text-sm">
                  Terms
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/20 pt-8 text-center">
          <p className="text-gray-200 text-sm">
            © {new Date().getFullYear()} KaamConnect – Connecting Workers with Opportunity
          </p>
        </div>
      </div>
    </footer>
  );
}

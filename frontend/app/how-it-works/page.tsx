import Link from "next/link";
import {
  UserPlus,
  Video,
  Search,
  Send,
  Building2,
  FileText,
  Users,
  Phone,
  Shield,
  Star,
  CheckCircle,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";

export const metadata = {
  title: "How KaamConnect Works | KaamConnect",
};

const workerSteps = [
  {
    icon: UserPlus,
    title: "Create Your Profile",
    description: "Sign up and add your skills, experience, and location to get started.",
    bg: "#EAF1FF",
  },
  {
    icon: Video,
    title: "Upload Introduction Video",
    description: "Record a short video to help employers understand your skills and personality.",
    bg: "#E6F8F6",
  },
  {
    icon: Search,
    title: "Search Nearby Jobs",
    description: "Browse jobs in your area that match your skills and preferences.",
    bg: "#EAF1FF",
  },
  {
    icon: Send,
    title: "Apply to Employers",
    description: "Send applications and connect directly with employers looking to hire.",
    bg: "#E6F8F6",
  },
];

const employerSteps = [
  {
    icon: Building2,
    title: "Create Business Profile",
    description: "Register your company and verify your business details.",
    bg: "#E6F8F6",
  },
  {
    icon: FileText,
    title: "Post Job Openings",
    description: "List job requirements, salary, and working hours for your positions.",
    bg: "#EAF1FF",
  },
  {
    icon: Users,
    title: "Review Worker Profiles",
    description: "Browse applications, watch introduction videos, and check ratings.",
    bg: "#E6F8F6",
  },
  {
    icon: Phone,
    title: "Contact and Hire",
    description: "Connect with candidates and hire the right workers for your business.",
    bg: "#EAF1FF",
  },
];

const trustFeatures = [
  {
    icon: Star,
    title: "Rating System",
    description: "Workers and employers rate each other after every job, ensuring quality and trust.",
  },
  {
    icon: CheckCircle,
    title: "Profile Verification",
    description: "All profiles go through verification to maintain platform authenticity.",
  },
  {
    icon: Video,
    title: "Introduction Videos",
    description: "Video profiles help employers verify worker identity and assess communication skills.",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      {/* Introduction Section */}
      <section className="py-20 bg-gradient-to-br from-[#3B5BDB] to-[#2EC4B6] text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            How KaamConnect Works
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto text-white/90">
            KaamConnect is a trusted platform that bridges the gap between skilled blue-collar workers 
            and employers. Whether you're looking for work or hiring workers, we make the process simple, 
            fast, and reliable.
          </p>
        </div>
      </section>

      {/* For Job Seekers Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#1F2937]">
              For Job Seekers
            </h2>
            <p className="text-lg text-[#6B7280] max-w-2xl mx-auto">
              Follow these simple steps to find your next job opportunity
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {workerSteps.map((step, index) => (
              <Card
                key={index}
                className="border-[#E5E7EB] hover:shadow-lg transition-all"
                style={{ backgroundColor: step.bg }}
              >
                <CardContent className="p-6 text-center pt-6">
                  <div className="relative mb-6">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#3B5BDB] to-[#2EC4B6] mx-auto flex items-center justify-center">
                      <step.icon className="h-10 w-10 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-[#2EC4B6] flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-[#1F2937]">
                    {step.title}
                  </h3>
                  <p className="text-[#6B7280]">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* For Employers Section */}
      <section className="py-20 bg-[#F7FAFF]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#1F2937]">
              For Employers
            </h2>
            <p className="text-lg text-[#6B7280] max-w-2xl mx-auto">
              Hire skilled workers quickly and efficiently
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {employerSteps.map((step, index) => (
              <Card
                key={index}
                className="border-[#E5E7EB] hover:shadow-lg transition-all"
                style={{ backgroundColor: step.bg }}
              >
                <CardContent className="p-6 text-center pt-6">
                  <div className="relative mb-6">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#3B5BDB] to-[#2EC4B6] mx-auto flex items-center justify-center">
                      <step.icon className="h-10 w-10 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-[#3B5BDB] flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-[#1F2937]">
                    {step.title}
                  </h3>
                  <p className="text-[#6B7280]">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trust and Safety Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#1F2937]">
              Trust and Safety
            </h2>
            <p className="text-lg text-[#6B7280] max-w-2xl mx-auto">
              We prioritize security and trust to create a safe platform for everyone
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {trustFeatures.map((feature, index) => (
              <Card key={index} className="border-2 border-[#3B5BDB]/20 hover:border-[#3B5BDB] transition-all bg-white">
                <CardContent className="p-8 text-center pt-8">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#3B5BDB] to-[#2EC4B6] mx-auto mb-6 flex items-center justify-center">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-[#1F2937]">
                    {feature.title}
                  </h3>
                  <p className="text-[#6B7280]">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Start CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#3B5BDB] to-[#2EC4B6]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Ready to Get Started?
          </h2>
          <p className="text-lg mb-10 text-white/90 max-w-2xl mx-auto">
            Join thousands of workers and employers already using KaamConnect
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-white text-[#3B5BDB] hover:bg-white/90 h-12 px-8 text-lg border-0">
              <Link href="/job-seeker/jobs">
                Find Jobs
              </Link>
            </Button>
            <Button asChild className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 h-12 px-8 text-lg border-0 text-white">
              <Link href="/employer/post">
                Post Job
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

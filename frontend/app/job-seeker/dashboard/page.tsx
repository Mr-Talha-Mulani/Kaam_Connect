"use client";

import { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  User,
  Briefcase,
  FileText,
  Bell,
  Star,
  Settings,
  MapPin,
  DollarSign,
  Clock,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: User, label: "My Profile", active: false },
  { icon: Briefcase, label: "Find Jobs", active: false, href: "/job-seeker/jobs" },
  { icon: FileText, label: "Applied Jobs", active: false },
  { icon: Bell, label: "Notifications", active: false },
  { icon: Star, label: "Ratings", active: false },
  { icon: Settings, label: "Settings", active: false },
];

const recommendedJobs = [
  {
    id: 1,
    title: "Delivery Driver",
    company: "QuickDeliver Co.",
    location: "Mumbai, Maharashtra",
    salary: "₹15,000 - ₹20,000/month",
    type: "Full Time",
    posted: "2 hours ago",
  },
  {
    id: 2,
    title: "Warehouse Helper",
    company: "Storage Solutions Ltd.",
    location: "Navi Mumbai",
    salary: "₹12,000 - ₹18,000/month",
    type: "Full Time",
    posted: "5 hours ago",
  },
  {
    id: 3,
    title: "Restaurant Server",
    company: "Foodie Paradise",
    location: "Andheri, Mumbai",
    salary: "₹10,000 - ₹15,000/month",
    type: "Part Time",
    posted: "1 day ago",
  },
];

const recentNotifications = [
  { id: 1, text: "Your application for Delivery Driver was viewed", time: "10 min ago" },
  { id: 2, text: "New job posted nearby: Retail Assistant", time: "1 hour ago" },
  { id: 3, text: "Reminder: Complete your profile to get more matches", time: "3 hours ago" },
];

export default function JobSeekerDashboardPage() {
  const [activePage, setActivePage] = useState("Dashboard");

  return (
    <div className="bg-[#F7FAFF] min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <Card className="border-[#E5E7EB] sticky top-24 bg-white">
              <CardContent className="p-4">
                <nav className="space-y-2">
                  {sidebarItems.map((item) => {
                    const content = (
                      <>
                        <item.icon className="h-5 w-5" />
                        <span className="font-medium">{item.label}</span>
                      </>
                    );

                    const className = `w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      item.label === activePage
                        ? "bg-[#3B5BDB] text-white"
                        : "text-[#1F2937] hover:bg-[#F7F9FC]"
                    }`;

                    if (item.href) {
                      return (
                        <Link key={item.label} href={item.href} className={className}>
                          {content}
                        </Link>
                      );
                    }

                    return (
                      <button
                        key={item.label}
                        onClick={() => setActivePage(item.label)}
                        className={className}
                      >
                        {content}
                      </button>
                    );
                  })}
                </nav>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Welcome Message */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-[#1F2937] mb-2">
                Hello Ravi 👋
              </h1>
              <p className="text-[#6B7280]">Here are new job opportunities for you.</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="border-[#E5E7EB] bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[#6B7280] text-sm mb-1">Jobs Applied</p>
                      <p className="text-3xl font-bold text-[#1F2937]">12</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-[#3B5BDB]/10 flex items-center justify-center">
                      <FileText className="h-6 w-6 text-[#3B5BDB]" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-[#E5E7EB] bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[#6B7280] text-sm mb-1">Profile Views</p>
                      <p className="text-3xl font-bold text-[#1F2937]">48</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-[#2EC4B6]/10 flex items-center justify-center">
                      <User className="h-6 w-6 text-[#2EC4B6]" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-[#E5E7EB] bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[#6B7280] text-sm mb-1">New Jobs Nearby</p>
                      <p className="text-3xl font-bold text-[#1F2937]">24</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-[#FF8C42]/10 flex items-center justify-center">
                      <Briefcase className="h-6 w-6 text-[#FF8C42]" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap gap-3 mb-8">
              <Button variant="outline" className="border-[#3B5BDB] text-[#3B5BDB] hover:bg-[#3B5BDB] hover:text-white">
                Nearby Jobs
              </Button>
              <Button variant="outline" className="border-[#E5E7EB]">
                Part Time
              </Button>
              <Button variant="outline" className="border-[#E5E7EB]">
                Full Time
              </Button>
              <Button variant="outline" className="border-[#E5E7EB]">
                Daily Wage
              </Button>
            </div>

            {/* Recommended Jobs */}
            <Card className="border-[#E5E7EB] mb-8 bg-white">
              <CardHeader>
                <CardTitle className="text-xl text-[#1F2937]">Recommended Jobs</CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <div className="space-y-4">
                  {recommendedJobs.map((job) => (
                    <Card key={job.id} className="border-[#E5E7EB] hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-start gap-3 mb-3">
                              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#3B5BDB] to-[#2EC4B6] flex items-center justify-center flex-shrink-0">
                                <Briefcase className="h-6 w-6 text-white" />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold text-lg text-[#1F2937] mb-1">
                                  {job.title}
                                </h3>
                                <p className="text-[#6B7280]">{job.company}</p>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-4 text-sm text-[#6B7280]">
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {job.location}
                              </div>
                              <div className="flex items-center gap-1">
                                <DollarSign className="h-4 w-4" />
                                {job.salary}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {job.posted}
                              </div>
                            </div>
                            <div className="mt-3">
                              <Badge className="bg-[#2EC4B6]/10 text-[#2EC4B6] hover:bg-[#2EC4B6]/20">
                                {job.type}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <Button className="bg-[#3B5BDB] text-white border-0 hover:bg-[#3B5BDB]/90">
                              Apply
                            </Button>
                            <Button variant="outline" className="border-[#E5E7EB]">
                              View Details
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <div className="mt-6 text-center">
                  <Button asChild variant="outline" className="border-[#3B5BDB] text-[#3B5BDB] hover:bg-[#3B5BDB] hover:text-white">
                    <Link href="/job-seeker/jobs">
                      View All Jobs
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Notifications */}
            <Card className="border-[#E5E7EB] bg-white">
              <CardHeader>
                <CardTitle className="text-xl text-[#1F2937]">Recent Notifications</CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <div className="space-y-4">
                  {recentNotifications.map((notif) => (
                    <div
                      key={notif.id}
                      className="flex items-start gap-3 p-4 rounded-lg bg-[#F7F9FC] hover:bg-[#E5E7EB]/50 transition-colors"
                    >
                      <div className="w-2 h-2 rounded-full bg-[#3B5BDB] mt-2 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-[#1F2937]">{notif.text}</p>
                        <p className="text-sm text-[#6B7280] mt-1">{notif.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  Loader2
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { authApi, jobsApi, seekerApi, notificationsApi } from "../../lib/api";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: User, label: "My Profile", active: false },
  { icon: Briefcase, label: "Find Jobs", active: false, href: "/job-seeker/jobs" },
  { icon: FileText, label: "Applied Jobs", active: false },
  { icon: Bell, label: "Notifications", active: false },
  { icon: Star, label: "Ratings", href: "/job-seeker/ratings" },
  { icon: Settings, label: "Settings", active: false },
];

export default function JobSeekerDashboardPage() {
  const [activePage, setActivePage] = useState("Dashboard");
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [recommendedJobs, setRecommendedJobs] = useState<any[]>([]);
  const [recentNotifications, setRecentNotifications] = useState<any[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<any[]>([]);
  const [highlightedJobId, setHighlightedJobId] = useState<number | null>(null);
  const [profileData, setProfileData] = useState<any>(null);
  const [themeMode, setThemeMode] = useState("light");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const savedTheme = localStorage.getItem("kc_theme_mode") || "light";
    setThemeMode(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  const updateThemeMode = (nextTheme: string) => {
    setThemeMode(nextTheme);
    if (typeof window !== "undefined") {
      localStorage.setItem("kc_theme_mode", nextTheme);
      document.documentElement.setAttribute("data-theme", nextTheme);
    }
  };

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // Fetch public jobs to act as recommendations
      const jobsRes = await jobsApi.search();
      setRecommendedJobs(jobsRes.data?.slice(0, 3) || []);

      // If token exists, fetch real user data
      if (typeof window !== "undefined" && localStorage.getItem("kc_token")) {
        const [meRes, notifRes, appsRes, profRes] = await Promise.allSettled([
          authApi.getMe(),
          notificationsApi.getAll(),
          seekerApi.getMyApplications(),
          seekerApi.getProfile()
        ]);

        if (meRes.status === "fulfilled") setUser(meRes.value.data);
        if (notifRes.status === "fulfilled") setRecentNotifications(notifRes.value.data?.slice(0, 5) || []);
        if (appsRes.status === "fulfilled") setAppliedJobs(appsRes.value.data || []);
        if (profRes.status === "fulfilled") setProfileData(profRes.value.data);
      } else {
        // Mock fallback if user is not logged in via frontend
        setUser({ name: "Ravi", role: "job_seeker" });
        setRecentNotifications([
          { id: 1, message: "Welcome to KaamConnect! Complete your profile.", created_at: new Date().toISOString() },
        ]);
        setAppliedJobs([]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickFilter = (type: string) => {
    if (type === "Nearby Jobs") router.push("/job-seeker/jobs?loc=Mumbai");
    if (type === "Part Time") router.push("/job-seeker/jobs?type=Part Time");
    if (type === "Full Time") router.push("/job-seeker/jobs?type=Full Time");
    if (type === "Daily Wage") router.push("/job-seeker/jobs?type=Daily Wage");
  };

  const handleNotificationClick = (notification: any) => {
    if (notification?.related_job_id) {
      setHighlightedJobId(Number(notification.related_job_id));
      setActivePage("Applied Jobs");
      return;
    }
    setActivePage("Applied Jobs");
  };

  const formatINR = (salary: any, min?: number, max?: number) => {
    if (salary && typeof salary === "string") {
      return salary.includes("₹") ? salary : `₹${salary}`;
    }
    if (typeof min === "number" && typeof max === "number") {
      return `₹${min.toLocaleString()} - ₹${max.toLocaleString()}`;
    }
    return "₹0";
  };

  const formatJobType = (t: string) => t === 'full_time' ? "Full Time" : t === 'part_time' ? "Part Time" : t === 'daily_wage' ? "Daily Wage" : "Temporary";

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
           <Loader2 className="h-10 w-10 text-[#3B5BDB] animate-spin" />
        </div>
      );
    }

    switch (activePage) {
      case "My Profile":
        return (
          <Card className="border-[#E5E7EB] bg-white">
            <CardHeader><CardTitle>My Profile</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={(e) => { e.preventDefault(); alert("Profile Updated Successfully!"); }} className="space-y-4 max-w-md">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input defaultValue={profileData?.full_name || user?.name || ""} className="border-[#E5E7EB]" />
                </div>
                <div className="space-y-2">
                  <Label>Primary Skill</Label>
                  <Input defaultValue={profileData?.primary_skill || ""} className="border-[#E5E7EB]" />
                </div>
                <div className="space-y-2">
                  <Label>Years of Experience</Label>
                  <Input type="number" defaultValue={profileData?.years_of_experience || 0} className="border-[#E5E7EB]" />
                </div>
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input defaultValue={profileData?.location || user?.location || ""} className="border-[#E5E7EB]" />
                </div>
                <div className="space-y-2">
                  <Label>Video Introduction URL</Label>
                  <Input defaultValue={profileData?.video_introduction_url || ""} placeholder="https://..." className="border-[#E5E7EB]" />
                </div>
                <Button type="submit" className="bg-[#3B5BDB] text-white">Save Profile</Button>
              </form>
            </CardContent>
          </Card>
        );
      case "Applied Jobs":
        return (
          <Card className="border-[#E5E7EB] bg-white">
            <CardHeader><CardTitle>Applied Jobs</CardTitle></CardHeader>
            <CardContent>
              <p className="text-[#6B7280] mb-4">You have {appliedJobs.length} applied jobs.</p>
              {appliedJobs.map(app => (
                <div
                  key={app.id}
                  className={`p-4 border rounded relative mb-3 ${highlightedJobId === Number(app.job_id) ? "bg-blue-50 border-[#3B5BDB]" : "bg-gray-50"}`}
                >
                  <p className="font-semibold">{app.job_title}</p>
                  <div className="text-sm flex items-center gap-2 mt-1">
                    <span>Status:</span>
                    <Badge>{app.status}</Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        );
      case "Notifications":
        return (
          <Card className="border-[#E5E7EB] bg-white">
            <CardHeader><CardTitle>All Notifications</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-2">
              {recentNotifications.map(n => (
                <div 
                  key={n.id} 
                  onClick={() => handleNotificationClick(n)} 
                  className="p-3 border rounded-lg cursor-pointer hover:bg-blue-50/50 transition-colors flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium text-[#1F2937]">{n.title || "Alert"}</p>
                    <p className="text-sm text-[#6B7280]">{n.message}</p>
                  </div>
                  <Button variant="ghost" size="sm" className="text-[#3B5BDB]">View App</Button>
                </div>
              ))}
              {recentNotifications.length === 0 && <p className="text-[#6B7280]">No new notifications.</p>}
              </div>
            </CardContent>
          </Card>
        );
      case "Ratings":
        return (
          <Card className="border-[#E5E7EB] bg-white">
            <CardHeader><CardTitle>My Ratings & Reviews</CardTitle></CardHeader>
            <CardContent>
              <p className="text-[#6B7280] mb-4">You can view your previously worked jobs and their ratings here.</p>
              
              <h3 className="font-semibold text-[#1F2937] mb-2 mt-4">Jobs Waiting for Rating</h3>
              <div className="p-4 border rounded relative bg-gray-50 mb-6">
                <p className="font-semibold">Retail Assistant - SuperMax Stores</p>
                <p className="text-sm mb-2 text-gray-500">Completed 3 days ago. Rate the employer!</p>
                <Button size="sm" className="bg-[#FF8C42] text-white border-0 hover:bg-[#FF8C42]/90">Leave Rating</Button>
              </div>

              <h3 className="font-semibold text-[#1F2937] mb-2">Rated Jobs</h3>
              <div className="p-4 border rounded relative bg-white">
                <div className="flex justify-between">
                  <p className="font-semibold">Delivery Executive - SpeedyGo</p>
                  <div className="flex">
                    <Star className="h-5 w-5 text-[#F59E0B] fill-current" />
                    <Star className="h-5 w-5 text-[#F59E0B] fill-current" />
                    <Star className="h-5 w-5 text-[#F59E0B] fill-current" />
                    <Star className="h-5 w-5 text-[#F59E0B] fill-current" />
                    <Star className="h-5 w-5 text-gray-300" />
                  </div>
                </div>
                <p className="text-sm mt-1 text-gray-600">Great job but shifts were a bit too long.</p>
              </div>
            </CardContent>
          </Card>
        );
      case "Settings":
        return (
         <Card className="border-[#E5E7EB] bg-white">
            <CardHeader><CardTitle>Account Settings</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-6 max-w-md">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium text-[#1F2937]">Theme Selection</h3>
                    <p className="text-sm text-[#6B7280]">Toggle between light and dark mode</p>
                  </div>
                  <select
                    className="border p-2 rounded text-sm text-[#1F2937] bg-white"
                    value={themeMode}
                    onChange={(e) => updateThemeMode(e.target.value)}
                  >
                    <option value="light">Light Mode</option>
                    <option value="dark">Dark Mode</option>
                    <option value="system">System Default</option>
                  </select>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium text-[#1F2937]">Email Alerts</h3>
                    <p className="text-sm text-[#6B7280]">Get notified when new jobs match your skills</p>
                  </div>
                  <input type="checkbox" className="h-5 w-5 rounded border-gray-300 text-[#3B5BDB]" defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      case "Dashboard":
      default:
        return (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-[#1F2937] mb-2">
                Hello {user?.name || "Job Seeker"} 👋
              </h1>
              <p className="text-[#6B7280]">Here are new job opportunities for you.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="border-[#E5E7EB] bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[#6B7280] text-sm mb-1">Jobs Applied</p>
                      <p className="text-3xl font-bold text-[#1F2937]">{appliedJobs.length}</p>
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
                      <p className="text-[#6B7280] text-sm mb-1">Saved Jobs</p>
                      <p className="text-3xl font-bold text-[#1F2937]">0</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-[#2EC4B6]/10 flex items-center justify-center">
                      <Star className="h-6 w-6 text-[#2EC4B6]" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-[#E5E7EB] bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[#6B7280] text-sm mb-1">New Jobs Nearby</p>
                      <p className="text-3xl font-bold text-[#1F2937]">24+</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-[#FF8C42]/10 flex items-center justify-center">
                      <Briefcase className="h-6 w-6 text-[#FF8C42]" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-wrap gap-3 mb-8">
              <Button onClick={() => handleQuickFilter("Nearby Jobs")} variant="outline" className="border-[#3B5BDB] text-[#3B5BDB] hover:bg-[#3B5BDB] hover:text-white">
                Nearby Jobs
              </Button>
              <Button onClick={() => handleQuickFilter("Part Time")} variant="outline" className="border-[#E5E7EB]">
                Part Time
              </Button>
              <Button onClick={() => handleQuickFilter("Full Time")} variant="outline" className="border-[#E5E7EB]">
                Full Time
              </Button>
              <Button onClick={() => handleQuickFilter("Daily Wage")} variant="outline" className="border-[#E5E7EB]">
                Daily Wage
              </Button>
            </div>

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
                              <div className="w-12 h-12 rounded-lg bg-linear-to-br from-[#3B5BDB] to-[#2EC4B6] flex items-center justify-center shrink-0">
                                <Briefcase className="h-6 w-6 text-white" />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold text-lg text-[#1F2937] mb-1">
                                  {job.title}
                                </h3>
                                <p className="text-[#6B7280]">{job.employer_name || "Company Confidential"}</p>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-4 text-sm text-[#6B7280]">
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {job.location}
                              </div>
                              <div className="flex items-center gap-1">
                                <DollarSign className="h-4 w-4" />
                                {formatINR(job.salary, job.salary_min, job.salary_max)}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {new Date(job.created_at).toLocaleDateString()}
                              </div>
                            </div>
                            <div className="mt-3">
                              <Badge className="bg-[#2EC4B6]/10 text-[#2EC4B6] hover:bg-[#2EC4B6]/20">
                                {formatJobType(job.job_type)}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <Button asChild className="bg-[#3B5BDB] text-white border-0 hover:bg-[#3B5BDB]/90">
                              <Link href="/job-seeker/jobs">Apply</Link>
                            </Button>
                            <Button asChild variant="outline" className="border-[#E5E7EB]">
                              <Link href="/job-seeker/jobs">View Details</Link>
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

            <Card className="border-[#E5E7EB] bg-white">
              <CardHeader>
                <CardTitle className="text-xl text-[#1F2937]">Recent Notifications</CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <div className="space-y-4">
                  {recentNotifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => handleNotificationClick(notif)}
                      className="cursor-pointer flex items-start gap-3 p-4 rounded-lg bg-[#F7F9FC] hover:bg-blue-50 transition-colors"
                    >
                      <div className="w-2 h-2 rounded-full bg-[#3B5BDB] mt-2 shrink-0" />
                      <div className="flex-1">
                        <p className="font-medium text-[#1F2937] mb-1">{notif.title || "Alert"}</p>
                        <p className="text-[#6B7280] text-sm">{notif.message}</p>
                        <p className="text-xs text-[#9CA3AF] mt-2">{new Date(notif.created_at).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        );
    }
  };

  return (
    <div className="bg-[#F7FAFF] min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-64 shrink-0">
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

          <main className="flex-1">
            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  );
}

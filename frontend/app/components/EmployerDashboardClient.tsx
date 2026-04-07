"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Building2,
  PlusCircle,
  FileText,
  Users,
  Bell,
  Play,
  Star,
  MapPin,
  Phone,
  CheckCircle2,
  X,
  Loader2
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Switch } from "./ui/switch";
import { Badge } from "./ui/badge";
import { employerApi, authApi, notificationsApi } from "../lib/api";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard" },
  { icon: Building2, label: "Company Profile" },
  { icon: PlusCircle, label: "Post Job" },
  { icon: FileText, label: "Manage Jobs" },
  { icon: Users, label: "Applicants" },
  { icon: Bell, label: "Notifications" },
];

export function EmployerDashboardClient({ initialActivePage = "Dashboard" }: { initialActivePage?: string }) {
  const [activePage, setActivePage] = useState(initialActivePage);
  const [jobType, setJobType] = useState("full_time");
  const [urgentHiring, setUrgentHiring] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [myJobs, setMyJobs] = useState<any[]>([]);
  const [allApplicants, setAllApplicants] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [editingJobId, setEditingJobId] = useState<number | null>(null);
  const [editingJobData, setEditingJobData] = useState({ title: "", salary: "", location: "", status: "open" });

  // Post Job form state
  const [newJob, setNewJob] = useState({
    title: "", skills_required: "", salary: "", working_hours: "", location: "", description: ""
  });

  const displayPopup = (msg: string) => {
    setPopupMessage(msg);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000);
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

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      if (typeof window !== "undefined" && localStorage.getItem("kc_token")) {
        const [meRes, profRes, jobsRes, appsRes, notifRes] = await Promise.allSettled([
          authApi.getMe(),
          employerApi.getProfile(),
          employerApi.getMyJobs(),
          employerApi.getAllApplicants(),
          notificationsApi.getAll()
        ]);

        if (meRes.status === "fulfilled") setUser(meRes.value.data);
        if (profRes.status === "fulfilled") setProfile(profRes.value.data);
        if (jobsRes.status === "fulfilled") setMyJobs(jobsRes.value.data || []);
        if (appsRes.status === "fulfilled") setAllApplicants(appsRes.value.data || []);
        if (notifRes.status === "fulfilled") setNotifications(notifRes.value.data || []);
      } else {
         // Mock fallback
         setUser({ name: "Demo Employer" });
         setProfile({ name: "Demo Company", industry: "Services" });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePostJob = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        title: newJob.title,
        description: newJob.description,
        location: newJob.location,
        job_type: jobType,
        skills_required: newJob.skills_required,
        salary: newJob.salary,
        is_urgent: urgentHiring,
        // Optional
        category: "General",
        job_duration: "Permanent",
      };
      await employerApi.createJob(payload);
      displayPopup("Job posted successfully!");
      setNewJob({ title: "", skills_required: "", salary: "", working_hours: "", location: "", description: "" });
      fetchData(); // refresh data
      setActivePage("Manage Jobs");
    } catch (err: any) {
      displayPopup("Failed to post: " + (err.message || "Unknown error"));
    }
  };

  const handleApplicantAction = async (action: string, appId: number, name: string) => {
    const app = allApplicants.find(a => a.id === appId);
    if (!app) return;

    if (action === "Shortlist") {
      try {
        if (app.status === "shortlisted") {
          displayPopup(`${name} is already shortlisted.`);
          return;
        }
        await employerApi.updateApplicationStatus(app.job_id, appId, "shortlisted");
        displayPopup(`Shortlisted ${name}`);
        fetchData();
      } catch (err: any) {
        displayPopup("Failed: " + err.message);
      }
    } else if (action === "Watch Video") {
      if (app.video_introduction_url) {
        window.open(app.video_introduction_url, "_blank");
      } else {
        displayPopup("No video available for this applicant.");
      }
    } else if (action === "Contact") {
      if (app.phone_number) {
        window.location.href = `tel:${app.phone_number}`;
      } else {
        displayPopup("No contact number available.");
      }
    } else if (action === "View Profile") {
      // Just show prompt or basic info for now as there's no actual profile view page yet
      displayPopup(`Opening profile for ${name}... (Feature coming soon)`);
    }
  };

  const startEditJob = (job: any) => {
    setEditingJobId(job.id);
    setEditingJobData({
      title: job.title || "",
      salary: job.salary || "",
      location: job.location || "",
      status: job.status || "open",
    });
  };

  const saveEditJob = async (jobId: number) => {
    try {
      await employerApi.updateJob(jobId, editingJobData);
      displayPopup("Job updated successfully!");
      setEditingJobId(null);
      fetchData();
    } catch (err: any) {
      displayPopup("Failed to update job: " + (err.message || "Unknown error"));
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
           <Loader2 className="h-10 w-10 text-[#3B5BDB] animate-spin" />
        </div>
      );
    }

    switch (activePage) {
      case "Company Profile":
        return (
          <Card className="border-[#E5E7EB] bg-white">
            <CardHeader><CardTitle>Company Profile</CardTitle></CardHeader>
            <CardContent>
              <p className="text-[#6B7280] mb-4">Manage your company details and business information here.</p>
              <form onSubmit={async (e) => {
                e.preventDefault();
                try {
                  const data = {
                    name: (e.target as any).companyName.value,
                    industry: (e.target as any).industry.value,
                    business_description: (e.target as any).description.value,
                  };
                  await employerApi.upsertProfile(data);
                  displayPopup("Profile updated successfully!");
                  fetchData();
                } catch(err: any) {
                  displayPopup("Failed to update profile: " + err.message);
                }
              }} className="space-y-4 max-w-md">
                <div className="space-y-2">
                  <Label>Company Name</Label>
                  <Input name="companyName" defaultValue={profile?.name || ""} className="border-[#E5E7EB]" />
                </div>
                <div className="space-y-2">
                  <Label>Industry</Label>
                  <Input name="industry" defaultValue={profile?.industry || ""} className="border-[#E5E7EB]" />
                </div>
                <div className="space-y-2">
                  <Label>Business Description</Label>
                  <Textarea name="description" defaultValue={profile?.business_description || ""} className="border-[#E5E7EB]" />
                </div>
                <Button type="submit" className="bg-[#3B5BDB] text-white hover:bg-[#3B5BDB]/90">Update Profile</Button>
              </form>
            </CardContent>
          </Card>
        );

      case "Manage Jobs":
        return (
          <Card className="border-[#E5E7EB] bg-white">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Manage Your Jobs</CardTitle>
                <Button onClick={() => setActivePage("Post Job")} className="bg-[#3B5BDB] text-white hover:bg-[#3B5BDB]/90">
                  <PlusCircle className="mr-2 h-4 w-4" /> Post New Job
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-[#6B7280] mb-4">You have posted {myJobs.length} jobs.</p>
              <div className="space-y-4">
                {myJobs.map(job => (
                  <div key={job.id} className="p-4 border rounded shadow-sm flex flex-col sm:flex-row justify-between items-center">
                    <div>
                      <h3 className="font-bold text-lg">{job.title} {job.is_urgent && <Badge className="bg-red-100 text-red-600 ml-2">Urgent</Badge>}</h3>
                      <p className="text-sm text-gray-500">Posted on {new Date(job.created_at).toLocaleDateString()} • {formatINR(job.salary, job.salary_min, job.salary_max)}</p>
                    </div>
                    <div className="flex gap-2 mt-2 sm:mt-0 items-center">
                      <span className="text-sm text-gray-500 mr-4">Apps: {job.applications_count || 0}</span>
                      <Badge variant="outline" className={job.status === 'open' ? "text-green-600 bg-green-50" : "text-gray-600"}>{job.status}</Badge>
                      {editingJobId === job.id ? (
                        <div className="flex items-center gap-2">
                          <Input
                            value={editingJobData.title}
                            onChange={(e) => setEditingJobData((prev) => ({ ...prev, title: e.target.value }))}
                            className="h-8 w-36"
                          />
                          <Input
                            value={editingJobData.salary}
                            onChange={(e) => setEditingJobData((prev) => ({ ...prev, salary: e.target.value }))}
                            className="h-8 w-32"
                          />
                          <Button size="sm" onClick={() => saveEditJob(job.id)} className="bg-[#3B5BDB] text-white">Save</Button>
                          <Button size="sm" variant="outline" onClick={() => setEditingJobId(null)}>Cancel</Button>
                        </div>
                      ) : (
                        <Button variant="outline" size="sm" onClick={() => startEditJob(job)}>Edit</Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );

      case "Post Job":
        return (
          <Card className="border-[#E5E7EB] mb-8 bg-white">
            <CardHeader>
              <CardTitle className="text-xl text-[#1F2937] flex items-center gap-2">
                <PlusCircle className="h-5 w-5 text-[#3B5BDB]" />
                Post a New Job
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePostJob} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="job-title">Job Title</Label>
                    <Input id="job-title" placeholder="e.g., Delivery Driver" value={newJob.title} onChange={e => setNewJob({...newJob, title: e.target.value})} className="border-[#E5E7EB]" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="skills">Required Skills</Label>
                    <Input id="skills" placeholder="e.g., Driving, Navigation" value={newJob.skills_required} onChange={e => setNewJob({...newJob, skills_required: e.target.value})} className="border-[#E5E7EB]" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Job Type</Label>
                  <RadioGroup value={jobType} onValueChange={setJobType}>
                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="full_time" id="ft" />
                        <Label htmlFor="ft" className="cursor-pointer">Full Time</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="part_time" id="pt" />
                        <Label htmlFor="pt" className="cursor-pointer">Part Time</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="temporary" id="temp" />
                        <Label htmlFor="temp" className="cursor-pointer">Temporary</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="salary">Salary Range</Label>
                    <Input id="salary" placeholder="e.g., ₹15,000 - ₹20,000" value={newJob.salary} onChange={e => setNewJob({...newJob, salary: e.target.value})} className="border-[#E5E7EB]" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hours">Working Hours</Label>
                    <Input id="hours" placeholder="e.g., 9 AM - 6 PM" value={newJob.working_hours} onChange={e => setNewJob({...newJob, working_hours: e.target.value})} className="border-[#E5E7EB]" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Job Location</Label>
                  <Input id="location" placeholder="e.g., Mumbai, Maharashtra" value={newJob.location} onChange={e => setNewJob({...newJob, location: e.target.value})} className="border-[#E5E7EB]" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Job Description</Label>
                  <Textarea id="description" value={newJob.description} onChange={e => setNewJob({...newJob, description: e.target.value})} placeholder="Describe the job responsibilities and requirements..." className="border-[#E5E7EB] min-h-25" required />
                </div>

                <div className="flex items-center justify-between p-4 bg-[#FFF4E6] rounded-lg border border-[#FF8C42]/20">
                  <div>
                    <Label htmlFor="urgent" className="text-[#1F2937] font-semibold">Urgent Hiring</Label>
                    <p className="text-sm text-[#6B7280] mt-1">Need worker today</p>
                  </div>
                  <Switch id="urgent" checked={urgentHiring} onCheckedChange={setUrgentHiring} />
                </div>

                <Button type="submit" className="w-full bg-linear-to-r from-[#3B5BDB] to-[#2EC4B6] hover:opacity-90 h-12 text-white border-0">
                  Post Job
                </Button>
              </form>
            </CardContent>
          </Card>
        );

      case "Applicants":
        return (
          <Card className="border-[#E5E7EB] bg-white">
            <CardHeader>
              <CardTitle className="text-xl text-[#1F2937] flex items-center gap-2">
                <Users className="h-5 w-5 text-[#3B5BDB]" />
                All Applicants
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {allApplicants.map((applicant) => (
                  <Card key={applicant.id} className="border-[#E5E7EB] bg-white">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row gap-6">
                        {/* Profile */}
                        <div className="flex items-start gap-4 flex-1">
                          <div className="w-16 h-16 rounded-full bg-linear-to-br from-[#3B5BDB] to-[#2EC4B6] flex items-center justify-center text-white font-bold text-xl shrink-0">
                            {applicant.applicant_name?.charAt(0) || "U"}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg text-[#1F2937] mb-1">
                              {applicant.applicant_name || "Unknown"} <Badge>{applicant.status}</Badge>
                            </h3>
                            <p className="text-sm text-[#6B7280] mb-2">
                              Applied for: <span className="font-medium text-[#1F2937]">{applicant.job_title}</span>
                            </p>
                            <div className="flex flex-wrap gap-3 text-sm text-[#6B7280] mb-3">
                              <div className="flex items-center gap-1">
                                <Phone className="h-4 w-4" />
                                {applicant.phone_number || "N/A"}
                              </div>
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 text-[#F59E0B]" />
                                {applicant.avg_rating || "N/A"}
                              </div>
                              <div>
                                Exp: {applicant.years_of_experience || 0} years
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-2 lg:w-48">
                          <Button onClick={() => handleApplicantAction("View Profile", applicant.id, applicant.applicant_name)} variant="outline" className="border-[#3B5BDB] text-[#3B5BDB] hover:bg-[#3B5BDB] hover:text-white">
                            View Profile
                          </Button>
                          {applicant.video_introduction_url && (
                            <Button onClick={() => handleApplicantAction("Watch Video", applicant.id, applicant.applicant_name)} variant="outline" className="border-[#2EC4B6] text-[#2EC4B6] hover:bg-[#2EC4B6] hover:text-white">
                              <Play className="h-4 w-4 mr-2" />
                              Watch Video
                            </Button>
                          )}
                          <Button onClick={() => handleApplicantAction("Shortlist", applicant.id, applicant.applicant_name)} className={`hover:bg-[#FF8C42]/90 text-white border-0 ${applicant.status === 'shortlisted' ? 'bg-gray-400' : 'bg-[#FF8C42]'}`}>
                            {applicant.status === 'shortlisted' ? "Already Shortlisted" : "Shortlist"}
                          </Button>
                          <Button onClick={() => handleApplicantAction("Contact", applicant.id, applicant.applicant_name)} variant="outline" className="border-[#E5E7EB]">
                            <Phone className="h-4 w-4 mr-2" />
                            Contact
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {allApplicants.length === 0 && <p>No applicants yet.</p>}
              </div>
            </CardContent>
          </Card>
        );

      case "Notifications":
        return (
          <Card className="border-[#E5E7EB] bg-white">
            <CardHeader><CardTitle>Notifications</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-1">
               {notifications.map(n => (
                <div 
                  key={n.id} 
                  onClick={() => setActivePage("Applicants")} 
                  className="p-3 border rounded-lg cursor-pointer hover:bg-blue-50/50 transition-colors flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium text-[#1F2937]">{n.title || "Alert"}</p>
                    <p className="text-sm text-[#6B7280]">{n.message}</p>
                  </div>
                  <Button variant="ghost" size="sm" className="text-[#3B5BDB]">View</Button>
                </div>
              ))}
              {notifications.length === 0 && <p className="text-[#6B7280] p-4 text-center">No new notifications.</p>}
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
                Welcome Back, {profile?.name || user?.name || "Employer"} 👋
              </h1>
              <p className="text-[#6B7280]">Manage your jobs and review applicants from this overview.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="border-[#E5E7EB] bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[#6B7280] text-sm mb-1">Active Jobs</p>
                      <p className="text-3xl font-bold text-[#1F2937]">{myJobs.length}</p>
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
                      <p className="text-[#6B7280] text-sm mb-1">Applications Received</p>
                      <p className="text-3xl font-bold text-[#1F2937]">{allApplicants.length}</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-[#2EC4B6]/10 flex items-center justify-center">
                      <Users className="h-6 w-6 text-[#2EC4B6]" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-[#E5E7EB] bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[#6B7280] text-sm mb-1">Shortlisted Workers</p>
                      <p className="text-3xl font-bold text-[#1F2937]">{allApplicants.filter(a => a.status === 'shortlisted').length}</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-[#FF8C42]/10 flex items-center justify-center">
                      <Star className="h-6 w-6 text-[#FF8C42]" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="mt-6 text-center">
              <Button onClick={() => setActivePage("Applicants")} variant="outline" className="border-[#3B5BDB] text-[#3B5BDB]">
                View All Pending Applicants
              </Button>
            </div>
          </>
        );
    }
  };

  return (
    <div className="bg-[#F7FAFF] min-h-screen py-8 relative">
      {showPopup && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 bg-green-600 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-semibold">{popupMessage}</span>
          <button onClick={() => setShowPopup(false)} className="text-white/80 hover:text-white ml-2"><X className="w-4 h-4"/></button>
        </div>
      )}

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

                    const className = `w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors cursor-pointer ${
                      item.label === activePage
                        ? "bg-[#3B5BDB] text-white"
                        : "text-[#1F2937] hover:bg-[#F7F9FC]"
                    }`;

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

"use client";

import { useState } from "react";
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
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Switch } from "./ui/switch";
import { Badge } from "./ui/badge";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/employer/dashboard" },
  { icon: Building2, label: "Company Profile" },
  { icon: PlusCircle, label: "Post Job", href: "/employer/post" },
  { icon: FileText, label: "Manage Jobs", href: "/employer/manage-jobs" },
  { icon: Users, label: "Applicants" },
  { icon: Bell, label: "Notifications" },
];

const applicants = [
  {
    id: 1,
    name: "Ravi Kumar",
    skills: "Delivery, Driving",
    location: "Mumbai, Maharashtra",
    rating: 4.5,
    experience: "2 years",
    hasVideo: true,
    appliedFor: "Delivery Driver",
  },
  {
    id: 2,
    name: "Amit Sharma",
    skills: "Warehouse, Inventory",
    location: "Navi Mumbai",
    rating: 4.8,
    experience: "3 years",
    hasVideo: true,
    appliedFor: "Warehouse Helper",
  },
  {
    id: 3,
    name: "Priya Patel",
    skills: "Customer Service, Sales",
    location: "Andheri, Mumbai",
    rating: 4.2,
    experience: "1 year",
    hasVideo: false,
    appliedFor: "Retail Assistant",
  },
  {
    id: 4,
    name: "Suresh Yadav",
    skills: "Cleaning, Maintenance",
    location: "Bandra, Mumbai",
    rating: 4.6,
    experience: "4 years",
    hasVideo: true,
    appliedFor: "Office Cleaner",
  },
];

interface EmployerDashboardClientProps {
  initialActivePage?: string;
}

export function EmployerDashboardClient({ initialActivePage = "Dashboard" }: EmployerDashboardClientProps) {
  const [activePage, setActivePage] = useState(initialActivePage);
  const [jobType, setJobType] = useState("fulltime");
  const [urgentHiring, setUrgentHiring] = useState(false);

  const handlePostJob = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Job posted successfully!");
  };

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
            {activePage !== "Post Job" && (
              <>
                {/* Welcome Message */}
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-[#1F2937] mb-2">
                    Welcome Back! 👋
                  </h1>
                  <p className="text-[#6B7280]">Manage your jobs and review applicants.</p>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <Card className="border-[#E5E7EB] bg-white">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[#6B7280] text-sm mb-1">Active Jobs</p>
                          <p className="text-3xl font-bold text-[#1F2937]">8</p>
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
                          <p className="text-3xl font-bold text-[#1F2937]">45</p>
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
                          <p className="text-3xl font-bold text-[#1F2937]">12</p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-[#FF8C42]/10 flex items-center justify-center">
                          <Star className="h-6 w-6 text-[#FF8C42]" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}

            {/* Post Job Quick Form */}
            {(activePage === "Post Job" || activePage === "Dashboard") && (
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
                        <Input
                          id="job-title"
                          placeholder="e.g., Delivery Driver"
                          className="border-[#E5E7EB]"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="skills">Required Skills</Label>
                        <Input
                          id="skills"
                          placeholder="e.g., Driving, Navigation"
                          className="border-[#E5E7EB]"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Job Type</Label>
                      <RadioGroup value={jobType} onValueChange={setJobType}>
                        <div className="flex flex-wrap gap-4">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="fulltime" id="ft" />
                            <Label htmlFor="ft" className="cursor-pointer">Full Time</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="parttime" id="pt" />
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
                        <Input
                          id="salary"
                          placeholder="e.g., ₹15,000 - ₹20,000"
                          className="border-[#E5E7EB]"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="hours">Working Hours</Label>
                        <Input
                          id="hours"
                          placeholder="e.g., 9 AM - 6 PM"
                          className="border-[#E5E7EB]"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Job Location</Label>
                      <Input
                        id="location"
                        placeholder="e.g., Mumbai, Maharashtra"
                        className="border-[#E5E7EB]"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Job Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Describe the job responsibilities and requirements..."
                        className="border-[#E5E7EB] min-h-[100px]"
                        required
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-[#FFF4E6] rounded-lg border border-[#FF8C42]/20">
                      <div>
                        <Label htmlFor="urgent" className="text-[#1F2937] font-semibold">
                          Urgent Hiring
                        </Label>
                        <p className="text-sm text-[#6B7280] mt-1">Need worker today</p>
                      </div>
                      <Switch
                        id="urgent"
                        checked={urgentHiring}
                        onCheckedChange={setUrgentHiring}
                      />
                    </div>

                    <Button type="submit" className="w-full bg-gradient-to-r from-[#3B5BDB] to-[#2EC4B6] hover:opacity-90 h-12 text-white border-0">
                      Post Job
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Applicants Section */}
            {activePage !== "Post Job" && (
              <Card className="border-[#E5E7EB] bg-white">
                <CardHeader>
                  <CardTitle className="text-xl text-[#1F2937] flex items-center gap-2">
                    <Users className="h-5 w-5 text-[#3B5BDB]" />
                    Recent Applicants
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {applicants.map((applicant) => (
                      <Card key={applicant.id} className="border-[#E5E7EB] bg-white">
                        <CardContent className="p-6">
                          <div className="flex flex-col lg:flex-row gap-6">
                            {/* Profile */}
                            <div className="flex items-start gap-4 flex-1">
                              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#3B5BDB] to-[#2EC4B6] flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                                {applicant.name.charAt(0)}
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold text-lg text-[#1F2937] mb-1">
                                  {applicant.name}
                                </h3>
                                <p className="text-sm text-[#6B7280] mb-2">
                                  Applied for: <span className="font-medium text-[#1F2937]">{applicant.appliedFor}</span>
                                </p>
                                <div className="flex flex-wrap gap-3 text-sm text-[#6B7280] mb-3">
                                  <div className="flex items-center gap-1">
                                    <MapPin className="h-4 w-4" />
                                    {applicant.location}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Star className="h-4 w-4 text-[#F59E0B]" />
                                    {applicant.rating}
                                  </div>
                                  <div>
                                    Experience: {applicant.experience}
                                  </div>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  {applicant.skills.split(", ").map((skill, index) => (
                                    <Badge
                                      key={index}
                                      className="bg-[#3B5BDB]/10 text-[#3B5BDB] hover:bg-[#3B5BDB]/20"
                                    >
                                      {skill}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col gap-2 lg:w-48">
                              <Button
                                variant="outline"
                                className="border-[#3B5BDB] text-[#3B5BDB] hover:bg-[#3B5BDB] hover:text-white"
                              >
                                View Profile
                              </Button>
                              {applicant.hasVideo && (
                                <Button
                                  variant="outline"
                                  className="border-[#2EC4B6] text-[#2EC4B6] hover:bg-[#2EC4B6] hover:text-white"
                                >
                                  <Play className="h-4 w-4 mr-2" />
                                  Watch Video
                                </Button>
                              )}
                              <Button className="bg-[#FF8C42] hover:bg-[#FF8C42]/90 text-white border-0">
                                Shortlist
                              </Button>
                              <Button variant="outline" className="border-[#E5E7EB]">
                                <Phone className="h-4 w-4 mr-2" />
                                Contact
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <div className="mt-6 text-center">
                    <Button variant="outline" className="border-[#3B5BDB] text-[#3B5BDB]">
                      View All Applicants
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

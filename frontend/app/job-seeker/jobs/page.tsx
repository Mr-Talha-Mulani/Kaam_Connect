"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Search, MapPin, Filter, Briefcase, DollarSign, Clock, Building2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent } from "../../components/ui/card";
import { Label } from "../../components/ui/label";
import { Checkbox } from "../../components/ui/checkbox";
import { Slider } from "../../components/ui/slider";
import { Badge } from "../../components/ui/badge";

const jobsData = [
  {
    id: 1,
    title: "Delivery Driver",
    company: "QuickDeliver Co.",
    location: "Mumbai, Maharashtra",
    distance: "2 km",
    hours: "9 AM - 6 PM",
    salary: "₹15,000 - ₹20,000/month",
    type: "Full Time",
    category: "Delivery Jobs",
    description: "Looking for reliable delivery drivers with valid license. Two-wheeler required.",
    posted: "2 hours ago",
  },
  {
    id: 2,
    title: "Warehouse Helper",
    company: "Storage Solutions Ltd.",
    location: "Navi Mumbai",
    distance: "5 km",
    hours: "8 AM - 5 PM",
    salary: "₹12,000 - ₹18,000/month",
    type: "Full Time",
    category: "Warehouse Helper",
    description: "Need helpers for warehouse operations. Loading, unloading, and inventory management.",
    posted: "5 hours ago",
  },
  {
    id: 3,
    title: "Restaurant Server",
    company: "Foodie Paradise",
    location: "Andheri, Mumbai",
    distance: "3 km",
    hours: "11 AM - 11 PM",
    salary: "₹10,000 - ₹15,000/month",
    type: "Part Time",
    category: "Restaurant Staff",
    description: "Friendly servers needed for a busy restaurant. Experience preferred but not required.",
    posted: "1 day ago",
  },
  {
    id: 4,
    title: "Retail Sales Associate",
    company: "MegaMart",
    location: "Bandra, Mumbai",
    distance: "4 km",
    hours: "10 AM - 8 PM",
    salary: "₹13,000 - ₹17,000/month",
    type: "Full Time",
    category: "Retail Assistant",
    description: "Join our retail team! Help customers, manage inventory, and create great shopping experiences.",
    posted: "2 days ago",
  },
  {
    id: 5,
    title: "Office Cleaner",
    company: "CleanPro Services",
    location: "Lower Parel, Mumbai",
    distance: "6 km",
    hours: "7 AM - 3 PM",
    salary: "₹9,000 - ₹12,000/month",
    type: "Full Time",
    category: "Cleaner",
    description: "Responsible for maintaining cleanliness in office spaces. Supplies provided.",
    posted: "3 days ago",
  },
  {
    id: 6,
    title: "Security Guard",
    company: "SecureWatch",
    location: "Powai, Mumbai",
    distance: "7 km",
    hours: "24/7 Shifts",
    salary: "₹14,000 - ₹18,000/month",
    type: "Full Time",
    category: "Security Guard",
    description: "Security guards needed for residential complex. Must be alert and responsible.",
    posted: "4 days ago",
  },
];

export default function JobSearchPage() {
  const searchParams = useSearchParams();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [salaryRange, setSalaryRange] = useState([10000]);

  // Read from URL on mount
  useEffect(() => {
    const q = searchParams.get("q");
    const loc = searchParams.get("loc");
    const cat = searchParams.get("category");
    
    if (q) setSearchQuery(q);
    if (loc) setLocation(loc);
    if (cat) setSearchQuery(cat); // use category as search term for basic prototype logic
  }, [searchParams]);

  // Very basic mock filtering for prototype
  const filteredJobs = jobsData.filter(job => {
    if (searchQuery && !job.title.toLowerCase().includes(searchQuery.toLowerCase()) && !job.category.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (location && !job.location.toLowerCase().includes(location.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="bg-[#F7FAFF] min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Top Search Bar */}
        <Card className="border-[#E5E7EB] mb-8 bg-white">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#6B7280]" />
                <Input
                  placeholder="Search job title or skill"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 border-[#E5E7EB] text-[#1F2937]"
                />
              </div>
              <div className="flex-1 relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#6B7280]" />
                <Input
                  placeholder="Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="pl-10 h-12 border-[#E5E7EB] text-[#1F2937]"
                />
              </div>
              <Button className="bg-[#3B5BDB] hover:bg-[#3B5BDB]/90 h-12 px-8 text-white border-0">
                Search
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Panel */}
          <aside className="lg:w-80 flex-shrink-0">
            <Card className="border-[#E5E7EB] sticky top-24 bg-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Filter className="h-5 w-5 text-[#3B5BDB]" />
                  <h2 className="font-semibold text-lg text-[#1F2937]">Filters</h2>
                </div>

                {/* Job Type */}
                <div className="mb-6">
                  <h3 className="font-medium text-[#1F2937] mb-3">Job Type</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="fulltime" />
                      <Label htmlFor="fulltime" className="text-[#6B7280] cursor-pointer">
                        Full Time
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="parttime" />
                      <Label htmlFor="parttime" className="text-[#6B7280] cursor-pointer">
                        Part Time
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="temporary" />
                      <Label htmlFor="temporary" className="text-[#6B7280] cursor-pointer">
                        Temporary
                      </Label>
                    </div>
                  </div>
                </div>

                {/* Category */}
                <div className="mb-6">
                  <h3 className="font-medium text-[#1F2937] mb-3">Category</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="delivery" />
                      <Label htmlFor="delivery" className="text-[#6B7280] cursor-pointer">
                        Delivery
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="retail" />
                      <Label htmlFor="retail" className="text-[#6B7280] cursor-pointer">
                        Retail
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="driver" />
                      <Label htmlFor="driver" className="text-[#6B7280] cursor-pointer">
                        Driver
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="cleaner" />
                      <Label htmlFor="cleaner" className="text-[#6B7280] cursor-pointer">
                        Cleaner
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="warehouse" />
                      <Label htmlFor="warehouse" className="text-[#6B7280] cursor-pointer">
                        Warehouse
                      </Label>
                    </div>
                  </div>
                </div>

                {/* Distance Filter */}
                <div className="mb-6">
                  <h3 className="font-medium text-[#1F2937] mb-3">Distance</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="2km" />
                      <Label htmlFor="2km" className="text-[#6B7280] cursor-pointer">
                        Within 2 km
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="5km" defaultChecked />
                      <Label htmlFor="5km" className="text-[#6B7280] cursor-pointer">
                        Within 5 km
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="10km" />
                      <Label htmlFor="10km" className="text-[#6B7280] cursor-pointer">
                        Within 10 km
                      </Label>
                    </div>
                  </div>
                </div>

                {/* Salary Range */}
                <div className="mb-6">
                  <h3 className="font-medium text-[#1F2937] mb-3">Salary Range</h3>
                  <div className="space-y-4">
                    <Slider
                      value={salaryRange}
                      onValueChange={setSalaryRange}
                      max={50000}
                      step={1000}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-[#6B7280]">
                      <span>₹0</span>
                      <span className="font-medium text-[#3B5BDB]">
                        ₹{salaryRange[0].toLocaleString()}
                      </span>
                      <span>₹50,000</span>
                    </div>
                  </div>
                </div>

                <Button className="w-full bg-gradient-to-r from-[#3B5BDB] to-[#2EC4B6] hover:opacity-90 text-white border-0">
                  Apply Filters
                </Button>
              </CardContent>
            </Card>
          </aside>

          {/* Job Listings */}
          <main className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <h1 className="text-2xl font-bold text-[#1F2937]">
                {filteredJobs.length} Jobs Found
              </h1>
              <select className="px-4 py-2 border border-[#E5E7EB] rounded-lg text-[#6B7280] bg-white focus:outline-none focus:ring-2 focus:ring-[#3B5BDB]">
                <option>Sort by: Latest</option>
                <option>Salary: High to Low</option>
                <option>Salary: Low to High</option>
                <option>Distance: Nearest</option>
              </select>
            </div>

            <div className="space-y-4">
              {filteredJobs.map((job) => (
                <Card
                  key={job.id}
                  className="border-[#E5E7EB] bg-white hover:shadow-lg transition-all cursor-pointer"
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Company Logo */}
                      <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-[#3B5BDB] to-[#2EC4B6] flex items-center justify-center flex-shrink-0">
                        <Building2 className="h-8 w-8 text-white" />
                      </div>

                      {/* Job Details */}
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-3">
                          <div>
                            <h2 className="text-xl font-semibold text-[#1F2937] mb-1">
                              {job.title}
                            </h2>
                            <p className="text-[#6B7280]">{job.company}</p>
                          </div>
                          <Badge className="bg-[#2EC4B6]/10 text-[#2EC4B6] hover:bg-[#2EC4B6]/20 w-fit">
                            {job.type}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4 text-sm text-[#6B7280]">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 flex-shrink-0" />
                            <span>{job.location} ({job.distance})</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 flex-shrink-0" />
                            <span>{job.hours}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 flex-shrink-0" />
                            <span className="font-medium text-[#1F2937]">{job.salary}</span>
                          </div>
                        </div>

                        <p className="text-[#6B7280] mb-4 line-clamp-2">{job.description}</p>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                          <span className="text-sm text-[#6B7280]">Posted {job.posted}</span>
                          <div className="flex gap-3 w-full sm:w-auto">
                            <Button
                              variant="outline"
                              className="flex-1 sm:flex-initial border-[#3B5BDB] text-[#3B5BDB] hover:bg-[#3B5BDB] hover:text-white"
                            >
                              View Details
                            </Button>
                            <Button className="flex-1 sm:flex-initial bg-[#3B5BDB] hover:bg-[#3B5BDB]/90 text-white border-0">
                              Apply Now
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredJobs.length > 0 && (
              <div className="mt-8 flex justify-center gap-2">
                <Button variant="outline" className="border-[#E5E7EB]">Previous</Button>
                <Button className="bg-[#3B5BDB] text-white border-0 hover:bg-[#3B5BDB]/90">1</Button>
                <Button variant="outline" className="border-[#E5E7EB]">2</Button>
                <Button variant="outline" className="border-[#E5E7EB]">3</Button>
                <Button variant="outline" className="border-[#E5E7EB]">Next</Button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

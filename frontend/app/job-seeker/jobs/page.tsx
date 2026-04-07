"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Search, MapPin, Filter, Briefcase, DollarSign, Clock, Building2, Loader2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent } from "../../components/ui/card";
import { Label } from "../../components/ui/label";
import { Checkbox } from "../../components/ui/checkbox";
import { Slider } from "../../components/ui/slider";
import { Badge } from "../../components/ui/badge";
import { jobsApi, seekerApi } from "../../lib/api";

export default function JobSearchPage() {
  const searchParams = useSearchParams();
  
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedJobId, setExpandedJobId] = useState<number | null>(null);
  const [applyingJobId, setApplyingJobId] = useState<number | null>(null);
  
  const [searchQuery, setSearchQuery] = useState("");

  const handleApply = async (jobId: number) => {
    setApplyingJobId(jobId);
    try {
       await seekerApi.applyToJob(jobId, "Fast apply via Jobs page");
       alert("Successfully applied to the job!");
    } catch (err: any) {
       alert("Failed to apply: " + err.message);
    } finally {
       setApplyingJobId(null);
    }
  };
  const [location, setLocation] = useState("");
  
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [salaryRange, setSalaryRange] = useState([0]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const q = searchParams.get("q");
    const loc = searchParams.get("loc");
    const cat = searchParams.get("category");
    const typeArgs = searchParams.get("type");
    
    if (q) setSearchQuery(q);
    if (loc) setLocation(loc);
    if (cat && !selectedCategories.includes(cat)) {
      setSelectedCategories((prev) => [...prev, cat]);
    }
    if (typeArgs) {
      setSelectedTypes((prev) => [...prev, typeArgs]);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchJobs();
  }, []); // Run once, then local filtering

  const fetchJobs = async () => {
    try {
      setIsLoading(true);
      const res = await jobsApi.search();
      setJobs(res.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSelection = (setter: any, value: string) => {
    setter((prev: string[]) => 
      prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]
    );
    setCurrentPage(1);
  };

  // Frontend filtering since we fetched all open jobs
  const filteredJobs = jobs.filter(job => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!job.title.toLowerCase().includes(q) && 
          !job.category?.toLowerCase().includes(q) && 
          !job.employer_name?.toLowerCase().includes(q)) {
        return false;
      }
    }
    if (location && !job.location.toLowerCase().includes(location.toLowerCase())) {
      return false;
    }
    if (selectedTypes.length > 0 && !selectedTypes.includes(job.job_type === "full_time" ? "Full Time" : job.job_type === "part_time" ? "Part Time" : "Temporary")) {
      return false;
    }
    if (selectedCategories.length > 0 && !selectedCategories.some(c => job.category?.toLowerCase().includes(c.toLowerCase()))) {
      return false;
    }
    if (job.salary_max && job.salary_max < salaryRange[0]) {
      return false;
    }

    return true;
  });

  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const displayedJobs = filteredJobs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const formatJobType = (t: string) => t === 'full_time' ? "Full Time" : t === 'part_time' ? "Part Time" : t === 'daily_wage' ? "Daily Wage" : "Temporary";
  const formatINR = (salary: any, min?: number, max?: number) => {
    if (salary && typeof salary === "string") {
      return salary.includes("₹") ? salary : `₹${salary}`;
    }
    if (typeof min === "number" && typeof max === "number") {
      return `₹${min.toLocaleString()} - ₹${max.toLocaleString()}`;
    }
    return "₹0";
  };

  return (
    <div className="bg-[#F7FAFF] min-h-screen py-8">
      <div className="container mx-auto px-4">
        <Card className="border-[#E5E7EB] mb-8 bg-white">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#6B7280]" />
                <Input
                  placeholder="Search job title or skill"
                  value={searchQuery}
                  onChange={(e) => {setSearchQuery(e.target.value); setCurrentPage(1);}}
                  className="pl-10 h-12 border-[#E5E7EB] text-[#1F2937]"
                />
              </div>
              <div className="flex-1 relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#6B7280]" />
                <Input
                  placeholder="Location"
                  value={location}
                  onChange={(e) => {setLocation(e.target.value); setCurrentPage(1);}}
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
          <aside className="lg:w-80 shrink-0">
            <Card className="border-[#E5E7EB] sticky top-24 bg-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Filter className="h-5 w-5 text-[#3B5BDB]" />
                  <h2 className="font-semibold text-lg text-[#1F2937]">Filters</h2>
                </div>

                <div className="mb-6">
                  <h3 className="font-medium text-[#1F2937] mb-3">Job Type</h3>
                  <div className="space-y-3">
                    {["Full Time", "Part Time", "Temporary", "Daily Wage"].map((type) => (
                      <div className="flex items-center space-x-2" key={type}>
                        <Checkbox 
                          id={`type-${type}`} 
                          checked={selectedTypes.includes(type)}
                          onCheckedChange={() => toggleSelection(setSelectedTypes, type)}
                        />
                        <Label htmlFor={`type-${type}`} className="text-[#6B7280] cursor-pointer">
                          {type}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-medium text-[#1F2937] mb-3">Category</h3>
                  <div className="space-y-3">
                    {["Delivery", "Retail", "Restaurant Staff", "Cleaner", "Warehouse", "Security Guard", "Helper"].map((cat) => (
                      <div className="flex items-center space-x-2" key={cat}>
                        <Checkbox 
                          id={`cat-${cat}`} 
                          checked={selectedCategories.some(c => c.toLowerCase() === cat.toLowerCase())}
                          onCheckedChange={() => toggleSelection(setSelectedCategories, cat)}
                        />
                        <Label htmlFor={`cat-${cat}`} className="text-[#6B7280] cursor-pointer">
                          {cat}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-medium text-[#1F2937] mb-3">Min Salary Range</h3>
                  <div className="space-y-4">
                    <Slider
                      value={salaryRange}
                      onValueChange={(val) => {setSalaryRange(val); setCurrentPage(1);}}
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

                <Button 
                  className="w-full bg-linear-to-r from-[#3B5BDB] to-[#2EC4B6] hover:opacity-90 text-white border-0"
                  onClick={() => {
                    setSelectedTypes([]);
                    setSelectedCategories([]);
                    setSalaryRange([0]);
                    setSearchQuery("");
                    setLocation("");
                  }}
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          </aside>

          <main className="flex-1">
            {isLoading ? (
              <div className="flex justify-center items-center py-24">
                <Loader2 className="h-10 w-10 text-[#3B5BDB] animate-spin" />
              </div>
            ) : (
             <>
              <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-[#1F2937]">
                  {filteredJobs.length} Jobs Found
                </h1>
                <select className="px-4 py-2 border border-[#E5E7EB] rounded-lg text-[#6B7280] bg-white focus:outline-none focus:ring-2 focus:ring-[#3B5BDB]">
                  <option>Sort by: Latest</option>
                  <option>Salary: High to Low</option>
                  <option>Salary: Low to High</option>
                </select>
              </div>

              <div className="space-y-4">
                {displayedJobs.map((job) => (
                  <Card
                    key={job.id}
                    className="border-[#E5E7EB] bg-white hover:shadow-lg transition-all cursor-pointer"
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row gap-6">
                        <div className="w-16 h-16 rounded-lg bg-linear-to-br from-[#3B5BDB] to-[#2EC4B6] flex items-center justify-center shrink-0">
                          <Building2 className="h-8 w-8 text-white" />
                        </div>

                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-3">
                            <div>
                              <h2 className="text-xl font-semibold text-[#1F2937] mb-1">
                                {job.title} {job.is_urgent && <Badge className="bg-red-100 text-red-600 ml-2">Urgent</Badge>}
                              </h2>
                              <p className="text-[#6B7280]">{job.employer_name || "Company Confidential"}</p>
                            </div>
                            <Badge className="bg-[#2EC4B6]/10 text-[#2EC4B6] hover:bg-[#2EC4B6]/20 w-fit">
                              {formatJobType(job.job_type)}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4 text-sm text-[#6B7280]">
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 shrink-0" />
                              <span>{job.location}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 shrink-0" />
                              <span>{job.working_hours_start?.substring(0,5)} - {job.working_hours_end?.substring(0,5)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <DollarSign className="h-4 w-4 shrink-0" />
                              <span className="font-medium text-[#1F2937]">{formatINR(job.salary, job.salary_min, job.salary_max)}</span>
                            </div>
                          </div>

                          <p className={`text-[#6B7280] mb-4 ${expandedJobId === job.id ? '' : 'line-clamp-2'}`}>{job.description}</p>

                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                            <span className="text-sm text-[#6B7280]">Posted at {new Date(job.created_at).toLocaleDateString()}</span>
                            <div className="flex gap-3 w-full sm:w-auto">
                              <Button
                                variant="outline"
                                onClick={() => setExpandedJobId(expandedJobId === job.id ? null : job.id)}
                                className="flex-1 sm:flex-initial border-[#3B5BDB] text-[#3B5BDB] hover:bg-[#3B5BDB] hover:text-white"
                              >
                                {expandedJobId === job.id ? 'Hide Details' : 'View Details'}
                              </Button>
                              <Button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleApply(job.id);
                                }}
                                disabled={applyingJobId === job.id}
                                className="flex-1 sm:flex-initial bg-[#3B5BDB] hover:bg-[#3B5BDB]/90 text-white border-0"
                              >
                                {applyingJobId === job.id ? 'Applying...' : 'Apply Now'}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {filteredJobs.length === 0 && (
                  <div className="text-center py-10 bg-white border rounded">
                    <p className="text-gray-500">No jobs found matching your criteria.</p>
                  </div>
                )}
              </div>

              {totalPages > 1 && (
                <div className="mt-8 flex justify-center gap-2">
                  <Button 
                    variant="outline" 
                    className="border-[#E5E7EB]"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  
                  {[...Array(totalPages)].map((_, i) => (
                    <Button 
                      key={i}
                      className={`${currentPage === i + 1 ? 'bg-[#3B5BDB] text-white hover:bg-[#3B5BDB]/90' : 'bg-transparent text-gray-800 hover:bg-gray-100'} border-[#E5E7EB] border`}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </Button>
                  ))}
                  
                  <Button 
                    variant="outline" 
                    className="border-[#E5E7EB]"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
             </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

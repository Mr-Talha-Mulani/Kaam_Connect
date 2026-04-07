"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Star, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { seekerApi } from "../../lib/api";

export default function JobSeekerRatingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [applications, setApplications] = useState<any[]>([]);
  const [ratingsDraft, setRatingsDraft] = useState<Record<number, number>>({});

  useEffect(() => {
    const fetchApplications = async () => {
      setIsLoading(true);
      try {
        const response = await seekerApi.getMyApplications();
        setApplications(response.data || []);
      } catch {
        setApplications([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const pendingRatings = useMemo(
    () => applications.filter((a) => ["accepted", "completed"].includes(a.status)),
    [applications]
  );

  const ratedJobs = useMemo(
    () => applications.filter((a) => a.status === "rated"),
    [applications]
  );

  return (
    <div className="bg-[#F7FAFF] min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#1F2937]">Ratings</h1>
            <p className="text-[#6B7280]">See completed jobs that still need ratings and jobs you have already rated.</p>
          </div>
          <Button asChild variant="outline" className="border-[#3B5BDB] text-[#3B5BDB]">
            <Link href="/job-seeker/dashboard">Back to Dashboard</Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="h-40 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-[#3B5BDB]" />
          </div>
        ) : (
          <div className="space-y-6">
            <Card className="border-[#E5E7EB] bg-white">
              <CardHeader>
                <CardTitle>Jobs Waiting For Rating</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {pendingRatings.length === 0 && (
                  <p className="text-[#6B7280]">No completed jobs are pending rating right now.</p>
                )}
                {pendingRatings.map((job) => (
                  <div key={job.id} className="border rounded-lg p-4">
                    <p className="font-semibold text-[#1F2937]">{job.title || job.job_title}</p>
                    <p className="text-sm text-[#6B7280] mb-2">Employer: {job.employer_name || "Unknown Employer"}</p>
                    <div className="flex items-center justify-between gap-3">
                      <Badge className="bg-[#FFF4E6] text-[#FF8C42]">Pending Rating</Badge>
                      <div className="flex items-center gap-2">
                        <select
                          value={ratingsDraft[job.id] || 5}
                          onChange={(e) => setRatingsDraft((prev) => ({ ...prev, [job.id]: Number(e.target.value) }))}
                          className="border rounded-md h-9 px-2"
                        >
                          <option value={5}>5 Stars</option>
                          <option value={4}>4 Stars</option>
                          <option value={3}>3 Stars</option>
                          <option value={2}>2 Stars</option>
                          <option value={1}>1 Star</option>
                        </select>
                        <Button size="sm" className="bg-[#3B5BDB] hover:bg-[#3B5BDB]/90">
                          Rate Job
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-[#E5E7EB] bg-white">
              <CardHeader>
                <CardTitle>Previously Rated Jobs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {ratedJobs.length === 0 && (
                  <p className="text-[#6B7280]">No rated jobs yet. Once rated, they will appear here.</p>
                )}
                {ratedJobs.map((job) => (
                  <div key={job.id} className="border rounded-lg p-4 flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-[#1F2937]">{job.title || job.job_title}</p>
                      <p className="text-sm text-[#6B7280]">Employer: {job.employer_name || "Unknown Employer"}</p>
                    </div>
                    <div className="flex items-center gap-1 text-[#F59E0B]">
                      <Star className="h-4 w-4 fill-current" />
                      <Star className="h-4 w-4 fill-current" />
                      <Star className="h-4 w-4 fill-current" />
                      <Star className="h-4 w-4 fill-current" />
                      <Star className="h-4 w-4" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

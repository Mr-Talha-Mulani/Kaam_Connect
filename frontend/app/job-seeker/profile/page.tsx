"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { seekerApi } from "../../lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";

export default function JobSeekerProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    full_name: "",
    date_of_birth: "",
    phone_number: "",
    residential_address: "",
    city: "",
    pincode: "",
    id_proof_type: "aadhaar",
    id_proof_last4: "",
    primary_skill: "",
    primary_skill_level: "beginner",
    years_of_experience: 0,
    secondary_skills: "",
    work_type_preference: "full_time",
    preferred_hours: "",
    qualification: "12th_pass",
    location: "",
    consents_to_terms: true,
    declares_age_18_plus: true,
    declares_info_accurate: true,
    declares_no_criminal_history: true,
  });

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      try {
        const response = await seekerApi.getProfile();
        const p = response.data || {};
        setForm((prev) => ({
          ...prev,
          ...p,
          years_of_experience: Number(p.years_of_experience || 0),
          date_of_birth: p.date_of_birth ? String(p.date_of_birth).slice(0, 10) : "",
        }));
      } catch {
        // No profile yet, show blank form.
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      await seekerApi.upsertProfile(form);
      setMessage("Profile saved successfully.");
    } catch (err: any) {
      setMessage(err.message || "Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#3B5BDB]" />
      </div>
    );
  }

  return (
    <div className="bg-[#F7FAFF] min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-[#1F2937]">Worker Profile</h1>
          <Button asChild variant="outline" className="border-[#3B5BDB] text-[#3B5BDB]">
            <Link href="/job-seeker/dashboard">Back</Link>
          </Button>
        </div>

        <Card className="border-[#E5E7EB] bg-white">
          <CardHeader>
            <CardTitle>Profile Details (Requirement Checklist)</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Full Name</Label>
                <Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} required />
              </div>
              <div>
                <Label>Date of Birth</Label>
                <Input type="date" value={form.date_of_birth} onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })} />
              </div>
              <div>
                <Label>Phone Number</Label>
                <Input value={form.phone_number} onChange={(e) => setForm({ ...form, phone_number: e.target.value })} required />
              </div>
              <div>
                <Label>City</Label>
                <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
              </div>
              <div className="md:col-span-2">
                <Label>Residential Address</Label>
                <Input value={form.residential_address} onChange={(e) => setForm({ ...form, residential_address: e.target.value })} />
              </div>
              <div>
                <Label>Pincode</Label>
                <Input value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} />
              </div>
              <div>
                <Label>ID Proof Last 4 Digits</Label>
                <Input maxLength={4} value={form.id_proof_last4} onChange={(e) => setForm({ ...form, id_proof_last4: e.target.value })} />
              </div>
              <div>
                <Label>Primary Skill</Label>
                <Input value={form.primary_skill} onChange={(e) => setForm({ ...form, primary_skill: e.target.value })} required />
              </div>
              <div>
                <Label>Skill Level</Label>
                <select className="w-full border rounded-md h-10 px-3" value={form.primary_skill_level} onChange={(e) => setForm({ ...form, primary_skill_level: e.target.value })}>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="expert">Expert</option>
                </select>
              </div>
              <div>
                <Label>Years of Experience</Label>
                <Input type="number" min={0} value={form.years_of_experience} onChange={(e) => setForm({ ...form, years_of_experience: Number(e.target.value || 0) })} />
              </div>
              <div>
                <Label>Work Type Preference</Label>
                <select className="w-full border rounded-md h-10 px-3" value={form.work_type_preference} onChange={(e) => setForm({ ...form, work_type_preference: e.target.value })}>
                  <option value="full_time">Full Time</option>
                  <option value="part_time">Part Time</option>
                  <option value="daily_wage">Daily Wage</option>
                  <option value="freelance">Freelance</option>
                </select>
              </div>
              <div>
                <Label>Preferred Working Hours</Label>
                <Input value={form.preferred_hours} onChange={(e) => setForm({ ...form, preferred_hours: e.target.value })} placeholder="e.g. 9 AM - 6 PM" />
              </div>
              <div>
                <Label>Qualification</Label>
                <select className="w-full border rounded-md h-10 px-3" value={form.qualification} onChange={(e) => setForm({ ...form, qualification: e.target.value })}>
                  <option value="10th_pass">10th Pass</option>
                  <option value="12th_pass">12th Pass</option>
                  <option value="graduate">Graduate</option>
                  <option value="post_graduate">Post Graduate</option>
                  <option value="no_formal_education">No Formal Education</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <Label>Secondary Skills (comma separated)</Label>
                <Input value={form.secondary_skills} onChange={(e) => setForm({ ...form, secondary_skills: e.target.value })} />
              </div>
              <div className="md:col-span-2">
                <Label>Location</Label>
                <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required />
              </div>

              <div className="md:col-span-2 flex items-center justify-between mt-2">
                <Button type="submit" className="bg-[#3B5BDB] hover:bg-[#3B5BDB]/90" disabled={saving}>
                  {saving ? "Saving..." : "Save Profile"}
                </Button>
                {message && <p className="text-sm text-[#1F2937]">{message}</p>}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

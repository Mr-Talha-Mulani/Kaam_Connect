"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { employerApi } from "../../lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";

export default function EmployerProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    owner_name: "",
    owner_phone: "",
    owner_email: "",
    name: "",
    business_type: "sole_proprietor",
    industry: "",
    years_in_operation: 0,
    num_employees: 0,
    business_registration_number: "",
    gst_number: "",
    business_address: "",
    city: "",
    pincode: "",
    landmark: "",
    business_phone: "",
    business_email: "",
    website: "",
    business_description: "",
    location: "",
  });

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      try {
        const response = await employerApi.getProfile();
        const p = response.data || {};
        setForm((prev) => ({
          ...prev,
          ...p,
          years_in_operation: Number(p.years_in_operation || 0),
          num_employees: Number(p.num_employees || 0),
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
      await employerApi.upsertProfile(form);
      setMessage("Business profile saved successfully.");
    } catch (err: any) {
      setMessage(err.message || "Failed to save business profile.");
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
          <h1 className="text-3xl font-bold text-[#1F2937]">Employer Business Profile</h1>
          <Button asChild variant="outline" className="border-[#3B5BDB] text-[#3B5BDB]">
            <Link href="/employer/dashboard">Back</Link>
          </Button>
        </div>

        <Card className="border-[#E5E7EB] bg-white">
          <CardHeader>
            <CardTitle>Business Details (Requirement Checklist)</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Owner Name</Label>
                <Input value={form.owner_name} onChange={(e) => setForm({ ...form, owner_name: e.target.value })} required />
              </div>
              <div>
                <Label>Owner Phone</Label>
                <Input value={form.owner_phone} onChange={(e) => setForm({ ...form, owner_phone: e.target.value })} required />
              </div>
              <div>
                <Label>Owner Email</Label>
                <Input type="email" value={form.owner_email} onChange={(e) => setForm({ ...form, owner_email: e.target.value })} />
              </div>
              <div>
                <Label>Business Name</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div>
                <Label>Business Type</Label>
                <select className="w-full border rounded-md h-10 px-3" value={form.business_type} onChange={(e) => setForm({ ...form, business_type: e.target.value })}>
                  <option value="sole_proprietor">Sole Proprietor</option>
                  <option value="partnership">Partnership</option>
                  <option value="company">Company</option>
                  <option value="trust">Trust</option>
                </select>
              </div>
              <div>
                <Label>Industry</Label>
                <Input value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} />
              </div>
              <div>
                <Label>Years in Operation</Label>
                <Input type="number" min={0} value={form.years_in_operation} onChange={(e) => setForm({ ...form, years_in_operation: Number(e.target.value || 0) })} />
              </div>
              <div>
                <Label>Number of Employees</Label>
                <Input type="number" min={0} value={form.num_employees} onChange={(e) => setForm({ ...form, num_employees: Number(e.target.value || 0) })} />
              </div>
              <div>
                <Label>Registration Number</Label>
                <Input value={form.business_registration_number} onChange={(e) => setForm({ ...form, business_registration_number: e.target.value })} />
              </div>
              <div>
                <Label>GST Number</Label>
                <Input value={form.gst_number} onChange={(e) => setForm({ ...form, gst_number: e.target.value })} />
              </div>
              <div className="md:col-span-2">
                <Label>Business Address</Label>
                <Input value={form.business_address} onChange={(e) => setForm({ ...form, business_address: e.target.value })} required />
              </div>
              <div>
                <Label>City</Label>
                <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
              </div>
              <div>
                <Label>Pincode</Label>
                <Input value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} />
              </div>
              <div>
                <Label>Landmark</Label>
                <Input value={form.landmark} onChange={(e) => setForm({ ...form, landmark: e.target.value })} />
              </div>
              <div>
                <Label>Business Phone</Label>
                <Input value={form.business_phone} onChange={(e) => setForm({ ...form, business_phone: e.target.value })} />
              </div>
              <div>
                <Label>Business Email</Label>
                <Input type="email" value={form.business_email} onChange={(e) => setForm({ ...form, business_email: e.target.value })} />
              </div>
              <div>
                <Label>Website</Label>
                <Input value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
              </div>
              <div className="md:col-span-2">
                <Label>Business Description</Label>
                <Input value={form.business_description} onChange={(e) => setForm({ ...form, business_description: e.target.value })} />
              </div>
              <div className="md:col-span-2">
                <Label>Location</Label>
                <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required />
              </div>

              <div className="md:col-span-2 flex items-center justify-between mt-2">
                <Button type="submit" className="bg-[#3B5BDB] hover:bg-[#3B5BDB]/90" disabled={saving}>
                  {saving ? "Saving..." : "Save Business Profile"}
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

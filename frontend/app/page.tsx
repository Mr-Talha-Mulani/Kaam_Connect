"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  MapPin,
  Truck,
  ShoppingCart,
  Package,
  Sparkles,
  Shield,
  HardHat,
  Utensils,
  UserPlus,
  Briefcase,
  Rocket,
} from "lucide-react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Card, CardContent } from "./components/ui/card";

const heroImages = [
  "https://images.unsplash.com/photo-1762851452423-34e7cf452780?w=1080",
  "https://images.unsplash.com/photo-1631171992385-784ae02b1acb?w=1080",
  "https://images.unsplash.com/photo-1753161027547-975af3d6e707?w=1080",
];

const jobCategories = [
  { icon: Truck, name: "Delivery Jobs", color: "#2EC4B6", bg: "#E6F8F6" },
  { icon: ShoppingCart, name: "Retail Assistant", color: "#3B5BDB", bg: "#EAF1FF" },
  { icon: Package, name: "Warehouse Helper", color: "#2EC4B6", bg: "#E6F8F6" },
  { icon: Sparkles, name: "Cleaner", color: "#3B5BDB", bg: "#EAF1FF" },
  { icon: Truck, name: "Driver", color: "#1E3A8A", bg: "#DBE3F5" },
  { icon: Utensils, name: "Restaurant Staff", color: "#2EC4B6", bg: "#E6F8F6" },
  { icon: Shield, name: "Security Guard", color: "#3B5BDB", bg: "#D0DDFF" },
  { icon: HardHat, name: "Construction Worker", color: "#2EC4B6", bg: "#CEF1EC" },
];

const howItWorks = [
  {
    step: 1,
    icon: UserPlus,
    title: "Create Profile",
    description: "Workers or employers register and verify their details.",
    bg: "#EAF1FF",
  },
  {
    step: 2,
    icon: Briefcase,
    title: "Search or Post Jobs",
    description: "Workers browse jobs and employers post opportunities.",
    bg: "#E6F8F6",
  },
  {
    step: 3,
    icon: Rocket,
    title: "Connect and Start Work",
    description: "Employers review profiles and contact workers.",
    bg: "#EAF1FF",
  },
];

const testimonials = [
  {
    type: "worker",
    name: "Ravi Kumar",
    role: "Delivery Driver",
    text: "KaamConnect helped me find a stable job within 2 days. The platform is easy to use and I get regular work now.",
    rating: 5,
  },
  {
    type: "employer",
    name: "Priya Sharma",
    role: "Restaurant Owner",
    text: "Finding reliable staff was always a challenge. With KaamConnect, I hired 3 employees in less than a week!",
    rating: 5,
  },
];

export default function Home() {
  const [searchJob, setSearchJob] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Hero Section with Carousel */}
      <section className="relative bg-gradient-to-br from-[#3B5BDB] to-[#2EC4B6] text-white py-20 md:py-32 overflow-hidden">
        {/* Background Images Carousel */}
        {heroImages.map((img, index) => (
          <div
            key={index}
            className="absolute inset-0 transition-opacity duration-1000"
            style={{
              opacity: currentImageIndex === index ? 0.15 : 0,
              backgroundImage: `url(${img})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        ))}

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Find Work Faster. Hire Workers Easily.
            </h1>
            <p className="text-lg md:text-xl mb-10 text-white/90">
              KaamConnect connects skilled workers with businesses looking for reliable help.
            </p>

            {/* Search Bar */}
            <Card className="bg-white shadow-xl border-0">
              <CardContent className="p-4 md:p-6 pb-4 md:pb-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#6B7280]" />
                    <Input
                      placeholder="Search jobs or skills"
                      value={searchJob}
                      onChange={(e) => setSearchJob(e.target.value)}
                      className="pl-10 h-12 border-[#E5E7EB] text-[#1F2937]"
                    />
                  </div>
                  <div className="flex-1 relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#6B7280]" />
                    <Input
                      placeholder="Location"
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                      className="pl-10 h-12 border-[#E5E7EB] text-[#1F2937]"
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button asChild className="w-full bg-[#3B5BDB] hover:bg-[#3B5BDB]/90 h-12 px-8">
                      <Link href={`/job-seeker/jobs?q=${encodeURIComponent(searchJob)}&loc=${encodeURIComponent(searchLocation)}`} className="flex-1 md:flex-initial">
                        Find Jobs
                      </Link>
                    </Button>
                    <Button asChild className="w-full bg-gradient-to-r from-[#3B5BDB] to-[#2EC4B6] hover:opacity-90 h-12 px-8 border-0 text-white">
                      <Link href="/employer/post" className="flex-1 md:flex-initial text-white">
                        Post a Job
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Job Categories Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-[#1F2937]">
            Browse Job Categories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {jobCategories.map((category, index) => (
              <Link key={index} href={`/job-seeker/jobs?category=${encodeURIComponent(category.name)}`}>
                <Card
                  className="cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 border-[#E5E7EB] h-full"
                  style={{ backgroundColor: category.bg }}
                >
                  <CardContent className="p-6 text-center flex flex-col justify-center items-center h-full">
                    <div
                      className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                      style={{ backgroundColor: `${category.color}20` }}
                    >
                      <category.icon className="h-8 w-8" style={{ color: category.color }} />
                    </div>
                    <h3 className="font-bold text-[#1F2937] text-lg">{category.name}</h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-[#1F2937]">
            How KaamConnect Works
          </h2>
          <p className="text-center text-[#6B7280] mb-12 max-w-2xl mx-auto">
            Getting started is simple. Follow these three easy steps to find work or hire workers.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {howItWorks.map((item) => (
              <Card
                key={item.step}
                className="relative border-[#E5E7EB]"
                style={{ backgroundColor: item.bg }}
              >
                <CardContent className="p-8 text-center pt-8">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#3B5BDB] to-[#2EC4B6] mx-auto mb-6 flex items-center justify-center">
                    <item.icon className="h-10 w-10 text-white" />
                  </div>
                  <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-gradient-to-r from-[#3B5BDB] to-[#2EC4B6] flex items-center justify-center text-white font-bold">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-[#1F2937]">{item.title}</h3>
                  <p className="text-[#6B7280]">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Hiring Feature */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <Card className="bg-gradient-to-r from-[#3B5BDB] to-[#2EC4B6] border-0">
            <CardContent className="p-8 md:p-12 text-center text-white pb-8 md:pb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Need a Worker Today?
              </h2>
              <p className="text-lg mb-8 text-white/90 max-w-2xl mx-auto">
                Employers can post urgent same-day jobs.
              </p>
              <Button asChild className="bg-white text-[#3B5BDB] hover:bg-white/90 h-12 px-8 text-lg font-semibold border-0">
                <Link href="/employer/post">
                  Post Urgent Job
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-[#1F2937]">
            What People Say About Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-[#E5E7EB]">
                <CardContent className="p-8 pb-8">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-[#F59E0B] text-xl">★</span>
                    ))}
                  </div>
                  <p className="text-[#1F2937] mb-6 italic">"{testimonial.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#3B5BDB] to-[#2EC4B6] flex items-center justify-center text-white font-bold">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#1F2937]">{testimonial.name}</h4>
                      <p className="text-sm text-[#6B7280]">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-[#3B5BDB] to-[#2EC4B6]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Ready to Get Started?
          </h2>
          <p className="text-lg mb-10 text-white/90 max-w-2xl mx-auto">
            Join thousands of workers and employers already using KaamConnect
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-white text-[#3B5BDB] hover:bg-white/90 h-12 px-8 text-lg border-0">
              <Link href="/auth/register">
                Join as Worker
              </Link>
            </Button>
            <Button asChild className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 h-12 px-8 text-lg border-0 text-white">
              <Link href="/employer/dashboard">
                Hire Workers
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

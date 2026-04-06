"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Checkbox } from "./ui/checkbox";
import { Upload } from "lucide-react";

interface AuthTabsProps {
  defaultTab?: "login" | "signup";
}

export function AuthTabs({ defaultTab = "login" }: AuthTabsProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>(defaultTab);
  const [accountType, setAccountType] = useState("seeker");
  const [agreed, setAgreed] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login - redirect to appropriate dashboard
    if (accountType === "seeker") {
      router.push("/job-seeker/dashboard");
    } else {
      router.push("/employer/dashboard");
    }
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock signup - redirect to appropriate dashboard
    if (accountType === "seeker") {
      router.push("/job-seeker/dashboard");
    } else {
      router.push("/employer/dashboard");
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-[#E5E7EB]">
            <TabsTrigger value="login" className="data-[state=active]:bg-white">Login</TabsTrigger>
            <TabsTrigger value="signup" className="data-[state=active]:bg-white">Create Account</TabsTrigger>
          </TabsList>

          {/* Login Form */}
          <TabsContent value="login">
            <Card className="border-[#E5E7EB] bg-white">
              <CardHeader>
                <CardTitle className="text-2xl text-center text-[#1F2937]">
                  Welcome Back
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Phone / Email</Label>
                    <Input
                      id="login-email"
                      type="text"
                      placeholder="Enter your phone or email"
                      className="border-[#E5E7EB]"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="Enter your password"
                      className="border-[#E5E7EB]"
                      required
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="remember" />
                      <label
                        htmlFor="remember"
                        className="text-sm text-[#6B7280] cursor-pointer"
                      >
                        Remember me
                      </label>
                    </div>
                    <a href="#forgot" className="text-sm text-[#3B5BDB] hover:underline">
                      Forgot password?
                    </a>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-[#3B5BDB] hover:bg-[#3B5BDB]/90 h-12"
                  >
                    Login
                  </Button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-[#E5E7EB]" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-[#6B7280]">Or</span>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-[#E5E7EB] h-12"
                  >
                    Login with OTP
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Signup Form */}
          <TabsContent value="signup">
            <Card className="border-[#E5E7EB] bg-white">
              <CardHeader>
                <CardTitle className="text-2xl text-center text-[#1F2937]">
                  Create Your Account
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignup} className="space-y-6">
                  {/* Account Type Selection */}
                  <div className="space-y-3">
                    <Label>I am a</Label>
                    <RadioGroup value={accountType} onValueChange={setAccountType}>
                      <div className="flex items-center space-x-2 border border-[#E5E7EB] rounded-lg p-4 cursor-pointer hover:bg-[#F7F9FC]">
                        <RadioGroupItem value="seeker" id="seeker" />
                        <Label htmlFor="seeker" className="flex-1 cursor-pointer">
                          <div>
                            <p className="font-medium text-[#1F2937]">Job Seeker</p>
                            <p className="text-sm text-[#6B7280]">Looking for work</p>
                          </div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 border border-[#E5E7EB] rounded-lg p-4 cursor-pointer hover:bg-[#F7F9FC]">
                        <RadioGroupItem value="employer" id="employer" />
                        <Label htmlFor="employer" className="flex-1 cursor-pointer">
                          <div>
                            <p className="font-medium text-[#1F2937]">Employer</p>
                            <p className="text-sm text-[#6B7280]">Looking to hire</p>
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fullname">Full Name</Label>
                    <Input
                      id="fullname"
                      type="text"
                      placeholder="Enter your full name"
                      className="border-[#E5E7EB]"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact">Phone Number or Email</Label>
                    <Input
                      id="contact"
                      type="text"
                      placeholder="Enter your phone or email"
                      className="border-[#E5E7EB]"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Create a password"
                      className="border-[#E5E7EB]"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      type="text"
                      placeholder="Enter your city"
                      className="border-[#E5E7EB]"
                      required
                    />
                  </div>

                  {/* Video Upload Section - Only for Job Seekers */}
                  {accountType === "seeker" && (
                    <div className="space-y-2">
                      <Label>Introduction Video (Optional)</Label>
                      <div className="border-2 border-dashed border-[#E5E7EB] rounded-lg p-8 text-center hover:bg-[#F7F9FC] cursor-pointer transition-colors mt-2">
                        <Upload className="h-12 w-12 mx-auto mb-3 text-[#6B7280]" />
                        <p className="text-sm text-[#1F2937] mb-1">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-[#6B7280]">
                          Uploading a short introduction video helps employers verify authenticity
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Declaration */}
                  <div className="flex items-start space-x-2 pt-2">
                    <Checkbox
                      id="declaration"
                      checked={agreed}
                      onCheckedChange={(checked) => setAgreed(checked as boolean)}
                      className="mt-1"
                    />
                    <label
                      htmlFor="declaration"
                      className="text-sm text-[#6B7280] cursor-pointer leading-relaxed"
                    >
                      I confirm that I am above 18 years old and that the information provided is
                      true and accurate.
                    </label>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#3B5BDB] to-[#2EC4B6] hover:opacity-90 h-12 text-white border-0"
                    disabled={!agreed}
                  >
                    Create Account
                  </Button>

                  <p className="text-center text-sm text-[#6B7280]">
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setActiveTab("login")}
                      className="text-[#3B5BDB] hover:underline"
                    >
                      Login here
                    </button>
                  </p>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

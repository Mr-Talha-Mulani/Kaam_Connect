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
import { authApi } from "../lib/api";

interface AuthTabsProps {
  defaultTab?: "login" | "signup";
}

export function AuthTabs({ defaultTab = "login" }: AuthTabsProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>(defaultTab);
  const [accountType, setAccountType] = useState("seeker");
  const [agreed, setAgreed] = useState(false);
  // Signup State
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPhone, setSignupPhone] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupLocation, setSignupLocation] = useState("");
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupError, setSignupError] = useState("");

  // Login State
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    try {
      const response = await authApi.login(loginEmail, loginPassword);
      if (response.data && response.data.token) {
         localStorage.setItem("kc_token", response.data.token);
        localStorage.setItem("kc_user", JSON.stringify(response.data.user || {}));
         const role = response.data.user?.role;
         if (role === "employer") {
            router.push("/employer/dashboard");
         } else {
            router.push("/job-seeker/dashboard");
         }
      } else {
        localStorage.removeItem("kc_token");
         setErrorMsg("Invalid credentials");
      }
    } catch (err: any) {
      localStorage.removeItem("kc_token");
      setErrorMsg(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupLoading(true);
    setSignupError("");
    try {
      const response = await authApi.register({
        name: signupName,
        email: signupEmail,
        password: signupPassword,
        location: signupLocation,
        role: accountType === "seeker" ? "job_seeker" : "employer",
        phone: signupPhone,
      });
      if (response.data && response.data.token) {
        localStorage.setItem("kc_token", response.data.token);
        localStorage.setItem("kc_user", JSON.stringify(response.data.user || {}));
        if (accountType === "seeker") {
          router.push("/job-seeker/dashboard");
        } else {
          router.push("/employer/dashboard");
        }
      }
    } catch (err: any) {
      setSignupError(err.message || "Signup failed");
    } finally {
      setSignupLoading(false);
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
                {errorMsg && <p className="text-red-500 text-center text-sm">{errorMsg}</p>}
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="text"
                      placeholder="Enter your email"
                      className="border-[#E5E7EB]"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
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
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
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
                    disabled={loading}
                  >
                    {loading ? "Logging in..." : "Login"}
                  </Button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-[#E5E7EB]" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-[#6B7280]">Or</span>
                    </div>
                  </div>

                  <p className="text-xs text-[#6B7280] text-center">
                    Use your own registered email and password to access your account.
                  </p>
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
                {signupError && <p className="text-red-500 text-center text-sm">{signupError}</p>}
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
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact">Email</Label>
                    <Input
                      id="contact"
                      type="email"
                      placeholder="Enter your email"
                      className="border-[#E5E7EB]"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      className="border-[#E5E7EB]"
                      value={signupPhone}
                      onChange={(e) => setSignupPhone(e.target.value)}
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
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
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
                      value={signupLocation}
                      onChange={(e) => setSignupLocation(e.target.value)}
                      required
                    />
                  </div>

                  {/* Video Upload Section - Only for Job Seekers */}
                  {accountType === "seeker" && (
                    <div className="space-y-2">
                      <Label>Introduction Video (Optional)</Label>
                      <div className="border-2 border-dashed border-[#E5E7EB] rounded-lg p-6 text-center hover:bg-[#F7F9FC] transition-colors mt-2">
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => document.getElementById('video-upload')?.click()}
                            className="flex flex-col items-center p-6 h-auto w-full sm:w-1/2"
                          >
                            <Upload className="h-6 w-6 mb-2 text-[#6B7280]" />
                            <span className="text-sm">Upload from Device</span>
                          </Button>
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => alert("Camera access will be implemented here")}
                            className="flex flex-col items-center p-6 h-auto w-full sm:w-1/2"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 mb-2 text-[#6B7280]"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
                            <span className="text-sm">Turn on Camera</span>
                          </Button>
                        </div>
                        <input type="file" id="video-upload" accept="video/*" className="hidden" />
                        <p className="text-xs text-[#6B7280] mt-4">
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
                    className="w-full bg-linear-to-r from-[#3B5BDB] to-[#2EC4B6] hover:opacity-90 h-12 text-white border-0"
                    disabled={!agreed || signupLoading}
                  >
                    {signupLoading ? "Creating..." : "Create Account"}
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

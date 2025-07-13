import React, { useState } from "react";
import { fetchApi, API_ENDPOINTS } from "@/lib/api";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GradientButton } from "@/components/ui/gradient-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileUpload, UploadedFile } from "@/components/upload/FileUpload";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ArrowLeft,
  Users,
  ArrowRight,
  Upload,
  Plus,
  X,
  CheckCircle,
  Languages,
  Award,
} from "lucide-react";

interface FormData {
  // Basic Info
  name: string;
  email: string;
  password: string;
  role: string;

  // Professional Info (for freelancers)
  title: string;
  bio: string;
  skills: string[];
  languages: Array<{ name: string; level: string }>;
  experience: string;
  hourlyRate: string;

  // Documents
  certificates: File[];
  profilePicture: File | null;
}

const STEPS = {
  BASIC: 1,
  PROFESSIONAL: 2,
  DOCUMENTS: 3,
  REVIEW: 4,
};

const STEP_TITLES = {
  [STEPS.BASIC]: "Basic Information",
  [STEPS.PROFESSIONAL]: "Professional Details",
  [STEPS.DOCUMENTS]: "Documents & Certificates",
  [STEPS.REVIEW]: "Review & Complete",
};

const LANGUAGE_OPTIONS = [
  "English",
  "Hindi",
  "Bengali",
  "Telugu",
  "Marathi",
  "Tamil",
  "Gujarati",
  "Urdu",
  "Kannada",
  "Odia",
  "Malayalam",
  "Punjabi",
  "Assamese",
  "Maithili",
  "Spanish",
  "French",
  "German",
  "Chinese",
  "Japanese",
  "Arabic",
  "Russian",
];

const PROFICIENCY_LEVELS = ["Basic", "Conversational", "Fluent", "Native"];

export default function Register() {
  const [currentStep, setCurrentStep] = useState(STEPS.BASIC);
  const [showPassword, setShowPassword] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [newLanguage, setNewLanguage] = useState({ name: "", level: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    role: "",
    title: "",
    bio: "",
    skills: [],
    languages: [],
    experience: "",
    hourlyRate: "",
    certificates: [],
    profilePicture: null,
  });

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const addLanguage = () => {
    if (newLanguage.name && newLanguage.level) {
      const exists = formData.languages.some(
        (lang) => lang.name === newLanguage.name,
      );
      if (!exists) {
        setFormData((prev) => ({
          ...prev,
          languages: [...prev.languages, newLanguage],
        }));
        setNewLanguage({ name: "", level: "" });
      }
    }
  };

  const removeLanguage = (languageToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      languages: prev.languages.filter(
        (lang) => lang.name !== languageToRemove,
      ),
    }));
  };

  const handleCertificateUpload = (uploadedFiles: UploadedFile[]) => {
    const files = uploadedFiles.map((uf) => uf.file);
    setFormData((prev) => ({
      ...prev,
      certificates: [...prev.certificates, ...files],
    }));
  };

  const removeCertificate = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      certificates: prev.certificates.filter((_, i) => i !== index),
    }));
  };

  const nextStep = () => {
    if (currentStep < STEPS.REVIEW) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > STEPS.BASIC) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case STEPS.BASIC:
        return (
          formData.name && formData.email && formData.password && formData.role
        );
      case STEPS.PROFESSIONAL:
        if (formData.role === "client") return true;
        return (
          formData.title &&
          formData.bio &&
          formData.skills.length > 0 &&
          formData.languages.length > 0
        );
      case STEPS.DOCUMENTS:
        return true; // Documents are optional
      case STEPS.REVIEW:
        return true;
      default:
        return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      // Prepare certificates and profilePicture for upload (for now, just send names)
      const certificates = formData.certificates.map((file) => ({
        name: file.name,
        size: file.size,
        url: "", // You can implement file upload later
      }));
      const profilePicture = formData.profilePicture ? formData.profilePicture.name : "";
      const response: any = await fetchApi(API_ENDPOINTS.REGISTER, {
        method: "POST",
        body: JSON.stringify({
          ...formData,
          certificates,
          profilePicture,
        }),
      });
      
      if (response.success) {
        if (response.user && response.user._id) {
          localStorage.setItem('userId', response.user._id);
        }
        // Redirect based on role
        if (response.user.role === "freelancer") {
          navigate("/freelancer/dashboard");
        } else if (response.user.role === "client") {
          navigate("/client/dashboard");
        } else if (response.user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      } else {
        setError(response.message || "Registration failed");
      }
    } catch (err) {
      setError("An error occurred during registration. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getProgressPercentage = () => {
    return (currentStep / STEPS.REVIEW) * 100;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      {/* Background elements */}
      <div className="absolute inset-0 bg-brand-gradient opacity-5 animate-gradient-x"></div>
      <div className="absolute top-20 left-10 w-16 h-16 bg-purple-200 dark:bg-purple-800 rounded-full opacity-20 animate-float"></div>
      <div
        className="absolute top-40 right-20 w-24 h-24 bg-blue-200 dark:bg-blue-800 rounded-full opacity-20 animate-float"
        style={{ animationDelay: "2s" }}
      ></div>

      <div className="w-full max-w-2xl relative z-10">
        {/* Back to home */}
        <Link
          to="/"
          className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to FreelanceHub
        </Link>

        <Card className="border-0 shadow-2xl bg-card/50 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-4">
              <div className="h-12 w-12 rounded-2xl bg-brand-gradient flex items-center justify-center">
                <span className="text-white font-bold text-xl">F</span>
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">
              Join FreelanceHub
            </CardTitle>
            <p className="text-muted-foreground">
              {STEP_TITLES[currentStep]} - Step {currentStep} of {STEPS.REVIEW}
            </p>

            {/* Progress Bar */}
            <div className="mt-4">
              <Progress value={getProgressPercentage()} className="h-2" />
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {error && (
              <div
                className="flex items-center justify-center rounded-lg px-4 py-3 mb-2 bg-blue-700 text-white dark:bg-blue-900 dark:text-white border-none text-center font-semibold shadow-md animate-pulse gap-2"
                aria-live="assertive"
              >
                <svg className="h-5 w-5 text-blue-200 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 8v4m0 4h.01" /></svg>
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Step 1: Basic Information */}
              {currentStep === STEPS.BASIC && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={(e) =>
                          handleInputChange("password", e.target.value)
                        }
                        className="pl-10 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">I want to</Label>
                    <Select
                      value={formData.role}
                      onValueChange={(value) =>
                        handleInputChange("role", value)
                      }
                    >
                      <SelectTrigger>
                        <div className="flex items-center">
                          <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                          <SelectValue placeholder="Choose your role" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="freelancer">
                          <div className="flex items-center">
                            <User className="mr-2 h-4 w-4" />
                            <div>
                              <div className="font-medium">
                                Work as a Freelancer
                              </div>
                              <div className="text-sm text-muted-foreground">
                                I want to offer my services
                              </div>
                            </div>
                          </div>
                        </SelectItem>
                        <SelectItem value="client">
                          <div className="flex items-center">
                            <Users className="mr-2 h-4 w-4" />
                            <div>
                              <div className="font-medium">
                                Hire Freelancers
                              </div>
                              <div className="text-sm text-muted-foreground">
                                I want to hire talent
                              </div>
                            </div>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* Step 2: Professional Information (Freelancers only) */}
              {currentStep === STEPS.PROFESSIONAL && (
                <div className="space-y-4">
                  {formData.role === "freelancer" ? (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="title">Professional Title</Label>
                        <Input
                          id="title"
                          placeholder="e.g., Full Stack Developer, Graphic Designer"
                          value={formData.title}
                          onChange={(e) =>
                            handleInputChange("title", e.target.value)
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bio">Professional Bio</Label>
                        <Textarea
                          id="bio"
                          placeholder="Tell clients about your experience and expertise..."
                          value={formData.bio}
                          onChange={(e) =>
                            handleInputChange("bio", e.target.value)
                          }
                          rows={4}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Skills</Label>
                        <div className="flex space-x-2">
                          <Input
                            placeholder="Add a skill..."
                            value={newSkill}
                            onChange={(e) => setNewSkill(e.target.value)}
                            onKeyPress={(e) =>
                              e.key === "Enter" &&
                              (e.preventDefault(), addSkill())
                            }
                          />
                          <Button
                            type="button"
                            onClick={addSkill}
                            variant="outline"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {formData.skills.map((skill) => (
                            <Badge
                              key={skill}
                              variant="secondary"
                              className="flex items-center gap-1"
                            >
                              {skill}
                              <X
                                className="h-3 w-3 cursor-pointer"
                                onClick={() => removeSkill(skill)}
                              />
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="flex items-center">
                          <Languages className="w-4 h-4 mr-2" />
                          Languages
                        </Label>
                        <div className="grid grid-cols-2 gap-2">
                          <Select
                            value={newLanguage.name}
                            onValueChange={(value) =>
                              setNewLanguage((prev) => ({
                                ...prev,
                                name: value,
                              }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select language" />
                            </SelectTrigger>
                            <SelectContent>
                              {LANGUAGE_OPTIONS.map((lang) => (
                                <SelectItem key={lang} value={lang}>
                                  {lang}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Select
                            value={newLanguage.level}
                            onValueChange={(value) =>
                              setNewLanguage((prev) => ({
                                ...prev,
                                level: value,
                              }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Proficiency" />
                            </SelectTrigger>
                            <SelectContent>
                              {PROFICIENCY_LEVELS.map((level) => (
                                <SelectItem key={level} value={level}>
                                  {level}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <Button
                          type="button"
                          onClick={addLanguage}
                          variant="outline"
                          className="w-full"
                          disabled={!newLanguage.name || !newLanguage.level}
                        >
                          Add Language
                        </Button>
                        <div className="space-y-2">
                          {formData.languages.map((lang) => (
                            <div
                              key={lang.name}
                              className="flex items-center justify-between p-2 border rounded"
                            >
                              <span>
                                {lang.name} - {lang.level}
                              </span>
                              <X
                                className="h-4 w-4 cursor-pointer text-muted-foreground hover:text-destructive"
                                onClick={() => removeLanguage(lang.name)}
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="experience">Experience Level</Label>
                          <Select
                            value={formData.experience}
                            onValueChange={(value) =>
                              handleInputChange("experience", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select experience" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="entry">
                                Entry Level (0-1 year)
                              </SelectItem>
                              <SelectItem value="intermediate">
                                Intermediate (1-3 years)
                              </SelectItem>
                              <SelectItem value="expert">
                                Expert (3+ years)
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="hourlyRate">Hourly Rate (₹)</Label>
                          <Input
                            id="hourlyRate"
                            type="number"
                            placeholder="500"
                            value={formData.hourlyRate}
                            onChange={(e) =>
                              handleInputChange("hourlyRate", e.target.value)
                            }
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">
                        Almost Ready!
                      </h3>
                      <p className="text-muted-foreground">
                        As a client, you can proceed to the next step.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Documents */}
              {currentStep === STEPS.DOCUMENTS && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="flex items-center mb-3">
                        <Award className="w-4 h-4 mr-2" />
                        Certificates & Qualifications (Optional)
                      </Label>
                      <FileUpload
                        onFilesChange={handleCertificateUpload}
                        maxFiles={5}
                        acceptedTypes={[".pdf", ".jpg", ".jpeg", ".png"]}
                      />
                    </div>

                    {formData.certificates.length > 0 && (
                      <div className="space-y-2">
                        <Label>Uploaded Certificates</Label>
                        {formData.certificates.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 border rounded-lg"
                          >
                            <div className="flex items-center space-x-2">
                              <Upload className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{file.name}</span>
                              <Badge variant="outline" className="text-xs">
                                {(file.size / 1024 / 1024).toFixed(1)} MB
                              </Badge>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeCertificate(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 4: Review */}
              {currentStep === STEPS.REVIEW && (
                <div className="space-y-6">
                  <div className="text-center">
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">
                      Review Your Information
                    </h3>
                    <p className="text-muted-foreground">
                      Please review your details before completing registration
                    </p>
                  </div>

                  <div className="space-y-4 border rounded-lg p-4">
                    <div>
                      <h4 className="font-semibold">Basic Information</h4>
                      <p className="text-sm text-muted-foreground">
                        {formData.name} • {formData.email} • {formData.role}
                      </p>
                    </div>

                    {formData.role === "freelancer" && (
                      <>
                        <Separator />
                        <div>
                          <h4 className="font-semibold">
                            Professional Details
                          </h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            {formData.title}
                          </p>
                          <div className="flex flex-wrap gap-1 mb-2">
                            {formData.skills.slice(0, 3).map((skill) => (
                              <Badge
                                key={skill}
                                variant="outline"
                                className="text-xs"
                              >
                                {skill}
                              </Badge>
                            ))}
                            {formData.skills.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{formData.skills.length - 3} more
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Languages:{" "}
                            {formData.languages.map((l) => l.name).join(", ")}
                          </p>
                          {formData.hourlyRate && (
                            <p className="text-xs text-muted-foreground">
                              Rate: ₹{formData.hourlyRate}/hour
                            </p>
                          )}
                        </div>
                      </>
                    )}

                    {formData.certificates.length > 0 && (
                      <>
                        <Separator />
                        <div>
                          <h4 className="font-semibold">Documents</h4>
                          <p className="text-sm text-muted-foreground">
                            {formData.certificates.length} certificate(s)
                            uploaded
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === STEPS.BASIC}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>

                {currentStep < STEPS.REVIEW ? (
                  <GradientButton
                    type="button"
                    onClick={nextStep}
                    disabled={!canProceed()}
                  >
                    Continue
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </GradientButton>
                ) : (
                  <GradientButton type="submit">
                    Complete Registration
                    <CheckCircle className="h-4 w-4 ml-2" />
                  </GradientButton>
                )}
              </div>
            </form>

            {/* Social Registration */}
            {currentStep === STEPS.BASIC && (
              <>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline">
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    Google
                  </Button>
                  <Button variant="outline">
                    <svg
                      className="mr-2 h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                    </svg>
                    Twitter
                  </Button>
                </div>
              </>
            )}

            {/* Login Link */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-medium text-primary hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

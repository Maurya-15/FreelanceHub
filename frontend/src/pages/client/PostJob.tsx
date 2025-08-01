import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_ENDPOINTS, getApiUrl } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";
import { GradientButton } from "@/components/ui/gradient-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  ArrowLeft,
  Upload,
  X,
  Plus,
  Eye,
  Save,
  Calendar as CalendarIcon,
  Clock,
  Users,
  FileText,
  Briefcase,
} from "lucide-react";
import { format } from "date-fns";

const categories = [
  "Design & Creative",
  "Development & IT",
  "Writing & Translation",
  "Video & Animation",
  "Digital Marketing",
  "Data & Analytics",
  "Music & Audio",
  "Photography",
  "Business",
  "Lifestyle",
];

const experienceLevels = [
  {
    value: "entry",
    label: "Entry Level",
    description: "Looking for someone relatively new to this field",
  },
  {
    value: "intermediate",
    label: "Intermediate",
    description: "Looking for substantial experience in this field",
  },
  {
    value: "expert",
    label: "Expert",
    description: "Looking for comprehensive and deep expertise in this field",
  },
];

const projectLengths = [
  { value: "less-than-1-month", label: "Less than 1 month" },
  { value: "1-3-months", label: "1 to 3 months" },
  { value: "3-6-months", label: "3 to 6 months" },
  { value: "more-than-6-months", label: "More than 6 months" },
];

const budgetTypes = [
  {
    value: "fixed",
    label: "Fixed Price",
    description: "Pay a fixed amount for the entire project",
  },
  {
    value: "hourly",
    label: "Hourly Rate",
    description: "Pay an hourly rate for ongoing work",
  },
];

const LOCAL_STORAGE_KEY = "postJobFormData";

export default function PostJob() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [jobData, setJobData] = useState(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    return saved ? JSON.parse(saved) : {
      title: "",
      category: "",
      subcategory: "",
      description: "",
      requirements: "",
      skills: [],
      experienceLevel: "",
      projectLength: "",
      budgetType: "fixed",
      fixedBudget: {
        min: "",
        max: "",
      },
      hourlyBudget: {
        min: "",
        max: "",
      },
      deadline: null,
      isUrgent: false,
      attachments: [],
      additionalQuestions: [],
    };
  });

  const [currentSkill, setCurrentSkill] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState("");

  // Save jobData to localStorage on every change
  React.useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(jobData));
  }, [jobData]);

  const handleInputChange = (field: string, value: any) => {
    setJobData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNestedInputChange = (
    parent: string,
    field: string,
    value: any,
  ) => {
    setJobData((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value,
      },
    }));
  };

  const addSkill = () => {
    if (currentSkill.trim() && jobData.skills.length < 10) {
      setJobData((prev) => ({
        ...prev,
        skills: [...prev.skills, currentSkill.trim()],
      }));
      setCurrentSkill("");
    }
  };

  const removeSkill = (index: number) => {
    setJobData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
  };

  const addQuestion = () => {
    if (currentQuestion.trim()) {
      setJobData((prev) => ({
        ...prev,
        additionalQuestions: [
          ...prev.additionalQuestions,
          currentQuestion.trim(),
        ],
      }));
      setCurrentQuestion("");
    }
  };

  const removeQuestion = (index: number) => {
    setJobData((prev) => ({
      ...prev,
      additionalQuestions: prev.additionalQuestions.filter(
        (_, i) => i !== index,
      ),
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setJobData((prev) => ({
      ...prev,
      attachments: [...prev.attachments, ...files],
    }));
  };

  const removeAttachment = (index: number) => {
    setJobData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }));
  };

  const { toast } = useToast();

  const handleSubmit = async () => {
  // ... your submit logic ...
  // After successful post:
  localStorage.removeItem(LOCAL_STORAGE_KEY);

    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', jobData.title);
      formData.append('category', jobData.category);
      formData.append('subcategory', jobData.subcategory);
      formData.append('description', jobData.description);
      formData.append('requirements', jobData.requirements);
      formData.append('skills', JSON.stringify(jobData.skills));
      formData.append('experience', jobData.experienceLevel);
      formData.append('duration', jobData.projectLength);
      formData.append('budgetType', jobData.budgetType);
      formData.append('budget', JSON.stringify({
        min: Number(jobData.budgetType === 'fixed' ? jobData.fixedBudget.min : jobData.hourlyBudget.min),
        max: Number(jobData.budgetType === 'fixed' ? jobData.fixedBudget.max : jobData.hourlyBudget.max)
      }));
      formData.append('deadline', jobData.deadline ? jobData.deadline.toISOString() : '');
      formData.append('isUrgent', jobData.isUrgent ? 'true' : 'false');
      formData.append('additionalQuestions', JSON.stringify(jobData.additionalQuestions));
      formData.append('status', 'active');
      jobData.attachments.forEach(file => formData.append('attachments', file));

      const response = await fetch(getApiUrl(API_ENDPOINTS.JOBS), {
        method: 'POST',
        headers: {
          'user-id': localStorage.getItem('userId') || 'mock-user-id'
          // Do NOT set 'Content-Type' header; browser will set it for FormData
        },
        body: formData
      });

      if (!response.ok) throw new Error('Failed to post job');
      const result = await response.json();
      toast({
        title: "Success!",
        description: "Your job has been posted successfully.",
        variant: "default",
      });
      navigate('/client/dashboard');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post job. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = () => {
    return (
      jobData.title &&
      jobData.category &&
      jobData.description &&
      jobData.experienceLevel &&
      jobData.projectLength &&
      ((jobData.budgetType === "fixed" &&
        jobData.fixedBudget.min &&
        jobData.fixedBudget.max) ||
        (jobData.budgetType === "hourly" &&
          jobData.hourlyBudget.min &&
          jobData.hourlyBudget.max))
    );
  };

  return (
    <div className="min-h-screen">
      <Toaster />
      <main className="p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4 sm:gap-0">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Button variant="ghost" asChild size="sm" className="text-xs sm:text-sm">
              <Link to="/client/dashboard">
                <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Post a Job</h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Tell us about your project and find the perfect freelancer
              </p>
            </div>
          </div>
          <div className="flex gap-2 sm:gap-3">
            <Button variant="outline" size="sm" className="text-xs sm:text-sm">
              <Save className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Save Draft
            </Button>
            <Button variant="outline" size="sm" className="text-xs sm:text-sm">
              <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Preview
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Basic Information */}
            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="flex items-center text-base sm:text-lg">
                  <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Job Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-xs sm:text-sm">Job Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g. Build a responsive website"
                    value={jobData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    className="text-sm sm:text-base lg:text-lg"
                  />
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {jobData.title.length}/100 characters
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-xs sm:text-sm">Category</Label>
                    <Select
                      value={jobData.category}
                      onValueChange={(value) =>
                        handleInputChange("category", value)
                      }
                    >
                      <SelectTrigger className="text-xs sm:text-sm">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subcategory" className="text-xs sm:text-sm">Subcategory (Optional)</Label>
                    <Input
                      id="subcategory"
                      placeholder="e.g. Logo Design"
                      value={jobData.subcategory}
                      onChange={(e) =>
                        handleInputChange("subcategory", e.target.value)
                      }
                      className="text-xs sm:text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-xs sm:text-sm">Project Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your project in detail. What are you looking to accomplish?"
                    value={jobData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    className="min-h-[120px] sm:min-h-[150px] text-xs sm:text-sm"
                  />
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {jobData.description.length}/3000 characters
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requirements" className="text-xs sm:text-sm">
                    Requirements & Deliverables
                  </Label>
                  <Textarea
                    id="requirements"
                    placeholder="List specific requirements, deliverables, and any technical specifications..."
                    value={jobData.requirements}
                    onChange={(e) =>
                      handleInputChange("requirements", e.target.value)
                    }
                    className="min-h-[80px] sm:min-h-[100px] text-xs sm:text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs sm:text-sm">Required Skills</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a skill..."
                      value={currentSkill}
                      onChange={(e) => setCurrentSkill(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && addSkill()}
                      className="text-xs sm:text-sm"
                    />
                    <Button
                      onClick={addSkill}
                      disabled={jobData.skills.length >= 10}
                      size="sm"
                      className="text-xs sm:text-sm"
                    >
                      <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-1 sm:gap-2 mt-2">
                    {jobData.skills.map((skill, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="px-2 sm:px-3 py-1 text-xs"
                      >
                        {skill}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSkill(index)}
                          className="ml-1 sm:ml-2 h-auto p-0"
                        >
                          <X className="w-2 h-2 sm:w-3 sm:h-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Add up to 10 skills that are most relevant to your project
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Project Requirements */}
            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="flex items-center text-base sm:text-lg">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Project Requirements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6">
                <div className="space-y-3 sm:space-y-4">
                  <Label className="text-xs sm:text-sm">Experience Level</Label>
                  <RadioGroup
                    value={jobData.experienceLevel}
                    onValueChange={(value) =>
                      handleInputChange("experienceLevel", value)
                    }
                  >
                    {experienceLevels.map((level) => (
                      <div
                        key={level.value}
                        className="flex items-start space-x-2 sm:space-x-3 p-3 sm:p-4 border border-border rounded-lg"
                      >
                        <RadioGroupItem
                          value={level.value}
                          id={level.value}
                          className="mt-1"
                        />
                        <div className="space-y-1">
                          <Label
                            htmlFor={level.value}
                            className="font-medium cursor-pointer text-xs sm:text-sm"
                          >
                            {level.label}
                          </Label>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            {level.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs sm:text-sm">Project Length</Label>
                  <Select
                    value={jobData.projectLength}
                    onValueChange={(value) =>
                      handleInputChange("projectLength", value)
                    }
                  >
                    <SelectTrigger className="text-xs sm:text-sm">
                      <SelectValue placeholder="How long will your project take?" />
                    </SelectTrigger>
                    <SelectContent>
                      {projectLengths.map((length) => (
                        <SelectItem key={length.value} value={length.value}>
                          {length.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs sm:text-sm">Deadline</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal text-xs sm:text-sm"
                      >
                        <CalendarIcon className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                        {jobData.deadline ? (
                          format(jobData.deadline, "PPP")
                        ) : (
                          <span>Pick a deadline (optional)</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={jobData.deadline}
                        onSelect={(date) => handleInputChange("deadline", date)}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="urgent"
                    checked={jobData.isUrgent}
                    onCheckedChange={(checked) =>
                      handleInputChange("isUrgent", checked)
                    }
                  />
                  <Label htmlFor="urgent" className="text-xs sm:text-sm">
                    This is an urgent project (may increase visibility)
                  </Label>
                </div>
              </CardContent>
            </Card>

            {/* Budget */}
            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-3 sm:pb-4">
                                 <CardTitle className="flex items-center text-base sm:text-lg">
                   Budget
                 </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6">
                <div className="space-y-3 sm:space-y-4">
                  <Label className="text-xs sm:text-sm">Budget Type</Label>
                  <RadioGroup
                    value={jobData.budgetType}
                    onValueChange={(value) =>
                      handleInputChange("budgetType", value)
                    }
                  >
                    {budgetTypes.map((type) => (
                      <div
                        key={type.value}
                        className="flex items-start space-x-2 sm:space-x-3 p-3 sm:p-4 border border-border rounded-lg"
                      >
                        <RadioGroupItem
                          value={type.value}
                          id={type.value}
                          className="mt-1"
                        />
                        <div className="space-y-1">
                          <Label
                            htmlFor={type.value}
                            className="font-medium cursor-pointer text-xs sm:text-sm"
                          >
                            {type.label}
                          </Label>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            {type.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {jobData.budgetType === "fixed" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs sm:text-sm">Minimum Budget</Label>
                                             <Input
                         type="number"
                         placeholder="500"
                         value={jobData.fixedBudget.min}
                         onChange={(e) =>
                           handleNestedInputChange(
                             "fixedBudget",
                             "min",
                             e.target.value,
                           )
                         }
                         className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-xs sm:text-sm"
                       />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs sm:text-sm">Maximum Budget</Label>
                                             <Input
                         type="number"
                         placeholder="1500"
                         value={jobData.fixedBudget.max}
                         onChange={(e) =>
                           handleNestedInputChange(
                             "fixedBudget",
                             "max",
                             e.target.value,
                           )
                         }
                         className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-xs sm:text-sm"
                       />
                    </div>
                  </div>
                )}

                {jobData.budgetType === "hourly" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs sm:text-sm">Minimum Rate ($/hour)</Label>
                                             <Input
                         type="number"
                         placeholder="25"
                         value={jobData.hourlyBudget.min}
                         onChange={(e) =>
                           handleNestedInputChange(
                             "hourlyBudget",
                             "min",
                             e.target.value,
                           )
                         }
                         className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-xs sm:text-sm"
                       />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs sm:text-sm">Maximum Rate ($/hour)</Label>
                                             <Input
                         type="number"
                         placeholder="75"
                         value={jobData.hourlyBudget.max}
                         onChange={(e) =>
                           handleNestedInputChange(
                             "hourlyBudget",
                             "max",
                             e.target.value,
                           )
                         }
                         className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-xs sm:text-sm"
                       />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Attachments & Questions */}
            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="flex items-center text-base sm:text-lg">
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Additional Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6">
                <div className="space-y-3 sm:space-y-4">
                  <Label className="text-xs sm:text-sm">Attachments (Optional)</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-4 sm:p-6 text-center">
                    <input
                      type="file"
                      id="attachments"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <label htmlFor="attachments" className="cursor-pointer">
                      <div className="flex flex-col items-center space-y-2">
                        <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground" />
                        <div>
                          <p className="text-xs sm:text-sm font-medium">Upload files</p>
                          <p className="text-xs text-muted-foreground">
                            Drag and drop or click to browse (Max 25MB each)
                          </p>
                        </div>
                      </div>
                    </label>
                  </div>

                  {jobData.attachments.length > 0 && (
                    <div className="space-y-2">
                      {jobData.attachments.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 bg-muted/50 rounded"
                        >
                          <span className="text-xs sm:text-sm">{file.name}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeAttachment(index)}
                          >
                            <X className="w-2 h-2 sm:w-3 sm:h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <Label className="text-xs sm:text-sm">Additional Questions for Freelancers (Optional)</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="e.g. How many years of experience do you have with React?"
                      value={currentQuestion}
                      onChange={(e) => setCurrentQuestion(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && addQuestion()}
                      className="text-xs sm:text-sm"
                    />
                    <Button onClick={addQuestion} size="sm" className="text-xs sm:text-sm">
                      <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                  </div>
                  {jobData.additionalQuestions.length > 0 && (
                    <div className="space-y-2">
                      {jobData.additionalQuestions.map((question, index) => (
                        <div
                          key={index}
                          className="flex items-start justify-between p-2 sm:p-3 bg-muted/50 rounded"
                        >
                          <span className="text-xs sm:text-sm flex-1">{question}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeQuestion(index)}
                          >
                            <X className="w-2 h-2 sm:w-3 sm:h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Preview & Submit */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-4 sm:space-y-6">
              <Card className="border-0 bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="text-base sm:text-lg">Job Preview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2 text-sm sm:text-base">
                      {jobData.title || "Your job title"}
                    </h3>
                    {jobData.category && (
                      <Badge variant="secondary" className="text-xs">{jobData.category}</Badge>
                    )}
                  </div>

                  {jobData.budgetType && (
                    <div className="p-2 sm:p-3 bg-muted/50 rounded">
                      <h4 className="font-medium text-xs sm:text-sm mb-1">Budget</h4>
                      {jobData.budgetType === "fixed" ? (
                        <p className="text-xs sm:text-sm">
                          {jobData.fixedBudget.min || "0"} -{" "}
                          {jobData.fixedBudget.max || "0"} (Fixed)
                        </p>
                      ) : (
                        <p className="text-xs sm:text-sm">
                          {jobData.hourlyBudget.min || "0"} -{" "}
                          {jobData.hourlyBudget.max || "0"}/hour
                        </p>
                      )}
                    </div>
                  )}

                  {jobData.experienceLevel && (
                    <div className="p-2 sm:p-3 bg-muted/50 rounded">
                      <h4 className="font-medium text-xs sm:text-sm mb-1">
                        Experience Level
                      </h4>
                      <p className="text-xs sm:text-sm">
                        {
                          experienceLevels.find(
                            (l) => l.value === jobData.experienceLevel,
                          )?.label
                        }
                      </p>
                    </div>
                  )}

                  {jobData.projectLength && (
                    <div className="p-2 sm:p-3 bg-muted/50 rounded">
                      <h4 className="font-medium text-xs sm:text-sm mb-1">
                        Project Length
                      </h4>
                      <p className="text-xs sm:text-sm">
                        {
                          projectLengths.find(
                            (l) => l.value === jobData.projectLength,
                          )?.label
                        }
                      </p>
                    </div>
                  )}

                  {jobData.skills.length > 0 && (
                    <div>
                      <h4 className="font-medium text-xs sm:text-sm mb-2">
                        Skills Required
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {jobData.skills.map((skill, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-0 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-4 sm:p-6">
                  <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Connects to post job
                      </span>
                      <span className="font-medium">2 connects</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Job visibility
                      </span>
                      <span className="font-medium">Public</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Expected applications
                      </span>
                      <span className="font-medium">5-10</span>
                    </div>
                  </div>

                  <GradientButton
                    className="w-full mt-4 sm:mt-6 text-xs sm:text-sm"
                    onClick={handleSubmit}
                    disabled={!isFormValid()}
                  >
                    <Briefcase className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    Post Job
                  </GradientButton>

                  <p className="text-xs text-muted-foreground text-center mt-2 sm:mt-3">
                    By posting, you agree to FreelanceHub's Terms of Service
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

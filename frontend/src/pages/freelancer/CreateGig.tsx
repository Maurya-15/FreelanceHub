import React, { useState } from "react";
import { API_ENDPOINTS, getApiUrl } from "@/lib/api";
import { Link, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FileUpload } from "@/components/upload/FileUpload";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Upload,
  X,
  Plus,
  Eye,
  Save,
  ImageIcon,
  Clock,
  DollarSign,
  Package,
} from "lucide-react";

const categories = [
  "Design & Creative",
  "Development & IT",
  "Writing & Translation",
  "Video & Animation",
  "Digital Marketing",
  "Data & Analytics",
  "Music & Audio",
  "Photography",
];

const deliveryOptions = [
  { label: "1 day", value: "1" },
  { label: "3 days", value: "3" },
  { label: "7 days", value: "7" },
  { label: "14 days", value: "14" },
  { label: "30 days", value: "30" },
];

export default function CreateGig() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [gigData, setGigData] = useState({
    title: "",
    category: "",
    description: "",
    tags: [],
    images: [],
    packages: {
      basic: {
        name: "Basic",
        description: "",
        price: "",
        deliveryTime: "7",
        revisions: "1",
        features: [],
      },
      standard: {
        name: "Standard",
        description: "",
        price: "",
        deliveryTime: "14",
        revisions: "3",
        features: [],
      },
      premium: {
        name: "Premium",
        description: "",
        price: "",
        deliveryTime: "21",
        revisions: "Unlimited",
        features: [],
      },
    },
  });

  const [currentTag, setCurrentTag] = useState("");
  const [currentFeature, setCurrentFeature] = useState({
    basic: "",
    standard: "",
    premium: "",
  });

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<'basic' | 'standard' | 'premium'>('basic');

  const handleInputChange = (field: string, value: string) => {
    setGigData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePackageChange = (
    packageType: string,
    field: string,
    value: string,
  ) => {
    setGigData((prev) => ({
      ...prev,
      packages: {
        ...prev.packages,
        [packageType]: {
          ...prev.packages[packageType],
          [field]: value,
        },
      },
    }));
  };

  const addTag = () => {
    if (currentTag.trim() && gigData.tags.length < 5) {
      setGigData((prev) => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()],
      }));
      setCurrentTag("");
    }
  };

  const removeTag = (index: number) => {
    setGigData((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  };

  const addFeature = (packageType: string) => {
    const feature = currentFeature[packageType];
    if (feature.trim()) {
      setGigData((prev) => ({
        ...prev,
        packages: {
          ...prev.packages,
          [packageType]: {
            ...prev.packages[packageType],
            features: [...prev.packages[packageType].features, feature.trim()],
          },
        },
      }));
      setCurrentFeature((prev) => ({ ...prev, [packageType]: "" }));
    }
  };

  const removeFeature = (packageType: string, index: number) => {
    setGigData((prev) => ({
      ...prev,
      packages: {
        ...prev.packages,
        [packageType]: {
          ...prev.packages[packageType],
          features: prev.packages[packageType].features.filter(
            (_, i) => i !== index,
          ),
        },
      },
    }));
  };

  // Only use imageFiles for uploading. gigData.images is for preview only.
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImageFiles((prev) => [...prev, ...files]);
    // gigData.images is only for preview, not for upload
    setGigData((prev) => ({
      ...prev,
      images: [...prev.images, ...files.map((file) => URL.createObjectURL(file))],
    }));
  };

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setGigData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('User not logged in. Please log in again.');
      return;
    }
    if (!gigData.title || !gigData.description || !gigData.category || !selectedPackage) {
      alert('Please fill in all required fields.');
      return;
    }
    const formData = new FormData();
    formData.append('title', gigData.title);
    formData.append('description', gigData.description);
    formData.append('category', gigData.category);
    formData.append('packages', JSON.stringify(gigData.packages));
    formData.append('activePackage', selectedPackage);
    // Only append imageFiles, not gigData.images
    imageFiles.forEach((file) => formData.append('images', file));
    try {
      formData.forEach((value, key) => {
        console.log(key, value);
      });
      
      const res = await fetch(getApiUrl(API_ENDPOINTS.GIGS), {
        method: 'POST',
        body: formData,
        headers: { 'user-id': `userId-freelancerId-${userId}` },
      });
      const data = await res.json();
      if (data.success) {
        navigate('/freelancer/my-gigs');
      } else {
        alert(data.message || 'Failed to create gig');
      }
    } catch (err) {
      alert('Failed to create gig');
    }
  };

  const steps = ["Basic Info", "Pricing & Packages", "Gallery", "Preview"];

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link to="/freelancer/dashboard">
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Create New Gig</h1>
              <p className="text-muted-foreground">
                Set up your service offering and start earning
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Save className="w-4 h-4 mr-2" />
              Save Draft
            </Button>
            <Button variant="outline">
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            {steps.map((step, index) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    index <= currentStep
                      ? "bg-brand-gradient text-white"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {index + 1}
                </div>
                <span
                  className={`ml-2 ${index <= currentStep ? "text-primary" : "text-muted-foreground"}`}
                >
                  {step}
                </span>
                {index < steps.length - 1 && (
                  <div
                    className={`w-12 h-0.5 mx-4 ${index < currentStep ? "bg-primary" : "bg-muted"}`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <Tabs value={currentStep.toString()} className="space-y-6">
          {/* Step 1: Basic Info */}
          <TabsContent value="0">
            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Gig Title</Label>
                  <Input
                    id="title"
                    placeholder="I will..."
                    value={gigData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    className="text-lg"
                  />
                  <p className="text-sm text-muted-foreground">
                    {gigData.title.length}/80 characters
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={gigData.category}
                    onValueChange={(value) =>
                      handleInputChange("category", value)
                    }
                  >
                    <SelectTrigger>
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
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your service in detail..."
                    value={gigData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    className="min-h-[200px]"
                  />
                  <p className="text-sm text-muted-foreground">
                    {gigData.description.length}/1200 characters
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Search Tags (max 5)</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a tag..."
                      value={currentTag}
                      onChange={(e) => setCurrentTag(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && addTag()}
                    />
                    <Button
                      onClick={addTag}
                      disabled={gigData.tags.length >= 5}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {gigData.tags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="px-3 py-1"
                      >
                        {tag}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeTag(index)}
                          className="ml-2 h-auto p-0"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Step 2: Pricing & Packages */}
          <TabsContent value="1">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {Object.entries(gigData.packages).map(
                ([packageType, packageData]) => (
                  <Card
                    key={packageType}
                    className={`border-0 bg-card/50 backdrop-blur-sm ${packageType === "standard" ? "ring-2 ring-primary" : ""}`}
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        {packageData.name}
                        {packageType === "standard" && (
                          <Badge className="bg-brand-gradient text-white">
                            Popular
                          </Badge>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Package Name</Label>
                        <Input
                          value={packageData.name}
                          onChange={(e) =>
                            handlePackageChange(
                              packageType,
                              "name",
                              e.target.value,
                            )
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                          value={packageData.description}
                          onChange={(e) =>
                            handlePackageChange(
                              packageType,
                              "description",
                              e.target.value,
                            )
                          }
                          placeholder="Describe what's included..."
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Price ($)</Label>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                              type="number"
                              value={packageData.price}
                              onChange={(e) =>
                                handlePackageChange(
                                  packageType,
                                  "price",
                                  e.target.value,
                                )
                              }
                              className="pl-10"
                              placeholder="0"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Delivery Time</Label>
                          <Select
                            value={packageData.deliveryTime}
                            onValueChange={(value) =>
                              handlePackageChange(
                                packageType,
                                "deliveryTime",
                                value,
                              )
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {deliveryOptions.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Revisions</Label>
                        <Input
                          value={packageData.revisions}
                          onChange={(e) =>
                            handlePackageChange(
                              packageType,
                              "revisions",
                              e.target.value,
                            )
                          }
                          placeholder="e.g. 3 or Unlimited"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Features</Label>
                        <div className="flex gap-2">
                          <Input
                            placeholder="Add a feature..."
                            value={currentFeature[packageType]}
                            onChange={(e) =>
                              setCurrentFeature((prev) => ({
                                ...prev,
                                [packageType]: e.target.value,
                              }))
                            }
                            onKeyPress={(e) =>
                              e.key === "Enter" && addFeature(packageType)
                            }
                          />
                          <Button onClick={() => addFeature(packageType)}>
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="space-y-2">
                          {packageData.features.map((feature, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-2 bg-muted/50 rounded"
                            >
                              <span className="text-sm">{feature}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  removeFeature(packageType, index)
                                }
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ),
              )}
            </div>
          </TabsContent>

          {/* Step 3: Gallery */}
          <TabsContent value="2">
            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Gig Gallery</CardTitle>
              </CardHeader>
              <CardContent>
                <FileUpload
                  onFilesChange={(files) => {
                    setImageFiles(files.map(f => f.file)); // Only File objects
                    setGigData((prev) => ({
                      ...prev,
                      images: files.map((f) => f.preview || f.file.name),
                    }));
                  }}
                  maxFiles={5}
                  maxSize={10}
                  acceptedTypes={["image/*", "video/*"]}
                  showPreview={true}
                />
                <div className="mt-4 text-sm text-muted-foreground">
                  <p>• Upload high-quality images that showcase your work</p>
                  <p>• The first image will be used as the main thumbnail</p>
                  <p>• Videos can help demonstrate your process or results</p>
                  <p>
                    • Supported formats: JPG, PNG, GIF, MP4, MOV up to 10MB each
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Step 4: Preview */}
          <TabsContent value="3">
            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Gig Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">
                      {gigData.title || "Your Gig Title"}
                    </h2>
                    <Badge variant="secondary">{gigData.category}</Badge>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-muted-foreground whitespace-pre-wrap">
                      {gigData.description ||
                        "Your gig description will appear here..."}
                    </p>
                  </div>

                  {gigData.tags.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {gigData.tags.map((tag, index) => (
                          <Badge key={index} variant="outline">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Object.entries(gigData.packages).map(
                      ([packageType, packageData]) => (
                        <Card
                          key={packageType}
                          className="border border-border/40"
                        >
                          <CardHeader>
                            <CardTitle className="text-lg">
                              {packageData.name}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <p className="text-sm text-muted-foreground">
                              {packageData.description || "Package description"}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-2xl font-bold">
                                ${packageData.price || "0"}
                              </span>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Clock className="w-4 h-4 mr-1" />
                                {packageData.deliveryTime} days
                              </div>
                            </div>
                            {packageData.features.length > 0 && (
                              <ul className="text-sm space-y-1">
                                {packageData.features.map((feature, index) => (
                                  <li key={index} className="flex items-center">
                                    <div className="w-1 h-1 bg-current rounded-full mr-2" />
                                    {feature}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </CardContent>
                        </Card>
                      ),
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
          >
            Previous
          </Button>

          {currentStep < steps.length - 1 ? (
            <Button
              onClick={() =>
                setCurrentStep(Math.min(steps.length - 1, currentStep + 1))
              }
            >
              Next
            </Button>
          ) : (
            <GradientButton onClick={handleSubmit}>
              <Package className="w-4 h-4 mr-2" />
              Publish Gig
            </GradientButton>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

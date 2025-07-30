import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
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
  IndianRupee,
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
  { label: "21 days", value: "21" },
  { label: "30 days", value: "30" },
];

// Mock gig data for editing
const mockGigsData = {
  "GIG-001": {
    id: "GIG-001",
    title: "I will design a modern logo for your business",
    description:
      "Professional logo design with unlimited revisions and multiple file formats. I'll create a unique, memorable logo that represents your brand perfectly.",
    category: "Design & Creative",
    tags: ["logo", "design", "branding", "creative"],
    images: ["/api/placeholder/400/300"],
    basicPackage: {
      title: "Basic Logo",
      description: "1 logo concept with 3 revisions",
      price: 299,
      deliveryTime: "3",
      features: ["1 Logo Concept", "3 Revisions", "PNG & JPG Files"],
    },
    standardPackage: {
      title: "Standard Package",
      description: "3 logo concepts with 5 revisions",
      price: 599,
      deliveryTime: "5",
      features: [
        "3 Logo Concepts",
        "5 Revisions",
        "PNG, JPG & PDF Files",
        "Social Media Kit",
      ],
    },
    premiumPackage: {
      title: "Premium Package",
      description: "5 logo concepts with unlimited revisions",
      price: 999,
      deliveryTime: "7",
      features: [
        "5 Logo Concepts",
        "Unlimited Revisions",
        "All File Formats",
        "Brand Guidelines",
        "3D Mockups",
      ],
    },
  },
  "GIG-002": {
    id: "GIG-002",
    title: "I will create a complete brand identity package",
    description:
      "Full brand identity design including logo, business cards, letterhead, and brand guidelines.",
    category: "Design & Creative",
    tags: ["branding", "identity", "logo", "business-cards"],
    images: ["/api/placeholder/400/300"],
    basicPackage: {
      title: "Basic Branding",
      description: "Logo + Business Card Design",
      price: 850,
      deliveryTime: "7",
      features: ["Logo Design", "Business Card", "2 Revisions", "Basic Files"],
    },
    standardPackage: {
      title: "Complete Identity",
      description: "Full brand identity package",
      price: 1500,
      deliveryTime: "10",
      features: [
        "Logo Design",
        "Business Card",
        "Letterhead",
        "Brand Colors",
        "5 Revisions",
      ],
    },
    premiumPackage: {
      title: "Brand Guidelines",
      description: "Complete brand identity with guidelines",
      price: 2500,
      deliveryTime: "14",
      features: [
        "Everything in Standard",
        "Brand Guidelines",
        "Social Media Templates",
        "Unlimited Revisions",
      ],
    },
  },
};

export default function EditGig() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState("overview");
  const [loading, setLoading] = useState(true);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    tags: [],
    images: [],
    basicPackage: {
      title: "",
      description: "",
      price: "",
      deliveryTime: "",
      features: [""],
    },
    standardPackage: {
      title: "",
      description: "",
      price: "",
      deliveryTime: "",
      features: [""],
    },
    premiumPackage: {
      title: "",
      description: "",
      price: "",
      deliveryTime: "",
      features: [""],
    },
  });

  const [newTag, setNewTag] = useState("");

  // Load gig data on component mount
  useEffect(() => {
    const gigData = mockGigsData[id];
    if (gigData) {
      setFormData(gigData);
      setLoading(false);
    } else {
      // Gig not found, redirect to my gigs
      navigate("/freelancer/my-gigs");
    }
  }, [id, navigate]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePackageChange = (packageType, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [packageType]: {
        ...prev[packageType],
        [field]: value,
      },
    }));
  };

  const handleFeatureChange = (packageType, index, value) => {
    setFormData((prev) => ({
      ...prev,
      [packageType]: {
        ...prev[packageType],
        features: prev[packageType].features.map((feature, i) =>
          i === index ? value : feature,
        ),
      },
    }));
  };

  const addFeature = (packageType) => {
    setFormData((prev) => ({
      ...prev,
      [packageType]: {
        ...prev[packageType],
        features: [...prev[packageType].features, ""],
      },
    }));
  };

  const removeFeature = (packageType, index) => {
    setFormData((prev) => ({
      ...prev,
      [packageType]: {
        ...prev[packageType],
        features: prev[packageType].features.filter((_, i) => i !== index),
      },
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSave = () => {
    // In a real app, this would make an API call to update the gig
    console.log("Saving gig changes:", formData);
    alert("Gig updated successfully!");
    navigate("/freelancer/my-gigs");
  };

  const handlePreview = () => {
    // In a real app, this would open a preview modal or navigate to preview page
    alert("Preview functionality would show how the gig looks to buyers");
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading gig data...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link to="/freelancer/my-gigs">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to My Gigs
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Edit Gig</h1>
              <p className="text-muted-foreground">
                Update your gig details and packages
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" onClick={handlePreview}>
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <GradientButton onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </GradientButton>
          </div>
        </div>

        <Tabs value={currentTab} onValueChange={setCurrentTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
            <TabsTrigger value="publish">Publish</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Gig Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="title">Gig Title</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) =>
                          handleInputChange("title", e.target.value)
                        }
                        placeholder="I will..."
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) =>
                          handleInputChange("category", value)
                        }
                      >
                        <SelectTrigger className="mt-1">
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

                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) =>
                          handleInputChange("description", e.target.value)
                        }
                        placeholder="Describe your service in detail..."
                        className="mt-1 min-h-[120px]"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Tags</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <Input
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          placeholder="Add a tag..."
                          onKeyPress={(e) => e.key === "Enter" && addTag()}
                        />
                        <Button onClick={addTag} size="sm">
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formData.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="gap-1"
                          >
                            {tag}
                            <button onClick={() => removeTag(tag)}>
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Gig Preview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="aspect-video bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg flex items-center justify-center">
                        {formData.images.length > 0 ? (
                          <img
                            src={formData.images[0]}
                            alt="Gig preview"
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <div className="text-center">
                            <ImageIcon className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">
                              No images uploaded
                            </p>
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold">
                          {formData.title || "Your gig title"}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {formData.description ||
                            "Your gig description will appear here"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="pricing" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {["basicPackage", "standardPackage", "premiumPackage"].map(
                (packageType, index) => (
                  <Card key={packageType}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Package className="w-5 h-5" />
                        {["Basic", "Standard", "Premium"][index]}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label>Package Title</Label>
                        <Input
                          value={formData[packageType].title}
                          onChange={(e) =>
                            handlePackageChange(
                              packageType,
                              "title",
                              e.target.value,
                            )
                          }
                          placeholder="Package title"
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label>Description</Label>
                        <Textarea
                          value={formData[packageType].description}
                          onChange={(e) =>
                            handlePackageChange(
                              packageType,
                              "description",
                              e.target.value,
                            )
                          }
                          placeholder="Package description"
                          className="mt-1"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                                                      <Label>Price (₹)</Label>
                          <div className="relative mt-1">
                            <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                            <Input
                              type="number"
                              value={formData[packageType].price}
                              onChange={(e) =>
                                handlePackageChange(
                                  packageType,
                                  "price",
                                  e.target.value,
                                )
                              }
                              placeholder="0"
                              className="pl-10"
                            />
                          </div>
                        </div>

                        <div>
                          <Label>Delivery</Label>
                          <Select
                            value={formData[packageType].deliveryTime}
                            onValueChange={(value) =>
                              handlePackageChange(
                                packageType,
                                "deliveryTime",
                                value,
                              )
                            }
                          >
                            <SelectTrigger className="mt-1">
                              <Clock className="w-4 h-4 mr-2" />
                              <SelectValue placeholder="Days" />
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

                      <div>
                        <Label>Features</Label>
                        <div className="space-y-2 mt-1">
                          {formData[packageType].features.map(
                            (feature, featureIndex) => (
                              <div key={featureIndex} className="flex gap-2">
                                <Input
                                  value={feature}
                                  onChange={(e) =>
                                    handleFeatureChange(
                                      packageType,
                                      featureIndex,
                                      e.target.value,
                                    )
                                  }
                                  placeholder="Feature description"
                                />
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    removeFeature(packageType, featureIndex)
                                  }
                                  disabled={
                                    formData[packageType].features.length === 1
                                  }
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            ),
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => addFeature(packageType)}
                            className="w-full"
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            Add Feature
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ),
              )}
            </div>
          </TabsContent>

          <TabsContent value="gallery" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Gig Images</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <FileUpload
                    onFilesChange={(files) => {
                      // Handle file upload
                      console.log("Files uploaded:", files);
                      // Update formData with new image URLs (in real app, these would come from upload service)
                      const imageUrls = files.map(
                        (file) => file.preview || "/api/placeholder/400/300",
                      );
                      setFormData((prev) => ({
                        ...prev,
                        images: [...prev.images, ...imageUrls],
                      }));
                    }}
                    maxFiles={5}
                    acceptedTypes={["image/*"]}
                  />

                  {formData.images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                      {formData.images.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={image}
                            alt={`Gig image ${index + 1}`}
                            className="w-full aspect-square object-cover rounded-lg"
                          />
                          <Button
                            size="sm"
                            variant="destructive"
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => {
                              setFormData((prev) => ({
                                ...prev,
                                images: prev.images.filter(
                                  (_, i) => i !== index,
                                ),
                              }));
                            }}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="publish" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Review & Update</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="bg-muted p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Gig Summary</h3>
                    <div className="space-y-2 text-sm">
                      <p>
                        <strong>Title:</strong> {formData.title}
                      </p>
                      <p>
                        <strong>Category:</strong> {formData.category}
                      </p>
                      <p>
                        <strong>Packages:</strong> 3 pricing options configured
                      </p>
                      <p>
                        <strong>Images:</strong> {formData.images.length}{" "}
                        uploaded
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <GradientButton onClick={handleSave} className="flex-1">
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </GradientButton>
                    <Button
                      variant="outline"
                      onClick={handlePreview}
                      className="flex-1"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Preview Gig
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

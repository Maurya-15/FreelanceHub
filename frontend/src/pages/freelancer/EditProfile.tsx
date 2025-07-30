import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function EditFreelancerProfile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const freelancerId = user?.id || user?._id;
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Create fallback profile data with useMemo to prevent recreation
  const fallbackProfile = useMemo(() => ({
    _id: user?.id || 'unknown',
    name: user?.name || 'Freelancer',
    title: user?.title || 'Professional Freelancer',
    avatar: user?.avatar,
    coverPhoto: null,
    location: 'Remote',
    email: user?.email || '',
    overview: 'Professional freelancer with expertise in various domains.',
    skills: ['Web Development', 'Design', 'Writing'],
    languages: [{ name: 'English', level: 'Native' }],
    education: [],
    certifications: [],
  }), [user?.id, user?.name, user?.title, user?.avatar, user?.email]);

  useEffect(() => {
    // Try to load saved profile from localStorage first
    try {
      const saved = localStorage.getItem('freelancerProfile');
      if (saved) {
        const savedProfile = JSON.parse(saved);
        setProfileData({ ...fallbackProfile, ...savedProfile });
      } else {
        setProfileData(fallbackProfile);
      }
    } catch (err) {
      console.log('Error loading saved profile:', err);
      setProfileData(fallbackProfile);
    }
    setLoading(false);
  }, [fallbackProfile]);

  const handleInputChange = (field: string, value: any) => {
    setProfileData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSaveChanges = async () => {
    setSaving(true);
    setError(null);
    
    try {
      // Save to localStorage for persistence
      localStorage.setItem('freelancerProfile', JSON.stringify(profileData));
      
      // Also try to save to API if available
      if (freelancerId) {
        try {
          await fetch(`/api/users/${freelancerId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(profileData),
          });
        } catch (err) {
          console.log('API save failed, but localStorage saved:', err);
        }
      }
      
      setSaving(false);
      navigate("/freelancer/profile");
    } catch (err) {
      console.log('Save failed:', err);
      setSaving(false);
      // Still navigate to profile page even if save fails
      navigate("/freelancer/profile");
    }
  };

  if (loading || !profileData) {
    return <div className="min-h-screen flex items-center justify-center">Loading profile...</div>;
  }
  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-destructive">{error}</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-2xl p-6">
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Banner Upload and Preview */}
          <div className="mb-6">
            {profileData.coverPhoto ? (
              <img
                src={profileData.coverPhoto}
                alt="Banner Preview"
                className="w-full h-36 object-cover rounded-xl mb-2"
              />
            ) : (
              <div className="w-full h-36 flex items-center justify-center rounded-xl mb-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-5xl font-bold">
                {profileData.name?.[0] || "?"}
              </div>
            )}
            <label className="block text-sm font-medium">Banner (Cover Photo)</label>
            <input
              type="file"
              accept="image/*"
              className="block mt-1"
              onChange={e => {
                const file = e.target.files && e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = ev => {
                    handleInputChange("coverPhoto", ev.target?.result as string);
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="w-20 h-20">
                <AvatarImage src={profileData.avatar} />
                <AvatarFallback>{profileData.name?.[0]}</AvatarFallback>
              </Avatar>
              <div>
                <label className="block text-sm font-medium">Name</label>
                <Input
                  value={profileData.name || ""}
                  onChange={e => handleInputChange("name", e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium">Email</label>
              <Input value={profileData.email || ""} disabled />
            </div>
            <div>
              <label className="block text-sm font-medium">Title</label>
              <Input
                value={profileData.title || ""}
                onChange={e => handleInputChange("title", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Location</label>
              <Input
                value={profileData.location || ""}
                onChange={e => handleInputChange("location", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Overview</label>
              <Textarea
                rows={4}
                value={profileData.overview || ""}
                onChange={e => handleInputChange("overview", e.target.value)}
              />
            </div>

            {/* Languages Section */}
            <div>
              <label className="block text-sm font-medium mb-2">Languages</label>
              <div className="flex flex-col gap-2">
                {(profileData.languages || []).map((lang: any, idx: number) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <Input
                      className="w-1/2"
                      placeholder="Language"
                      value={lang.name}
                      onChange={e => {
                        const updated = [...profileData.languages];
                        updated[idx] = { ...updated[idx], name: e.target.value };
                        handleInputChange("languages", updated);
                      }}
                    />
                    <Input
                      className="w-1/2"
                      placeholder="Level (e.g. Fluent, Conversational)"
                      value={lang.level}
                      onChange={e => {
                        const updated = [...profileData.languages];
                        updated[idx] = { ...updated[idx], level: e.target.value };
                        handleInputChange("languages", updated);
                      }}
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        const updated = [...profileData.languages];
                        updated.splice(idx, 1);
                        handleInputChange("languages", updated);
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  className="w-fit mt-2"
                  variant="outline"
                  onClick={() => {
                    handleInputChange(
                      "languages",
                      [...(profileData.languages || []), { name: "", level: "" }]
                    );
                  }}
                >
                  + Add Language
                </Button>
              </div>
            </div>
            <Button
              className="w-full py-3 text-lg font-semibold mt-4"
              onClick={handleSaveChanges}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

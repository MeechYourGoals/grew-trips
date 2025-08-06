import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Building2, Mail, Phone, Globe, MapPin, FileText, CheckCircle, XCircle, Edit, Save, X } from 'lucide-react';

interface AdvertiserProfileProps {
  profile: any;
  onProfileUpdate: (profile: any) => void;
}

export const AdvertiserProfile = ({ profile, onProfileUpdate }: AdvertiserProfileProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    company_name: profile.company_name || '',
    contact_email: profile.contact_email || '',
    contact_phone: profile.contact_phone || '',
    business_address: profile.business_address || '',
    business_description: profile.business_description || '',
    website_url: profile.website_url || '',
    company_logo_url: profile.company_logo_url || ''
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error('Not authenticated');
      }

      const url = new URL(`https://jmjiyekmxwsxkfnqwyaa.supabase.co/functions/v1/advertiser-management`);
      url.searchParams.append('action', 'update-profile');
      
      const response = await fetch(url.toString(), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imptaml5ZWtteHdzeGtmbnF3eWFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5MjEwMDgsImV4cCI6MjA2OTQ5NzAwOH0.SAas0HWvteb9TbYNJFDf8Itt8mIsDtKOK6QwBcwINhI'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();

      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully!",
      });

      onProfileUpdate(data.profile);
      setIsEditing(false);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      company_name: profile.company_name || '',
      contact_email: profile.contact_email || '',
      contact_phone: profile.contact_phone || '',
      business_address: profile.business_address || '',
      business_description: profile.business_description || '',
      website_url: profile.website_url || '',
      company_logo_url: profile.company_logo_url || ''
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Business Profile
              </CardTitle>
              <CardDescription>
                Manage your business information and verification status
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={profile.is_verified ? "default" : "secondary"}>
                {profile.is_verified ? (
                  <>
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Verified
                  </>
                ) : (
                  <>
                    <XCircle className="w-3 h-3 mr-1" />
                    Pending Verification
                  </>
                )}
              </Badge>
              {!isEditing ? (
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleCancel}>
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={loading}>
                    <Save className="w-4 h-4 mr-2" />
                    {loading ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Company Logo */}
          {(formData.company_logo_url || profile.company_logo_url) && (
            <div className="space-y-2">
              <Label>Company Logo</Label>
              <div className="flex items-center gap-4">
                <img
                  src={formData.company_logo_url || profile.company_logo_url}
                  alt="Company Logo"
                  className="w-16 h-16 object-contain rounded border"
                />
                {isEditing && (
                  <div className="flex-1">
                    <Input
                      value={formData.company_logo_url}
                      onChange={(e) => handleInputChange('company_logo_url', e.target.value)}
                      placeholder="https://example.com/logo.png"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Company Name */}
          <div className="space-y-2">
            <Label htmlFor="company_name">Company Name</Label>
            {isEditing ? (
              <Input
                id="company_name"
                value={formData.company_name}
                onChange={(e) => handleInputChange('company_name', e.target.value)}
                placeholder="Your Business Name"
              />
            ) : (
              <p className="p-2 border rounded bg-muted/50">{profile.company_name}</p>
            )}
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contact_email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Contact Email
              </Label>
              {isEditing ? (
                <Input
                  id="contact_email"
                  type="email"
                  value={formData.contact_email}
                  onChange={(e) => handleInputChange('contact_email', e.target.value)}
                  placeholder="business@example.com"
                />
              ) : (
                <p className="p-2 border rounded bg-muted/50">{profile.contact_email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact_phone" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Phone Number
              </Label>
              {isEditing ? (
                <Input
                  id="contact_phone"
                  type="tel"
                  value={formData.contact_phone}
                  onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                />
              ) : (
                <p className="p-2 border rounded bg-muted/50">{profile.contact_phone || 'Not provided'}</p>
              )}
            </div>
          </div>

          {/* Website URL */}
          <div className="space-y-2">
            <Label htmlFor="website_url" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Website URL
            </Label>
            {isEditing ? (
              <Input
                id="website_url"
                type="url"
                value={formData.website_url}
                onChange={(e) => handleInputChange('website_url', e.target.value)}
                placeholder="https://www.yourbusiness.com"
              />
            ) : (
              <p className="p-2 border rounded bg-muted/50">
                {profile.website_url ? (
                  <a href={profile.website_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    {profile.website_url}
                  </a>
                ) : (
                  'Not provided'
                )}
              </p>
            )}
          </div>

          {/* Business Address */}
          <div className="space-y-2">
            <Label htmlFor="business_address" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Business Address
            </Label>
            {isEditing ? (
              <Input
                id="business_address"
                value={formData.business_address}
                onChange={(e) => handleInputChange('business_address', e.target.value)}
                placeholder="123 Business St, City, State 12345"
              />
            ) : (
              <p className="p-2 border rounded bg-muted/50">{profile.business_address || 'Not provided'}</p>
            )}
          </div>

          {/* Business Description */}
          <div className="space-y-2">
            <Label htmlFor="business_description" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Business Description
            </Label>
            {isEditing ? (
              <Textarea
                id="business_description"
                value={formData.business_description}
                onChange={(e) => handleInputChange('business_description', e.target.value)}
                placeholder="Tell us about your business, what you offer, and what makes you unique..."
                rows={4}
              />
            ) : (
              <p className="p-2 border rounded bg-muted/50 whitespace-pre-wrap">
                {profile.business_description || 'Not provided'}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Account Status */}
      <Card>
        <CardHeader>
          <CardTitle>Account Status</CardTitle>
          <CardDescription>
            Your account verification and status information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Business Verification</span>
              <Badge variant={profile.is_verified ? "default" : "secondary"}>
                {profile.is_verified ? "Verified" : "Pending"}
              </Badge>
            </div>
            
            {!profile.is_verified && (
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Verification Required</h4>
                <p className="text-sm text-muted-foreground">
                  Your business profile is pending verification. This helps ensure trust and quality 
                  for Chravel users. Our team will review your profile within 24-48 hours.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
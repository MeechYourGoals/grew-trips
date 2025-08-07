import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Building2, Mail, Phone, Globe, MapPin, FileText } from 'lucide-react';

interface AdvertiserOnboardingProps {
  onProfileCreated: (profile: any) => void;
}

export const AdvertiserOnboarding = ({ onProfileCreated }: AdvertiserOnboardingProps) => {
  const [formData, setFormData] = useState({
    company_name: '',
    contact_email: '',
    contact_phone: '',
    business_address: '',
    business_description: '',
    website_url: '',
    company_logo_url: ''
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('🔍 Creating advertiser profile...');
      
      // Get current user
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) {
        throw new Error('User not authenticated');
      }

      // Direct database insert
      const { data, error } = await supabase
        .from('advertiser_profiles')
        .insert({
          user_id: userData.user.id,
          ...formData
        })
        .select()
        .single();

      if (error) {
        throw new Error(`Profile creation failed: ${error.message}`);
      }

      console.log('✅ Profile created:', data);

      toast({
        title: "Profile Created",
        description: "Your advertiser profile has been created successfully!",
      });

      onProfileCreated(data);
    } catch (error: any) {
      console.error('Error creating profile:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create advertiser profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome to Chravel Advertiser Hub</h1>
        <p className="text-muted-foreground text-lg">
          Let's set up your business profile to start creating promotional cards
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Business Information
          </CardTitle>
          <CardDescription>
            Tell us about your business to get started with advertising on Chravel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="company_name">Company Name *</Label>
              <Input
                id="company_name"
                value={formData.company_name}
                onChange={(e) => handleInputChange('company_name', e.target.value)}
                placeholder="Your Business Name"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contact_email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Contact Email *
                </Label>
                <Input
                  id="contact_email"
                  type="email"
                  value={formData.contact_email}
                  onChange={(e) => handleInputChange('contact_email', e.target.value)}
                  placeholder="business@example.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact_phone" className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone Number
                </Label>
                <Input
                  id="contact_phone"
                  type="tel"
                  value={formData.contact_phone}
                  onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="website_url" className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Website URL
              </Label>
              <Input
                id="website_url"
                type="url"
                value={formData.website_url}
                onChange={(e) => handleInputChange('website_url', e.target.value)}
                placeholder="https://www.yourbusiness.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="business_address" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Business Address
              </Label>
              <Input
                id="business_address"
                value={formData.business_address}
                onChange={(e) => handleInputChange('business_address', e.target.value)}
                placeholder="123 Business St, City, State 12345"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="business_description" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Business Description
              </Label>
              <Textarea
                id="business_description"
                value={formData.business_description}
                onChange={(e) => handleInputChange('business_description', e.target.value)}
                placeholder="Tell us about your business, what you offer, and what makes you unique..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company_logo_url">Company Logo URL</Label>
              <Input
                id="company_logo_url"
                type="url"
                value={formData.company_logo_url}
                onChange={(e) => handleInputChange('company_logo_url', e.target.value)}
                placeholder="https://example.com/logo.png"
              />
              <p className="text-sm text-muted-foreground">
                Optional: Provide a URL to your company logo (we'll add file upload soon)
              </p>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading || !formData.company_name || !formData.contact_email}
            >
              {loading ? "Creating Profile..." : "Create Advertiser Profile"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
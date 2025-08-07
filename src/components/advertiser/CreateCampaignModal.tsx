import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Calendar, DollarSign } from 'lucide-react';

interface CreateCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCampaignCreated: (campaign: any) => void;
}

export const CreateCampaignModal = ({ isOpen, onClose, onCampaignCreated }: CreateCampaignModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    start_date: '',
    end_date: '',
    budget_amount: ''
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
      console.log('🔍 Creating campaign...');
      
      // Get current user and their advertiser profile
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) {
        throw new Error('User not authenticated');
      }

      const { data: profileData, error: profileError } = await supabase
        .from('advertiser_profiles')
        .select('id')
        .eq('user_id', userData.user.id)
        .single();

      if (profileError) {
        throw new Error(`Profile lookup failed: ${profileError.message}`);
      }

      // Direct database insert
      const { data, error } = await supabase
        .from('campaigns')
        .insert({
          advertiser_id: profileData.id,
          name: formData.name,
          start_date: formData.start_date ? new Date(formData.start_date).toISOString() : null,
          end_date: formData.end_date ? new Date(formData.end_date).toISOString() : null,
          budget_amount: formData.budget_amount ? parseFloat(formData.budget_amount) : null,
          status: 'draft'
        })
        .select()
        .single();

      if (error) {
        throw new Error(`Campaign creation failed: ${error.message}`);
      }

      console.log('✅ Campaign created:', data);

      toast({
        title: "Campaign Created",
        description: "Your campaign has been created successfully!",
      });

      onCampaignCreated(data);
      onClose();
      
      // Reset form
      setFormData({
        name: '',
        start_date: '',
        end_date: '',
        budget_amount: ''
      });
    } catch (error: any) {
      console.error('Error creating campaign:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create campaign",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Campaign</DialogTitle>
          <DialogDescription>
            Set up a new advertising campaign for your promotional cards
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Campaign Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Summer Sale 2024"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_date" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Start Date
              </Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => handleInputChange('start_date', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_date" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                End Date
              </Label>
              <Input
                id="end_date"
                type="date"
                value={formData.end_date}
                onChange={(e) => handleInputChange('end_date', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="budget_amount" className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Budget Amount
            </Label>
            <Input
              id="budget_amount"
              type="number"
              step="0.01"
              min="0"
              value={formData.budget_amount}
              onChange={(e) => handleInputChange('budget_amount', e.target.value)}
              placeholder="1000.00"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading || !formData.name}
            >
              {loading ? "Creating..." : "Create Campaign"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
import React, { useState } from 'react';
import { Plus, Edit, Trash2, CreditCard, Smartphone, DollarSign, Mail, Phone } from 'lucide-react';
import { PaymentMethod } from '../../types/payments';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

interface PaymentMethodsSettingsProps {
  userId: string;
}

export const PaymentMethodsSettings = ({ userId }: PaymentMethodsSettingsProps) => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'venmo',
      identifier: '@jamiechen',
      displayName: 'Venmo',
      isPreferred: true,
      isVisible: true
    },
    {
      id: '2', 
      type: 'zelle',
      identifier: 'jamie@example.com',
      displayName: 'Zelle',
      isPreferred: false,
      isVisible: true
    }
  ]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null);

  const [formData, setFormData] = useState({
    type: 'venmo' as PaymentMethod['type'],
    identifier: '',
    displayName: '',
    isPreferred: false,
    isVisible: true
  });

  const paymentMethodOptions = [
    { value: 'venmo', label: 'Venmo', icon: Smartphone, placeholder: '@username' },
    { value: 'zelle', label: 'Zelle', icon: Mail, placeholder: 'email@example.com or phone' },
    { value: 'cashapp', label: 'Cash App', icon: DollarSign, placeholder: '$cashtag' },
    { value: 'applepay', label: 'Apple Pay', icon: Phone, placeholder: 'phone number' },
    { value: 'paypal', label: 'PayPal', icon: Mail, placeholder: 'email@example.com' },
    { value: 'applecash', label: 'Apple Cash', icon: Phone, placeholder: 'phone number' },
    { value: 'cash', label: 'Cash', icon: DollarSign, placeholder: 'Prefer cash payments' },
    { value: 'other', label: 'Other', icon: CreditCard, placeholder: 'Custom payment method' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newMethod: PaymentMethod = {
      id: editingMethod?.id || Date.now().toString(),
      ...formData,
      displayName: formData.displayName || getDefaultDisplayName(formData.type)
    };

    if (editingMethod) {
      setPaymentMethods(prev => prev.map(method => 
        method.id === editingMethod.id ? newMethod : method
      ));
    } else {
      setPaymentMethods(prev => [...prev, newMethod]);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      type: 'venmo',
      identifier: '',
      displayName: '',
      isPreferred: false,
      isVisible: true
    });
    setShowAddForm(false);
    setEditingMethod(null);
  };

  const handleEdit = (method: PaymentMethod) => {
    setFormData({
      type: method.type,
      identifier: method.identifier,
      displayName: method.displayName || '',
      isPreferred: method.isPreferred || false,
      isVisible: method.isVisible !== false
    });
    setEditingMethod(method);
    setShowAddForm(true);
  };

  const handleDelete = (methodId: string) => {
    setPaymentMethods(prev => prev.filter(method => method.id !== methodId));
  };

  const getDefaultDisplayName = (type: PaymentMethod['type']): string => {
    const option = paymentMethodOptions.find(opt => opt.value === type);
    return option?.label || type;
  };

  const getMethodIcon = (type: PaymentMethod['type']) => {
    const option = paymentMethodOptions.find(opt => opt.value === type);
    const Icon = option?.icon || CreditCard;
    return <Icon size={20} />;
  };

  const getPlaceholder = (type: PaymentMethod['type']): string => {
    const option = paymentMethodOptions.find(opt => opt.value === type);
    return option?.placeholder || 'Enter identifier';
  };

  return (
    <Card className="bg-background border-muted">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard size={20} className="text-primary" />
          Payment Methods
        </CardTitle>
        <CardDescription>
          Manage how you want to receive payments from trip members
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add/Edit Form */}
        {showAddForm && (
          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="text-lg">
                {editingMethod ? 'Edit Payment Method' : 'Add Payment Method'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type">Payment Method</Label>
                    <Select 
                      value={formData.type} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as PaymentMethod['type'] }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {paymentMethodOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-2">
                              <option.icon size={16} />
                              {option.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="identifier">Identifier</Label>
                    <Input
                      id="identifier"
                      value={formData.identifier}
                      onChange={(e) => setFormData(prev => ({ ...prev, identifier: e.target.value }))}
                      placeholder={getPlaceholder(formData.type)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="displayName">Display Name (Optional)</Label>
                  <Input
                    id="displayName"
                    value={formData.displayName}
                    onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                    placeholder={`Custom name for ${formData.type}`}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="preferred"
                      checked={formData.isPreferred}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPreferred: checked }))}
                    />
                    <Label htmlFor="preferred">Set as preferred method</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="visible"
                      checked={formData.isVisible}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isVisible: checked }))}
                    />
                    <Label htmlFor="visible">Visible to trip members</Label>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" className="bg-primary">
                    {editingMethod ? 'Update Method' : 'Add Method'}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Payment Methods List */}
        <div className="space-y-3">
          {paymentMethods.map(method => (
            <Card key={method.id} className="bg-background border-muted">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-primary">
                      {getMethodIcon(method.type)}
                    </div>
                    <div>
                      <div className="font-medium text-foreground">
                        {method.displayName || getDefaultDisplayName(method.type)}
                        {method.isPreferred && (
                          <span className="ml-2 text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">
                            Preferred
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {method.identifier}
                        {!method.isVisible && (
                          <span className="ml-2 text-xs text-muted-foreground">
                            (Private)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleEdit(method)}
                    >
                      <Edit size={14} />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleDelete(method.id)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {paymentMethods.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <CreditCard size={48} className="mx-auto mb-4 text-muted-foreground/50" />
            <p className="mb-4">No payment methods added yet</p>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus size={16} className="mr-2" />
              Add Your First Payment Method
            </Button>
          </div>
        )}

        {!showAddForm && paymentMethods.length > 0 && (
          <Button onClick={() => setShowAddForm(true)} className="w-full">
            <Plus size={16} className="mr-2" />
            Add Payment Method
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
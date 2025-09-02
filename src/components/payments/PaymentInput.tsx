import React, { useState } from 'react';
import { DollarSign, Users, CheckSquare } from 'lucide-react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { Card, CardContent } from '../ui/card';

interface PaymentInputProps {
  onSubmit: (paymentData: {
    amount: number;
    currency: string;
    description: string;
    splitCount: number;
    splitParticipants: string[];
    paymentMethods: string[];
  }) => void;
  tripMembers: Array<{ id: string; name: string; avatar?: string }>;
  isVisible: boolean;
}

export const PaymentInput = ({ onSubmit, tripMembers, isVisible }: PaymentInputProps) => {
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [description, setDescription] = useState('');
  const [splitCount, setSplitCount] = useState(tripMembers.length);
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>(
    tripMembers.map(member => member.id)
  );
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<string[]>(['venmo']);

  const paymentMethodOptions = [
    { id: 'venmo', label: 'Venmo', icon: '💰' },
    { id: 'zelle', label: 'Zelle', icon: '🏦' },
    { id: 'cashapp', label: 'Cash App', icon: '💸' },
    { id: 'applepay', label: 'Apple Pay', icon: '📱' },
    { id: 'paypal', label: 'PayPal', icon: '💙' },
    { id: 'cash', label: 'Cash', icon: '💵' },
    { id: 'other', label: 'Other', icon: '💳' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description) return;

    onSubmit({
      amount: parseFloat(amount),
      currency,
      description,
      splitCount,
      splitParticipants: selectedParticipants,
      paymentMethods: selectedPaymentMethods
    });

    // Reset form
    setAmount('');
    setDescription('');
    setSplitCount(tripMembers.length);
    setSelectedParticipants(tripMembers.map(member => member.id));
    setSelectedPaymentMethods(['venmo']);
  };

  const handleParticipantToggle = (participantId: string) => {
    setSelectedParticipants(prev => 
      prev.includes(participantId)
        ? prev.filter(id => id !== participantId)
        : [...prev, participantId]
    );
  };

  const handlePaymentMethodToggle = (methodId: string) => {
    setSelectedPaymentMethods(prev => 
      prev.includes(methodId)
        ? prev.filter(id => id !== methodId)
        : [...prev, methodId]
    );
  };

  if (!isVisible) return null;

  return (
    <Card className="bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800/30">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <DollarSign size={18} className="text-green-600" />
          <span className="font-medium text-green-800 dark:text-green-200">Payment Details</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Amount and Currency */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="bg-white dark:bg-gray-800"
                required
              />
            </div>
            <div>
              <Label htmlFor="currency">Currency</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger className="bg-white dark:bg-gray-800">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                  <SelectItem value="GBP">GBP (£)</SelectItem>
                  <SelectItem value="CAD">CAD ($)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">What's this for?</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Dinner, taxi, tickets, etc."
              className="bg-white dark:bg-gray-800"
              required
            />
          </div>

          {/* Split Options */}
          <div>
            <Label className="flex items-center gap-2">
              <Users size={16} />
              Split between {selectedParticipants.length} people
            </Label>
            <div className="mt-2 max-h-32 overflow-y-auto space-y-2 p-2 bg-white dark:bg-gray-800 rounded border">
              {tripMembers.map(member => (
                <div key={member.id} className="flex items-center gap-2">
                  <Checkbox
                    id={`participant-${member.id}`}
                    checked={selectedParticipants.includes(member.id)}
                    onCheckedChange={() => handleParticipantToggle(member.id)}
                  />
                  <label 
                    htmlFor={`participant-${member.id}`}
                    className="text-sm flex items-center gap-2 cursor-pointer"
                  >
                    {member.avatar && (
                      <img 
                        src={member.avatar} 
                        alt={member.name}
                        className="w-6 h-6 rounded-full"
                      />
                    )}
                    {member.name}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Methods */}
          <div>
            <Label className="flex items-center gap-2">
              <CheckSquare size={16} />
              Preferred payment methods
            </Label>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {paymentMethodOptions.map(method => (
                <div key={method.id} className="flex items-center gap-2">
                  <Checkbox
                    id={`payment-${method.id}`}
                    checked={selectedPaymentMethods.includes(method.id)}
                    onCheckedChange={() => handlePaymentMethodToggle(method.id)}
                  />
                  <label 
                    htmlFor={`payment-${method.id}`}
                    className="text-sm cursor-pointer flex items-center gap-1"
                  >
                    <span>{method.icon}</span>
                    {method.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-green-600 hover:bg-green-700 text-white"
            disabled={!amount || !description || selectedParticipants.length === 0}
          >
            Add Payment Request
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
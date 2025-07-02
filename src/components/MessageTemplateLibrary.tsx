import React, { useState } from 'react';
import { messageTemplates, MessageTemplate, getAllCategories } from '@/data/messageTemplates';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MessageTemplateLibraryProps {
  onTemplateSelect: (templateText: string, suggestedTone?: string) => void;
  // tripContext?: any; // Pass trip context if AI needs it directly here, though better if AI Composer handles fetching it based on tripId
}

const MessageTemplateLibrary: React.FC<MessageTemplateLibraryProps> = ({ onTemplateSelect }) => {
  const [selectedCategory, setSelectedCategory] = useState<MessageTemplate['category'] | 'All'>('All');
  const categories = ['All', ...getAllCategories()];

  const filteredTemplates = selectedCategory === 'All'
    ? messageTemplates
    : messageTemplates.filter(t => t.category === selectedCategory);

  const handleSelectTemplate = (template: MessageTemplate) => {
    onTemplateSelect(template.templateText, template.suggestedTone);
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-background text-foreground">
      <h3 className="text-lg font-semibold">Message Template Library</h3>

      <Select value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as any)}>
        <SelectTrigger className="w-[280px] mb-4">
          <SelectValue placeholder="Filter by category" />
        </SelectTrigger>
        <SelectContent>
          {categories.map(category => (
            <SelectItem key={category} value={category}>{category}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <ScrollArea className="h-[400px] pr-3">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.length > 0 ? filteredTemplates.map(template => (
            <Card key={template.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="text-base">{template.name}</CardTitle>
                <CardDescription className="text-xs">{template.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground italic whitespace-pre-line">
                  "{template.templateText.substring(0, 100)}{template.templateText.length > 100 ? '...' : ''}"
                </p>
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => handleSelectTemplate(template)}
                >
                  Use Template
                </Button>
              </CardFooter>
            </Card>
          )) : (
            <p className="col-span-full text-center text-muted-foreground">No templates found for this category.</p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default MessageTemplateLibrary;

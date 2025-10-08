import React, { useState } from 'react';
import { EventSetupData, IndustryTemplate, EventScheduleData } from '@/types';

interface EventScheduleSectionProps {
  eventData?: EventSetupData;
  onEventDataChange?: (data: EventSetupData) => void;
}

export const EventScheduleSection = ({ eventData = {}, onEventDataChange }: EventScheduleSectionProps) => {
  const [scheduleData, setScheduleData] = useState<EventScheduleData>({
    industry: eventData.industry || '',
    template: eventData.template || null,
    schedule: eventData.schedule || []
  });

  const handleIndustrySelect = (industry: string) => {
    const updated = { ...scheduleData, industry };
    setScheduleData(updated);
    onEventDataChange?.(updated);
  };

  const handleTemplateSelect = (template: IndustryTemplate) => {
    const updated = { ...scheduleData, template };
    setScheduleData(updated);
    onEventDataChange?.(updated);
  };

  const handleScheduleImport = (schedule: unknown[]) => {
    const updated = { ...scheduleData, schedule };
    setScheduleData(updated);
    onEventDataChange?.(updated);
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-bold text-white mb-2">Setup & Schedule</h3>
        <p className="text-gray-300">Configure your event schedule and choose from industry templates.</p>
      </div>

      <div className="space-y-8">
        <IndustryTemplates
          selectedIndustry={scheduleData.industry}
          onIndustrySelect={handleIndustrySelect}
          selectedTemplate={scheduleData.template}
          onTemplateSelect={handleTemplateSelect}
        />
        
        <ScheduleImporter
          onScheduleImport={handleScheduleImport}
          currentSchedule={scheduleData.schedule}
        />
      </div>
    </div>
  );
};
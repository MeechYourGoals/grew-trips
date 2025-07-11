import React, { useState } from 'react';
import { IndustryTemplates } from './IndustryTemplates';
import { ScheduleImporter } from './ScheduleImporter';

interface EventScheduleSectionProps {
  eventData?: any;
  onEventDataChange?: (data: any) => void;
}

export const EventScheduleSection = ({ eventData = {}, onEventDataChange }: EventScheduleSectionProps) => {
  const [scheduleData, setScheduleData] = useState({
    industry: eventData.industry || '',
    template: eventData.template || null,
    schedule: eventData.schedule || []
  });

  const handleIndustrySelect = (industry: string) => {
    const updated = { ...scheduleData, industry };
    setScheduleData(updated);
    onEventDataChange?.(updated);
  };

  const handleTemplateSelect = (template: any) => {
    const updated = { ...scheduleData, template };
    setScheduleData(updated);
    onEventDataChange?.(updated);
  };

  const handleScheduleImport = (schedule: any[]) => {
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
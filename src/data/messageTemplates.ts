export interface MessageTemplate {
  id: string;
  name: string;
  description: string;
  category: 'Sports Team' | 'Bachelorette Party' | 'Corporate Recruiting' | 'Vacation' | 'General Reminder';
  templateText: string; // With placeholders like {{eventName}}, {{location}}, {{dateTime}}, {{notes}}
  suggestedTone?: 'Friendly' | 'Direct' | 'Informative' | 'Professional' | 'Fun';
}

export const messageTemplates: MessageTemplate[] = [
  // Sports Team
  {
    id: 'sports-1',
    name: 'Game Day Reminder',
    description: 'Remind team about game day schedule.',
    category: 'Sports Team',
    templateText: "Hey team! Game day is here! 🏀\nGame: {{opponentName}} at {{location}}\nBus leaves: {{busTime}}\nPre-game meal: {{mealTime}} at {{mealLocation}}\nDon't forget: {{itemToBring}}\nLet's go {{teamName}}!",
    suggestedTone: 'Direct',
  },
  {
    id: 'sports-2',
    name: 'Practice Schedule Update',
    description: 'Inform about a change in practice schedule.',
    category: 'Sports Team',
    templateText: "Hi team, quick update on practice: Practice on {{date}} has been moved to {{newTime}} at {{newLocation}}. Please acknowledge. {{additionalNotes}}",
    suggestedTone: 'Informative',
  },
  // Bachelorette Party
  {
    id: 'bachelorette-1',
    name: 'Evening Plans',
    description: 'Outline the plans for the evening.',
    category: 'Bachelorette Party',
    templateText: "Hey ladies! ✨ Tonight's plan for {{brideName}}'s bachelorette:\nDinner: {{dinnerTime}} at {{dinnerLocation}}\nActivity: {{activityName}} at {{activityTime}}\nTheme/Dress Code: {{dressCode}}\nLet's make it amazing! 🥂 {{notes}}",
    suggestedTone: 'Fun',
  },
  {
    id: 'bachelorette-2',
    name: 'Morning After Brunch',
    description: 'Coordinate brunch for the morning after.',
    category: 'Bachelorette Party',
    templateText: "Morning beautiful people! ☀️ Hope everyone had fun last night! \nBrunch today is at {{brunchLocation}} at {{brunchTime}}. See you there! {{contributionNote}}",
    suggestedTone: 'Friendly',
  },
  // Corporate Recruiting
  {
    id: 'corp-1',
    name: 'Interview Schedule Reminder',
    description: 'Remind candidate about their interview schedule.',
    category: 'Corporate Recruiting',
    templateText: "Hi {{candidateName}},\nThis is a reminder for your interview with {{companyName}} for the {{positionName}} role.\nDate: {{interviewDate}}\nTime: {{interviewTime}} ({{timezone}})\nLocation/Link: {{interviewLocationOrLink}}\nInterviewer(s): {{interviewerNames}}\nPlease bring/prepare: {{preparationNotes}}\nWe look forward to speaking with you!",
    suggestedTone: 'Professional',
  },
  {
    id: 'corp-2',
    name: 'Campus Event Info',
    description: 'Information about a campus recruiting event.',
    category: 'Corporate Recruiting',
    templateText: "Hello from {{companyName}}! We're excited to be at {{campusName}} on {{eventDate}} for our {{eventName}}.\nFind us at {{eventLocation}} from {{startTime}} to {{endTime}}.\nCome learn about opportunities and chat with our team! {{linkToRegister}}",
    suggestedTone: 'Informative',
  },
  // Vacation
  {
    id: 'vacation-1',
    name: 'Daily Itinerary',
    description: 'Share the plan for the day during a group vacation.',
    category: 'Vacation',
    templateText: "Good morning adventurers! ☀️ Today's plan for {{tripName}}:\nMorning: {{morningActivity}} at {{morningTime}}\nLunch: {{lunchLocation}} around {{lunchTime}}\nAfternoon: {{afternoonActivity}} at {{afternoonTime}}\nNotes: {{notes}}",
    suggestedTone: 'Friendly',
  },
  // General Reminder
  {
    id: 'general-1',
    name: 'Simple Reminder',
    description: 'A general reminder template.',
    category: 'General Reminder',
    templateText: "Hi everyone, just a quick reminder about {{eventName}} on {{dateTime}} at {{location}}. Don't forget {{itemToBringOrAction}}. Thanks!",
    suggestedTone: 'Friendly',
  }
];

// Helper function to get templates, perhaps by category
export const getTemplatesByCategory = (category: MessageTemplate['category']): MessageTemplate[] => {
  return messageTemplates.filter(template => template.category === category);
};

export const getAllCategories = (): MessageTemplate['category'][] => {
  return Array.from(new Set(messageTemplates.map(t => t.category)));
};

// TODO: For AI processing, we'll need a way to identify placeholders (e.g., {{placeholderName}})
// and have the AI fill them based on available trip context (itinerary, participants, etc.)
// The AI prompt will need to be carefully crafted to instruct it to use the template
// and fill placeholders from the context of a specific trip.
// Example trip context to pass to AI:
// const tripContextExample = {
//   tripName: "Spring Break Cancun 2024",
//   currentDate: "2024-03-10",
//   eventsToday: [
//     { eventName: "Beach Volleyball", time: "2:00 PM", location: "Main Beach" },
//     { eventName: "Group Dinner", time: "7:00 PM", location: "El Patio Restaurant" }
//   ],
//   participants: ["Alice", "Bob", "Charlie"],
//   customFields: { opponentName: "The Sharks", teamName: "Our Eagles", itemToBring: "your A-game" }
// };

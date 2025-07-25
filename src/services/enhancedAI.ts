import { VertexAIService } from './vertexAIService';
import { CalendarEvent, AddToCalendarData } from '../types/calendar';

export interface AIConfidenceScore {
  score: number; // 0-1
  factors: string[];
  suggestions: string[];
}

export interface EnhancedAIResult {
  success: boolean;
  confidence: AIConfidenceScore;
  data?: any;
  error?: string;
  processingTime: number;
}

export interface PhotoMetadata {
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  timestamp: Date;
  camera?: string;
  tags: string[];
  faces?: number;
  activities: string[];
}

export interface SmartTodoItem {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  category: 'preparation' | 'booking' | 'packing' | 'logistics' | 'activity';
  confidence: number;
  sourceMessage?: string;
  assignee?: string;
}

export class EnhancedAIService {
  constructor() {
    // Using Vertex AI service instead of OpenAI
  }

  async detectCalendarEvents(text: string): Promise<EnhancedAIResult> {
    const startTime = Date.now();
    
    try {
      // Enhanced pattern matching with confidence scoring
      const patterns = [
        { pattern: /(\d{1,2}\/\d{1,2}\/\d{4}|\d{4}-\d{2}-\d{2})/g, weight: 0.8, factor: 'Date pattern' },
        { pattern: /(\d{1,2}:\d{2}\s?(AM|PM|am|pm)|\d{1,2}:\d{2})/g, weight: 0.7, factor: 'Time pattern' },
        { pattern: /(reservation|booking|confirmed|ticket|flight|hotel|restaurant|dinner|check-in|confirmation)/gi, weight: 0.9, factor: 'Booking keywords' },
        { pattern: /(at|@)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/g, weight: 0.6, factor: 'Location indicators' },
        { pattern: /(monday|tuesday|wednesday|thursday|friday|saturday|sunday)/gi, weight: 0.5, factor: 'Day of week' }
      ];

      const matches = patterns.map(({ pattern, weight, factor }) => ({
        matches: text.match(pattern) || [],
        weight,
        factor
      }));

      const totalMatches = matches.reduce((sum, m) => sum + m.matches.length, 0);
      const weightedScore = matches.reduce((sum, m) => sum + (m.matches.length * m.weight), 0) / Math.max(totalMatches, 1);

      const confidence: AIConfidenceScore = {
        score: Math.min(weightedScore / 2, 1), // Normalize to 0-1
        factors: matches.filter(m => m.matches.length > 0).map(m => m.factor),
        suggestions: this.generateSuggestions(matches)
      };

      if (confidence.score > 0.3) {
        // Extract potential event data
        const eventData = this.extractEventData(text, matches);
        
        return {
          success: true,
          confidence,
          data: eventData,
          processingTime: Date.now() - startTime
        };
      }

      return {
        success: false,
        confidence,
        error: 'Low confidence in calendar event detection',
        processingTime: Date.now() - startTime
      };

    } catch (error) {
      return {
        success: false,
        confidence: { score: 0, factors: [], suggestions: [] },
        error: error instanceof Error ? error.message : 'Unknown error',
        processingTime: Date.now() - startTime
      };
    }
  }

  async analyzePhoto(file: File): Promise<EnhancedAIResult> {
    const startTime = Date.now();
    
    try {
      // Extract EXIF data
      const exifData = await this.extractEXIFData(file);
      
      // Analyze image content (this would use Google Vision API or similar)
      const imageAnalysis = await this.analyzeImageContent(file);
      
      const metadata: PhotoMetadata = {
        timestamp: new Date(file.lastModified),
        tags: this.generatePhotoTags(imageAnalysis),
        activities: this.detectActivities(imageAnalysis),
        ...exifData,
        ...imageAnalysis
      };

      const confidence: AIConfidenceScore = {
        score: 0.8, // Mock confidence
        factors: ['EXIF data available', 'Clear image quality', 'Recognizable objects'],
        suggestions: ['Consider adding location tags', 'Group similar photos']
      };

      return {
        success: true,
        confidence,
        data: metadata,
        processingTime: Date.now() - startTime
      };

    } catch (error) {
      return {
        success: false,
        confidence: { score: 0, factors: [], suggestions: [] },
        error: error instanceof Error ? error.message : 'Photo analysis failed',
        processingTime: Date.now() - startTime
      };
    }
  }

  async generateSmartTodos(messages: string[]): Promise<EnhancedAIResult> {
    const startTime = Date.now();
    
    try {
      const todos: SmartTodoItem[] = [];
      
      for (const message of messages) {
        const extractedTodos = await this.extractTodosFromMessage(message);
        todos.push(...extractedTodos);
      }

      const confidence: AIConfidenceScore = {
        score: todos.length > 0 ? 0.7 : 0.2,
        factors: ['Action verb detection', 'Deadline extraction', 'Priority assessment'],
        suggestions: ['Review generated tasks', 'Assign team members']
      };

      return {
        success: true,
        confidence,
        data: todos,
        processingTime: Date.now() - startTime
      };

    } catch (error) {
      return {
        success: false,
        confidence: { score: 0, factors: [], suggestions: [] },
        error: error instanceof Error ? error.message : 'Todo generation failed',
        processingTime: Date.now() - startTime
      };
    }
  }

  private extractEXIFData(file: File): Promise<Partial<PhotoMetadata>> {
    return new Promise((resolve) => {
      // This would use an EXIF library like piexifjs
      // For now, returning mock data
      resolve({
        timestamp: new Date(file.lastModified),
        camera: 'iPhone 14 Pro',
        location: {
          latitude: 37.7749,
          longitude: -122.4194,
          address: 'San Francisco, CA'
        }
      });
    });
  }

  private async analyzeImageContent(file: File): Promise<Partial<PhotoMetadata>> {
    // This would use Google Vision API or similar
    // For now, returning mock analysis
    return {
      faces: Math.floor(Math.random() * 5),
      activities: ['dining', 'sightseeing', 'group photo']
    };
  }

  private generatePhotoTags(analysis: Partial<PhotoMetadata>): string[] {
    const tags = ['travel', 'trip'];
    
    if (analysis.faces && analysis.faces > 0) {
      tags.push('group', 'people');
    }
    
    if (analysis.activities) {
      tags.push(...analysis.activities);
    }
    
    return tags;
  }

  private detectActivities(analysis: Partial<PhotoMetadata>): string[] {
    return analysis.activities || [];
  }

  private extractEventData(text: string, matches: any[]): AddToCalendarData {
    // Extract basic event information
    const dateMatch = text.match(/(\d{1,2}\/\d{1,2}\/\d{4}|\d{4}-\d{2}-\d{2})/);
    const timeMatch = text.match(/(\d{1,2}:\d{2}\s?(AM|PM|am|pm)|\d{1,2}:\d{2})/);
    const locationMatch = text.match(/(at|@)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/);
    
    const date = dateMatch ? new Date(dateMatch[0]) : new Date();
    const time = timeMatch ? timeMatch[0] : '12:00 PM';
    const location = locationMatch ? locationMatch[2] : undefined;
    
    return {
      title: this.extractTitle(text),
      date,
      time,
      location,
      description: text.slice(0, 200),
      category: this.determineCategory(text),
      include_in_itinerary: true
    };
  }

  private extractTitle(text: string): string {
    // Extract a meaningful title from the text
    const sentences = text.split('.').filter(s => s.trim().length > 0);
    return sentences[0]?.trim().slice(0, 50) || 'Calendar Event';
  }

  private determineCategory(text: string): AddToCalendarData['category'] {
    const lower = text.toLowerCase();
    
    if (lower.includes('hotel') || lower.includes('check-in') || lower.includes('room')) {
      return 'lodging';
    }
    if (lower.includes('flight') || lower.includes('uber') || lower.includes('train')) {
      return 'transportation';
    }
    if (lower.includes('restaurant') || lower.includes('dinner') || lower.includes('lunch')) {
      return 'dining';
    }
    if (lower.includes('show') || lower.includes('concert') || lower.includes('theater')) {
      return 'entertainment';
    }
    
    return 'activity';
  }

  private generateSuggestions(matches: any[]): string[] {
    const suggestions = [];
    
    if (matches.some(m => m.factor === 'Date pattern' && m.matches.length > 0)) {
      suggestions.push('Date detected - consider adding to calendar');
    }
    if (matches.some(m => m.factor === 'Time pattern' && m.matches.length > 0)) {
      suggestions.push('Time specified - set reminder');
    }
    if (matches.some(m => m.factor === 'Location indicators' && m.matches.length > 0)) {
      suggestions.push('Location mentioned - add to map');
    }
    
    return suggestions;
  }

  private async extractTodosFromMessage(message: string): Promise<SmartTodoItem[]> {
    const todos: SmartTodoItem[] = [];
    
    // Action word patterns
    const actionPatterns = [
      { pattern: /need to (.+)/gi, priority: 'medium' as const },
      { pattern: /don't forget to (.+)/gi, priority: 'high' as const },
      { pattern: /remember to (.+)/gi, priority: 'medium' as const },
      { pattern: /should (.+)/gi, priority: 'low' as const },
      { pattern: /must (.+)/gi, priority: 'high' as const }
    ];

    for (const { pattern, priority } of actionPatterns) {
      const matches = message.match(pattern);
      if (matches) {
        for (const match of matches) {
          const task = match.replace(pattern, '$1').trim();
          if (task.length > 3) {
            todos.push({
              id: `todo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              title: task.charAt(0).toUpperCase() + task.slice(1),
              description: `Generated from: "${message.slice(0, 100)}..."`,
              priority,
              category: this.categorizeTodo(task),
              confidence: 0.7,
              sourceMessage: message
            });
          }
        }
      }
    }

    return todos;
  }

  private categorizeTodo(task: string): SmartTodoItem['category'] {
    const lower = task.toLowerCase();
    
    if (lower.includes('book') || lower.includes('reserve') || lower.includes('confirm')) {
      return 'booking';
    }
    if (lower.includes('pack') || lower.includes('bring') || lower.includes('take')) {
      return 'packing';
    }
    if (lower.includes('check-in') || lower.includes('arrive') || lower.includes('depart')) {
      return 'logistics';
    }
    if (lower.includes('prepare') || lower.includes('get ready') || lower.includes('setup')) {
      return 'preparation';
    }
    
    return 'activity';
  }
}

export const enhancedAI = new EnhancedAIService();
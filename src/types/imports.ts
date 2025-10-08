// Smart Import & Bulk Upload Types

export interface ImportSource {
  id: string;
  name: string;
  icon: string;
  type: 'file' | 'link' | 'email' | 'calendar';
  description: string;
  supported: boolean;
}

export interface ParsedItineraryItem {
  id: string;
  title: string;
  date: string;
  time?: string;
  location?: string;
  description?: string;
  category?: string;
  confidence: number;
}

export interface ParsedFile {
  filename: string;
  type: string;
  items: ParsedItineraryItem[];
  summary?: string;
  rawText?: string;
}

export interface BulkUploadProgress {
  total: number;
  completed: number;
  failed: number;
  current?: string;
}

export interface UploadedFile {
  file: File;
  preview?: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
  parsed?: ParsedFile;
}

export interface SmartImportResult {
  success: boolean;
  itemsImported: number;
  errors?: string[];
  parsed?: ParsedFile;
}

export interface EmailImportConfig {
  provider: 'gmail' | 'outlook' | 'apple';
  folderPath?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface CalendarImportConfig {
  provider: 'google' | 'apple' | 'outlook';
  calendarId?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

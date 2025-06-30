
import React from 'react';
import { FileText, Download } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface AudioTranscriptProps {
  summary: string;
}

export const AudioTranscript = ({ summary }: AudioTranscriptProps) => {
  return (
    <Card className="bg-gray-900 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <FileText size={20} />
          Full Transcript
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="prose prose-invert max-w-none">
          <p className="text-gray-300 leading-relaxed">
            {summary}
          </p>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-700">
          <Button variant="outline" className="border-gray-600 text-gray-300">
            <Download size={16} className="mr-2" />
            Download Transcript
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

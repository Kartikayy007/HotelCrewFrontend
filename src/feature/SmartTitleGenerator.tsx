import React, { useState, useEffect } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { Tooltip, IconButton } from '@mui/material';
import { Wand2, AlertCircle } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface SmartTitleGeneratorProps {
  description: string;
  onTitleGenerated: (title: string) => void;
  disabled?: boolean;
}

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

const SmartTitleGenerator: React.FC<SmartTitleGeneratorProps> = ({
  description,
  onTitleGenerated,
  disabled = false
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateTitle = async (text: string) => {
    if (!text.trim() || disabled) return;
    
    setIsGenerating(true);
    setError(null);

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      
      const prompt = `Create a short title for this hotel task: "${text}"\n\nRules:
      - Maximum 5 words
      - Start with action verb
      - Use hotel terminology
      - Be specific and clear
      - No punctuation
      - Match language style of description
      Return only the title.`;

      const result = await model.generateContent(prompt);
      const title = result.response.text().trim();
      
      if (!title) {
        throw new Error('No title generated');
      }

      onTitleGenerated(title);
      setError(null);
    } catch (error) {
      console.error('Title generation error:', error);
      setError('Failed to generate title');
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (description.trim().length > 5) {
        generateTitle(description);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [description]);

  return (
    <div className="relative">
      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2 -mt-0 mr-1">
        {isGenerating ? (
          <div className="flex items-center gap-2">
            <CircularProgress size={16} />
          </div>
        ) : (
          <IconButton 
            onClick={() => generateTitle(description)}
            disabled={disabled || !description.trim()}
            size="small"
            className="hover:bg-gray-100"
          >
            <Wand2 className="w-4 h-4" />
          </IconButton>
        )}

        {error && (
          <Tooltip title={error} placement="top">
            <AlertCircle className="text-red-500 w-4 h-4" />
          </Tooltip>
        )}
      </div>
    </div>
  );
};

export default SmartTitleGenerator;
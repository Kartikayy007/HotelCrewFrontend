import React, { useState, useRef, useCallback, useMemo } from 'react';
import debounce from 'lodash/debounce';
import { commonPhrases, contextualPhrases } from './hotelPhrases';

interface PredictiveTextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

interface WeightedSuggestion {
  phrase: string;
  score: number;
  contextMatch: number;
  frequency: number;
  similarity: number;
  priority?: number;
  timeRelevance?: number;
  sentenceRelevance?: number; 
  chainProbability?: number; 
}

const MIN_SCORE_THRESHOLD = 0.3;
const DEBOUNCE_DELAY = 150;

const SENTENCE_STARTERS = [
  'please', 'kindly', 'urgent', 'need to', 'requires', 'requesting',
  'immediately', 'attention', 'priority', 'important'
];

const SENTENCE_ENDERS = [
  'immediately', 'asap', 'right away', 'now', 'today',
  'by tonight', 'by tomorrow', 'urgent'
];

const getTimeBasedScore = (): number => {
  const hour = new Date().getHours();
  if (hour >= 22 || hour < 6) return 0.15;  
  if (hour >= 6 && hour < 14) return 0.1; 
  return 0.05; 
};

const getPriorityScore = (phrase: string): number => {
  const priorityTerms = ['urgent', 'immediate', 'emergency', 'critical', 'priority'];
  return priorityTerms.some(term => phrase.toLowerCase().includes(term)) ? 0.2 : 0;
};

const getSentencePosition = (input: string): number => {
  const lastChar = input.trim().slice(-1);
  const isStartOfSentence = lastChar === '.' || input.trim() === '';
  const words = input.trim().split(/\s+/);
  const lastWord = words[words.length - 1].toLowerCase();
  
  if (isStartOfSentence && SENTENCE_STARTERS.includes(lastWord)) {
    return 0.2;
  }
  if (words.length > 3 && SENTENCE_ENDERS.some(end => input.toLowerCase().includes(end))) {
    return 0.1;
  }
  return 0;
};

const getPhraseChainProbability = (phrase: string, history: string[]): number => {
  if (history.length < 2) return 0;
  
  const lastContextWords = history.slice(-2).join(' ').toLowerCase();
  const commonFollowUps = {
    'please check': ['room', 'status', 'immediately'],
    'urgent attention': ['required', 'needed', 'maintenance'],
    'need to': ['verify', 'inspect', 'clean', 'prepare'],
  };

  for (const [context, followUps] of Object.entries(commonFollowUps)) {
    if (lastContextWords.includes(context)) {
      return followUps.some(word => phrase.toLowerCase().includes(word)) ? 0.15 : 0;
    }
  }
  return 0;
};

const CONTEXT_WEIGHTS = {
  sentencePosition: 0.25,
  timeContext: 0.15,
  phraseChain: 0.20,
  departmentContext: 0.20,
  urgencyLevel: 0.20
};

const getDepartmentContext = (text: string): string => {
  const deptKeywords = {
    housekeeping: ['clean', 'room', 'linen', 'bathroom', 'amenities'],
    frontdesk: ['check-in', 'checkout', 'guest', 'booking', 'reservation'],
    maintenance: ['repair', 'fix', 'broken', 'maintenance', 'issue'],
    fnb: ['restaurant', 'kitchen', 'food', 'beverage', 'dining'],
    security: ['safety', 'emergency', 'security', 'incident', 'guard']
  };

  for (const [dept, keywords] of Object.entries(deptKeywords)) {
    if (keywords.some(k => text.toLowerCase().includes(k))) {
      return dept;
    }
  }
  return '';
};

const QUICK_SUGGESTIONS = {
  
  'ac': 'access',
  'al': 'alarm',
  'am': 'amenities',
  'ap': 'appointment',
  'ne': 'need',
  'ar': 'arrival',
  'as': 'assign',
  'at': 'attention',
  'av': 'available',
  'ba': 'bathroom',
  'be': 'bedding',
  'bi': 'billing',
  'bo': 'booking',
  'br': 'breakfast',
  'bu': 'business',
  'ca': 'cancel',
  'ce': 'center',
  'ch': 'check',
  'cl': 'clean',
  'co': 'confirm',
  'de': 'deliver',
  'di': 'dinner',
  'do': 'document',
  'dr': 'drink',
  'du': 'duty',
  'el': 'elevator',
  'em': 'emergency',
  'eq': 'equipment',
  'ev': 'event',
  'ex': 'express',
  'fa': 'facility',
  'fe': 'feedback',
  'fi': 'fitness',
  'fl': 'floor',
  'fo': 'food',
  'fr': 'front',
  'fu': 'furniture',
  'ge': 'general',
  'gu': 'guest',
  'gy': 'gym',
  'he': 'health',
  'ho': 'housekeeping',
  'hy': 'hygiene',
  'id': 'identify',
  'in': 'inspect',
  'is': 'issue',
  'it': 'item',
  'ke': 'key',
  'ki': 'kitchen',
  'la': 'laundry',
  'li': 'linen',
  'lo': 'lobby',
  'lu': 'lunch',
  'ma': 'maintenance',
  'me': 'meeting',
  'mi': 'minibar',
  'mo': 'monitor',
  'no': 'notify',
  'nu': 'number',
  'op': 'operation',
  'or': 'order',
  'pa': 'parking',
  'ph': 'phone',
  'pi': 'pillow',
  'po': 'pool',
  'pr': 'prepare',
  'qu': 'quick',
  're': 'request',
  'ro': 'room',
  'sa': 'safety',
  'sc': 'schedule',
  'se': 'service',
  'sh': 'shift',
  'si': 'sign',
  'sp': 'special',
  'st': 'staff',
  'su': 'supply',
  'ta': 'task',
  'te': 'test',
  'ti': 'time',
  'tr': 'transfer',
  'up': 'update',
  'ur': 'urgent',
  'va': 'vacant',
  've': 'verify',
  'vi': 'vip',
  'wa': 'water',
  'wi': 'wifi',
  'wo': 'work',
  'Kar': 'Kartikay',
  'acc': 'access',
  'ala': 'alarm',
  'ame': 'amenities',
  'app': 'appointment',
  'arr': 'arrival',
  'ass': 'assign',
  'nea': 'near',
  'att': 'attention',
  'ava': 'available',
  'bat': 'bathroom',
  'bil': 'billing',
  'boo': 'booking',
  'bre': 'breakfast',
  'bus': 'business',
  'can': 'cancel',
  'cen': 'center',
  'che': 'check',
  'cle': 'clean',
  'con': 'confirm',
  'del': 'deliver',
  'din': 'dinner',
  'doc': 'document',
  'dri': 'drink',
  'dut': 'duty',
  'ele': 'elevator',
  'eme': 'emergency',
  'equ': 'equipment',
  'eve': 'event',
  'exp': 'express',
  'fac': 'facility',
  'fee': 'feedback',
  'fit': 'fitness',
  'flo': 'floor',
  'foo': 'food',
  'fro': 'front',
  'fur': 'furniture',
  'gen': 'general',
  'gue': 'guest',
  'gym': 'gym',
  'hea': 'health',
  'hou': 'housekeeping',
  'hyg': 'hygiene',
  'ide': 'identify',
  'ins': 'inspect',
  'iss': 'issue',
  'ite': 'item',
  'key': 'key',
  'kit': 'kitchen',
  'lau': 'laundry',
  'lin': 'linen',
  'lob': 'lobby',
  'lun': 'lunch',
  'mai': 'maintenance',
  'mee': 'meeting',
  'min': 'minibar',
  'mon': 'monitor',
  'not': 'notify',
  'num': 'number',
  'ope': 'operation',
  'ord': 'order',
  'par': 'parking',
  'pho': 'phone',
  'pil': 'pillow',
  'poo': 'pool',
  'pre': 'prepare',
  'qui': 'quick',
  'req': 'request',
  'roo': 'room',
  'saf': 'safety',
  'sch': 'schedule',
  'ser': 'service',
  'shi': 'shift',
  'sig': 'sign',
  'spe': 'special',
  'sta': 'staff',
  'sup': 'supply',
  'tas': 'task',
  'tes': 'test',
  'tim': 'time',
  'tow': 'towel',
  'tra': 'transfer',
  'upd': 'update',
  'urg': 'urgent',
  'vac': 'vacant',
  'ver': 'verify',
  'vip': 'vip',
  'wat': 'water',
  'wif': 'wifi',
  'wor': 'work'
};

const SCORING_WEIGHTS = {
  exactMatch: 0.4,
  contextRelevance: 0.3,
  timeContext: 0.15,
  departmentAlignment: 0.15,
  sentencePosition: 0.1,
  priority: 0.2,
  phraseChain: 0.15
};

const ScoringSystem = {
  calculateScore: (phrase: string, input: string, context: string[]): number => {
    let score = 0;
    const words = input.trim().toLowerCase().split(/\s+/);
    const lastWord = words[words.length - 1];

    if (phrase.toLowerCase().startsWith(lastWord)) {
      score += SCORING_WEIGHTS.exactMatch;
    }

    score += getTimeBasedScore() * SCORING_WEIGHTS.timeContext;

    score += getPriorityScore(phrase) * SCORING_WEIGHTS.priority;

    score += getSentencePosition(input) * SCORING_WEIGHTS.sentencePosition;

    score += getPhraseChainProbability(phrase, context) * SCORING_WEIGHTS.phraseChain;

    const department = getDepartmentContext(input);
    if (department && phrase.toLowerCase().includes(department)) {
      score += SCORING_WEIGHTS.departmentAlignment;
    }

    return score;
  },

  generateSuggestions: (input: string, contextHistory: string[]): string[] => {
    const suggestions: Array<{phrase: string, score: number}> = [];

    Object.values(commonPhrases).forEach(phraseSet => {
      phraseSet.forEach(phrase => {
        const score = ScoringSystem.calculateScore(phrase, input, contextHistory);
        if (score > MIN_SCORE_THRESHOLD) {
          suggestions.push({ phrase, score });
        }
      });
    });

    return suggestions
      .sort((a, b) => b.score - a.score)
      .map(s => s.phrase);
  }
};

const PredictiveTextArea: React.FC<PredictiveTextAreaProps> = ({ value, onChange, ...props }) => {
  const [suggestion, setSuggestion] = useState<string>('');
  const [contextHistory, setContextHistory] = useState<string[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const getSuggestion = useCallback((text: string): string => {
    const words = text.trim().split(/\s+/);
    const lastWord = words[words.length - 1].toLowerCase();
    
    if (!lastWord || lastWord.length < 2) return '';

    if (lastWord.length <= 3 && QUICK_SUGGESTIONS[lastWord]) {
      return QUICK_SUGGESTIONS[lastWord];
    }

    const suggestions = ScoringSystem.generateSuggestions(text, contextHistory);
    return suggestions.length > 0 ? suggestions[0] : '';
  }, [contextHistory]);

  const debouncedGetSuggestion = useMemo(
    () => debounce((text: string) => {
      const newSuggestion = getSuggestion(text);
      setSuggestion(newSuggestion);
    }, DEBOUNCE_DELAY),
    [getSuggestion]
  );

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e);
    const words = e.target.value.trim().split(/\s+/);
    setContextHistory(words.slice(-5));
    debouncedGetSuggestion(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab' && suggestion) {
      e.preventDefault();
      const words = value.split(' ');
      const lastWord = words[words.length - 1];
      
      const isQuickSuggestion = lastWord.length <= 3 && QUICK_SUGGESTIONS[lastWord];
      
      const completion = suggestion.startsWith(lastWord) 
        ? suggestion.slice(lastWord.length) 
        : suggestion;
      
      const newValue = value.slice(0, value.length - lastWord.length) + 
        suggestion + 
        (!isQuickSuggestion ? ' ' : '');
      
      onChange({
        target: { value: newValue }
      } as React.ChangeEvent<HTMLTextAreaElement>);
      
      setSuggestion('');
    }
  };

  const getRemainingSuggestion = (value: string, fullSuggestion: string) => {
    const lastWord = value.split(/\s/).pop() || '';
    if (!fullSuggestion.startsWith(lastWord)) return fullSuggestion;
    return fullSuggestion.slice(lastWord.length);
  };

   return (
    <div className="relative w-full group">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        aria-label={props['aria-label'] || "Text input with predictions"}
        {...props}
        className={`w-full relative font-inherit ${props.className || ''}`}
      />
      {suggestion && (
        <>
          <div 
            className="absolute pointer-events-none -z-0 animate-fade-in"
            aria-hidden="true"
            style={{
              left: textareaRef.current?.scrollLeft || 0,
              top: textareaRef.current?.scrollTop || 0,
              padding: textareaRef.current ? 
                getComputedStyle(textareaRef.current).padding : '8px',
              font: textareaRef.current ? 
                getComputedStyle(textareaRef.current).font : 'inherit',
              lineHeight: textareaRef.current ? 
                getComputedStyle(textareaRef.current).lineHeight : 'inherit',
            }}
          >
            <span className="invisible whitespace-pre-wrap">{value}</span>
            <span className="text-gray-400 backdrop-blur-[1px] ">
              {getRemainingSuggestion(value, suggestion)}
            </span>
          </div>
          <div 
            className="absolute right-3 bottom-3 text-xs  
              px-2 py-1 rounded text-gray-500 opacity-0 group-hover:opacity-100 
              transition-opacity duration-200"
            aria-hidden="true"
          >
            Press Tab ↹
          </div>
        </>
      )}
    </div>
  );
};

export default PredictiveTextArea
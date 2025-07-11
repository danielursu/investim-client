import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { QuizOption, QuizQuestionData } from '@/types';

// Types now imported from shared types

interface RiskQuizQuestionProps {
  question: QuizQuestionData;
  onAnswerSelect: (questionId: number, answerValue: string) => void;
  isUser?: boolean; // To potentially style user vs bot questions differently if needed
}

export function RiskQuizQuestion({ question, onAnswerSelect, isUser = false }: RiskQuizQuestionProps) {
  const [selectedValue, setSelectedValue] = React.useState<string>('');

  const handleValueChange = (value: string) => {
    if (selectedValue) return; // Prevent multiple selections
    
    setSelectedValue(value);
    
    // Use setTimeout to ensure state is updated before calling onAnswerSelect
    setTimeout(() => {
      onAnswerSelect(question.id, value);
    }, 50);
  };

  return (
    <div
      className={cn(
        'flex w-max max-w-[75%] flex-col gap-2 rounded-xl px-4 py-3 text-sm shadow-sm border',
        isUser
          ? 'ml-auto bg-primary text-primary-foreground'
          : 'bg-white border-emerald-200',
        'mb-4' // Add margin bottom for spacing between questions
      )}
    >
      <p className="font-semibold mb-3 text-gray-900 leading-relaxed">{question.text}</p>
      <RadioGroup
        value={selectedValue}
        onValueChange={handleValueChange}
        className="gap-3"
        // Disable after selection to prevent re-answering
        disabled={!!selectedValue}
      >
        {question.options.map((option) => (
          <div key={option.value} className="flex items-center space-x-3">
            <RadioGroupItem 
              value={option.value} 
              id={`${question.id}-${option.value}`}
              className="border-emerald-600 text-emerald-600 focus-visible:ring-emerald-500"
            />
            <Label htmlFor={`${question.id}-${option.value}`} className="cursor-pointer text-gray-700 leading-relaxed font-medium">
              {option.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}

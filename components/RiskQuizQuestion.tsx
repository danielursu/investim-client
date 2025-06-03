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
    setSelectedValue(value);
    // Automatically submit answer on selection for simplicity
    onAnswerSelect(question.id, value);
  };

  return (
    <div
      className={cn(
        'flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm',
        isUser
          ? 'ml-auto bg-primary text-primary-foreground'
          : 'bg-muted',
        'mb-4' // Add margin bottom for spacing between questions
      )}
    >
      <p className="font-semibold mb-2">{question.text}</p>
      <RadioGroup
        value={selectedValue}
        onValueChange={handleValueChange}
        className="gap-2"
        // Disable after selection to prevent re-answering
        disabled={!!selectedValue}
      >
        {question.options.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <RadioGroupItem value={option.value} id={`${question.id}-${option.value}`} />
            <Label htmlFor={`${question.id}-${option.value}`} className="cursor-pointer">
              {option.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}

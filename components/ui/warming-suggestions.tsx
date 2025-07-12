"use client"

import React, { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PromptSuggestion } from './prompt-suggestion'
import { promptSuggestions } from '@/data/promptSuggestions'
import { Sparkles, TrendingUp, DollarSign, Target } from 'lucide-react'

interface WarmingSuggestionsProps {
  isVisible: boolean
  onSelectSuggestion: (suggestion: string) => void
}

const categoryIcons = {
  'Getting Started': <Sparkles className="w-4 h-4" />,
  'Investment Basics': <TrendingUp className="w-4 h-4" />,
  'Risk & Returns': <DollarSign className="w-4 h-4" />,
  'Goal Planning': <Target className="w-4 h-4" />
}

export const WarmingSuggestions: React.FC<WarmingSuggestionsProps> = ({
  isVisible,
  onSelectSuggestion
}) => {
  // Get a random selection of suggestions from different categories
  const selectedSuggestions = useMemo(() => {
    const categories = ['Getting Started', 'Investment Basics', 'Risk & Returns', 'Goal Planning'];
    const selected: typeof promptSuggestions = [];
    
    categories.forEach(category => {
      const categorySuggestions = promptSuggestions
        .filter(s => s.category === category)
        .sort((a, b) => a.priority - b.priority);
      
      if (categorySuggestions.length > 0) {
        selected.push(categorySuggestions[0]);
      }
    });
    
    return selected;
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="space-y-3"
        >
          <div className="text-center mb-4">
            <h3 className="text-sm font-medium text-gray-700">
              While we&apos;re getting ready, here are some popular questions:
            </h3>
          </div>
          
          <div className="grid gap-2">
            {selectedSuggestions.map((suggestion, index) => (
              <motion.div
                key={suggestion.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * (index + 1) }}
              >
                <button
                  onClick={() => onSelectSuggestion(suggestion.text)}
                  className="w-full text-left p-3 rounded-lg bg-gray-50 hover:bg-gray-100 
                           border border-gray-200 hover:border-emerald-300 transition-all
                           group flex items-center gap-3"
                >
                  <span className="text-emerald-600 group-hover:text-emerald-700">
                    {categoryIcons[suggestion.category as keyof typeof categoryIcons]}
                  </span>
                  <span className="text-sm text-gray-700 group-hover:text-gray-900">
                    {suggestion.text}
                  </span>
                </button>
              </motion.div>
            ))}
          </div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.5 }}
            className="text-center"
          >
            <p className="text-xs text-gray-500">
              Click any question to save it for when the assistant is ready
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
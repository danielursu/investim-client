"use client"

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { WarmingStatus } from '@/lib/api/rag'
import { 
  Loader2, 
  Server, 
  Wifi, 
  Database, 
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react'

interface WarmingProgressProps {
  status?: WarmingStatus
  isVisible: boolean
}

const stageIcons = {
  initializing: <Sparkles className="w-5 h-5" />,
  connecting: <Wifi className="w-5 h-5" />,
  loading: <Database className="w-5 h-5" />,
  ready: <CheckCircle2 className="w-5 h-5" />
}

const stageColors = {
  initializing: 'text-blue-600 bg-blue-50 border-blue-200',
  connecting: 'text-amber-600 bg-amber-50 border-amber-200',
  loading: 'text-purple-600 bg-purple-50 border-purple-200',
  ready: 'text-emerald-600 bg-emerald-50 border-emerald-200'
}

export const WarmingProgress: React.FC<WarmingProgressProps> = ({ 
  status, 
  isVisible 
}) => {
  const currentStage = status?.stage || 'initializing'
  const progress = status?.progress || 0
  const message = status?.message || 'Starting AI assistant...'
  const estimatedTime = status?.estimatedTime
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="mb-4"
        >
          <div className={`rounded-2xl px-4 py-3 shadow-sm border ${stageColors[currentStage]}`}>
            {/* Header with icon and message */}
            <div className="flex items-center gap-3 mb-3">
              <div className="flex-shrink-0">
                {currentStage === 'ready' ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    {stageIcons[currentStage]}
                  </motion.div>
                ) : (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    {stageIcons[currentStage]}
                  </motion.div>
                )}
              </div>
              
              <div className="flex-1">
                <p className="text-sm font-medium">{message}</p>
                {estimatedTime && estimatedTime > 0 && (
                  <p className="text-xs opacity-75 flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3" />
                    About {estimatedTime} seconds remaining
                  </p>
                )}
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
            
            {/* Stage indicators */}
            <div className="flex justify-between mt-2 text-xs">
              <span className={currentStage === 'initializing' ? 'font-semibold' : 'opacity-50'}>
                Initialize
              </span>
              <span className={currentStage === 'connecting' ? 'font-semibold' : 'opacity-50'}>
                Connect
              </span>
              <span className={currentStage === 'loading' ? 'font-semibold' : 'opacity-50'}>
                Load
              </span>
              <span className={currentStage === 'ready' ? 'font-semibold' : 'opacity-50'}>
                Ready
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
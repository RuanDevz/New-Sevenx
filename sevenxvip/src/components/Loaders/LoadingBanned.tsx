import { AlertTriangle } from 'lucide-react'
import React from 'react'

const LoadingBanned = () => {
  return (
                  <div className="flex items-center justify-center py-20">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-red-500/20 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 border-4 border-transparent border-t-red-500 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-red-500 animate-pulse" />
                  </div>
                </div>
              </div>
  )
}

export default LoadingBanned
import React from 'react'

const LoadingWestern = () => {
  return (
      <div className="flex items-center justify-center py-20">
    <div className="relative">
      <div className="w-16 h-16 border-4 border-orange-500/20 rounded-full animate-spin"></div>
      <div className="absolute inset-0 border-4 border-transparent border-t-orange-500 rounded-full animate-spin"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <i className="fa-solid fa-spinner text-orange-500 animate-spin text-xl"></i>
      </div>
    </div>
  </div>
  )
}

export default LoadingWestern
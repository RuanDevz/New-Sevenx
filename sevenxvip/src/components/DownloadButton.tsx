import React from 'react';
import { ExternalLink } from 'lucide-react';

interface DownloadButtonProps {
  url?: string;
  fallbackUrl?: string;
  label: string;
  subtitle?: string; // ✅ NOVO
  bgColor: string;
  hoverColor: string;
  shadowColor: string;
  textColor: string;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({
  url,
  fallbackUrl,
  label,
  subtitle,
  bgColor,
  hoverColor,
  shadowColor,
  textColor,
}) => {
  const finalUrl = url || fallbackUrl;
  if (!finalUrl) return null;

  return (
    <a
      href={finalUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex flex-col items-center justify-center gap-1 px-3 sm:px-6 py-3 sm:py-4 rounded-lg sm:rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg ${textColor} bg-gradient-to-r ${bgColor} ${hoverColor} ${shadowColor} text-center`}
    >
      {/* Label */}
      <div className="flex items-center gap-2">
        <span className="text-sm sm:text-base">{label}</span>
        <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
      </div>

      {/* Subtitle */}
      {subtitle && (
        <span className="text-[10px] sm:text-xs font-medium opacity-80">
          {subtitle}
        </span>
      )}
    </a>
  );
};

export default DownloadButton;

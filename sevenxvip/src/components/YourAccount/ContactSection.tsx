import React from "react";
import { Mail, MessageSquare, Phone, ExternalLink } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";

const ContactSection: React.FC = () => {
  return (
    <div className="bg-gray-800/60 backdrop-blur-xl border border-gray-700 rounded-2xl overflow-hidden shadow-xl">
      <div className="bg-gradient-to-r from-gray-800/80 to-gray-900/80 px-6 py-4 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
            <MessageSquare className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white font-orbitron">Contact Information</h3>
            <p className="text-sm text-gray-400">Get help and support</p>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="space-y-4">
          <div className="p-4 bg-gray-700/50 rounded-xl border border-gray-600/30">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Mail className="text-purple-400 w-4 h-4" />
              </div>
              <h4 className="font-medium text-white">Customer Support</h4>
            </div>
            <a 
              href="mailto:support@sevenxleaks.com" 
              className="flex items-center gap-1 text-sm text-purple-400 hover:text-purple-300 transition-colors"
            >
              https://discord.gg/Ec4zzTbsWs
              <ExternalLink size={12} className="ml-1" />
            </a>
          </div>
          
          <div className="p-4 bg-gray-700/50 rounded-xl border border-gray-600/30">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center">
                <Mail className="text-red-400 w-4 h-4" />
              </div>
              <h4 className="font-medium text-white">DMCA Requests</h4>
            </div>
            <a 
              href="mailto:DMCA@sevenxleaks.com" 
              className="flex items-center gap-1 text-sm text-red-400 hover:text-red-300 transition-colors"
            >
              DMCA@sevenxleaks.com
              <ExternalLink size={12} className="ml-1" />
            </a>
          </div>
        
        </div>
        
        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
          <p className="text-sm text-blue-400">
            Our support team typically responds within 24 hours. VIP members receive priority support.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;
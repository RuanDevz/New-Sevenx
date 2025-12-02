import React, { useState } from "react";
import { Settings, Download, Trash2, LogOut, Shield, AlertTriangle } from "lucide-react";
import { Userdatatypes } from "../../../types/Userdatatypes";
import { useTheme } from "../../contexts/ThemeContext";
import ChangePasswordModal from "./modals/ChangePasswordModal";
import DeleteAccountModal from "./modals/DeleteAccountModal";
import { motion } from "framer-motion";


interface AccountOptionsSectionProps {
  userData: Userdatatypes;
}

const AccountOptionsSection: React.FC<AccountOptionsSectionProps> = ({ userData }) => {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleSignout = () => {
    localStorage.removeItem('Token');
    window.location.href = '/';
  };

  return (
    <div className="bg-gray-800/60 backdrop-blur-xl border border-gray-700 rounded-2xl overflow-hidden shadow-xl">
      <div className="bg-gradient-to-r from-gray-800/80 to-gray-900/80 px-6 py-4 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-lg">
            <Settings className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white font-orbitron">Account Options</h3>
            <p className="text-sm text-gray-400">Security and account settings</p>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="space-y-6">
          {/* Security */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 text-purple-400" />
              </div>
              <h4 className="font-medium text-white font-orbitron">Security</h4>
            </div>
            
            <button 
              onClick={() => setIsPasswordModalOpen(true)}
              className="w-full p-3 text-left rounded-lg text-sm transition-colors duration-200 text-gray-300 hover:bg-gray-700/50 hover:text-white border border-transparent hover:border-purple-500/20"
            >
              Change password
            </button>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gray-500/20 rounded-lg flex items-center justify-center">
                <Settings className="w-4 h-4 text-gray-400" />
              </div>
              <h4 className="font-medium text-white font-orbitron">More Options</h4>
            </div>


            <button 
              onClick={() => setIsDeleteModalOpen(true)}
              className="w-full p-3 text-left rounded-lg text-sm transition-colors duration-200 flex items-center gap-2 text-red-400 hover:bg-red-500/10 hover:text-red-300 border border-transparent hover:border-red-500/20"
            >
              <Trash2 size={16} />
              <span>Delete account</span>
            </button>

            <button 
              onClick={handleSignout} 
              className="w-full p-3 text-left rounded-lg text-sm transition-colors duration-200 flex items-center gap-2 text-gray-300 hover:bg-gray-700/50 hover:text-white border border-transparent hover:border-gray-500/20"
            >
              <LogOut size={16} />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Modals */}
      <ChangePasswordModal 
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        userEmail={userData.email}
      />
      
      <DeleteAccountModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        userEmail={userData.email}
      />
    </div>
  );
};

export default AccountOptionsSection;
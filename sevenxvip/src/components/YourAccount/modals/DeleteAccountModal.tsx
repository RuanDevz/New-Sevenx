import React, { useState } from 'react';
import { X, Trash2, AlertTriangle, Check } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
}

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
  isOpen,
  onClose,
  userEmail
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  
  const [confirmText, setConfirmText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const confirmationText = "delete my account";
  const isConfirmationValid = confirmText.toLowerCase() === confirmationText;
  
  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConfirmationValid) {
      setError('Please type the confirmation text correctly');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
       const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/delete-account/${userEmail}`, {
         method: 'DELETE',
         headers: {
           'Authorization': `Bearer ${localStorage.getItem('Token')}`,
           'x-api-key': `${import.meta.env.VITE_FRONTEND_API_KEY}`
         }
       });
      
       if (!response.ok) {
         throw new Error('Failed to delete account');
       }
      
      setSuccess(true);
      
      setTimeout(() => {
        localStorage.removeItem('Token');
        localStorage.removeItem('name');
        localStorage.removeItem('email');
        window.location.href = '/';
      }, 2000);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setIsLoading(false);
    }
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black/70 backdrop-blur-sm">
      <div 
        className={`w-full max-w-md p-6 rounded-xl shadow-lg ${
          isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${
              isDark ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-600'
            }`}>
              <Trash2 size={20} />
            </div>
            <h2 className="text-xl font-semibold">Delete Account</h2>
          </div>
          <button 
            onClick={onClose}
            className={`p-1 rounded-full transition-colors ${
              isDark 
                ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
                : 'hover:bg-gray-200 text-gray-500 hover:text-gray-800'
            }`}
          >
            <X size={20} />
          </button>
        </div>

        {success ? (
          <div className={`p-4 mb-4 rounded-lg flex items-center gap-3 ${
            isDark ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-600'
          }`}>
            <Check size={20} />
            <p>Account successfully deleted. Redirecting...</p>
          </div>
        ) : (
          <form onSubmit={handleDeleteAccount}>
            <div className={`p-4 mb-6 rounded-lg flex items-start gap-3 ${
              isDark ? 'bg-amber-500/10 border border-amber-500/20' : 'bg-amber-50 border border-amber-100'
            }`}>
              <AlertTriangle className={isDark ? "text-amber-400" : "text-amber-600"} size={20} />
              <div>
                <p className={`font-medium ${isDark ? "text-amber-400" : "text-amber-600"}`}>
                  Warning: This action cannot be undone
                </p>
                <p className={`text-sm mt-1 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                  Deleting your account will permanently remove all your data from our systems. You will lose access to all your content and settings.
                </p>
              </div>
            </div>
            
            {error && (
              <div className={`p-4 mb-4 rounded-lg flex items-center gap-3 ${
                isDark ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-600'
              }`}>
                <AlertTriangle size={20} />
                <p>{error}</p>
              </div>
            )}
            
            <div className="space-y-4 mb-6">
              <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                To confirm deletion, please type <span className="font-medium">"{confirmationText}"</span> below:
              </p>
              
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white focus:ring-red-500/50' 
                    : 'bg-white border-gray-300 text-gray-900 focus:ring-red-500/30'
                }`}
                placeholder={`Type "${confirmationText}" to confirm`}
                required
              />
            </div>
            
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  isDark 
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                Cancel
              </button>
              
              <button
                type="submit"
                disabled={!isConfirmationValid || isLoading}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  isDark 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : 'bg-red-600 hover:bg-red-700 text-white'
                } ${(!isConfirmationValid || isLoading) ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isLoading ? 'Deleting...' : 'Delete My Account'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default DeleteAccountModal;
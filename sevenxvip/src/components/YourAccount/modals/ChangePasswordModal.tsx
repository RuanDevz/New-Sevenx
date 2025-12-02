import React, { useState } from 'react';
import { X, Key, Check, AlertCircle } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ 
  isOpen, 
  onClose,
  userEmail
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const validatePasswords = () => {
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    setError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePasswords()) {
      return;
    }
    
    setIsLoading(true);
    setError('');

    const token = localStorage.getItem('Token')
    
try {
  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/reset-password/account`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'x-api-key': `${import.meta.env.VITE_FRONTEND_API_KEY}`,
    },
    body: JSON.stringify({ token, password: newPassword })
  });

const data = await response.json();

if (!response.ok) {
  throw new Error(data.message || 'Failed to change password');
}

setSuccess(true);

  setSuccess(true);

  setTimeout(() => {
    setNewPassword('');
    setConfirmPassword('');
    setSuccess(false);
    onClose();
  }, 2000);

} catch (err) {
  setError(err instanceof Error ? err.message : 'An unknown error occurred');
} finally {
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
              isDark ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-600'
            }`}>
              <Key size={20} />
            </div>
            <h2 className="text-xl font-semibold">Change Password</h2>
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
            <p>Password changed successfully!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && (
              <div className={`p-4 mb-4 rounded-lg flex items-center gap-3 ${
                isDark ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-600'
              }`}>
                <AlertCircle size={20} />
                <p>{error}</p>
              </div>
            )}
            
            <div className="space-y-4 mb-6">
              <div>
                <label 
                  htmlFor="newPassword" 
                  className={`block mb-2 text-sm font-medium ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  New Password
                </label>
                <input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white focus:ring-purple-500/50' 
                      : 'bg-white border-gray-300 text-gray-900 focus:ring-purple-500/30'
                  }`}
                  placeholder="Enter new password"
                  required
                  minLength={8}
                />
              </div>
              
              <div>
                <label 
                  htmlFor="confirmPassword" 
                  className={`block mb-2 text-sm font-medium ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white focus:ring-purple-500/50' 
                      : 'bg-white border-gray-300 text-gray-900 focus:ring-purple-500/30'
                  }`}
                  placeholder="Confirm new password"
                  required
                />
              </div>
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
                disabled={isLoading}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  isDark 
                    ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                    : 'bg-purple-600 hover:bg-purple-700 text-white'
                } ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isLoading ? 'Changing...' : 'Change Password'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ChangePasswordModal;
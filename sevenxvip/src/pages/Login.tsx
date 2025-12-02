import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, AlertCircle, CheckCircle, Eye, EyeOff, LogIn } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('Token', data.token);
        localStorage.setItem('name', data.name);
        localStorage.setItem('email', email);
        setSuccess('Login successful! Redirecting...');
        setTimeout(() => window.location.href = '/', 1500);
      } else {
        setError(data.error || 'Login failed. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 relative overflow-hidden ${
      isDark 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
    }`}>
      {/* Background Effects */}
      <div className={`absolute inset-0 ${
        isDark 
          ? 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-gray-900 to-gray-900'
          : 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-100/30 via-white to-gray-50'
      }`}></div>
      <div className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse ${
        isDark ? 'bg-purple-500/10' : 'bg-purple-200/30'
      }`}></div>
      <div className={`absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse ${
        isDark ? 'bg-blue-500/10' : 'bg-blue-200/30'
      }`}></div>

      <div className="w-full max-w-md relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={`backdrop-blur-xl border rounded-3xl shadow-2xl overflow-hidden ${
            isDark 
              ? 'bg-gray-800/80 border-gray-700/50' 
              : 'bg-white/90 border-gray-200/50'
          }`}
        >
          {/* Header */}
          <div className={`px-8 py-8 text-center border-b ${
            isDark 
              ? 'bg-gradient-to-r from-purple-900/50 to-blue-900/50 border-gray-700/50'
              : 'bg-gradient-to-r from-purple-100/50 to-blue-100/50 border-gray-200/50'
          }`}>
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl ${
                isDark 
                  ? 'bg-gradient-to-br from-purple-500 to-blue-600' 
                  : 'bg-gradient-to-br from-purple-600 to-blue-700'
              }`}
            >
              <LogIn className="w-10 h-10 text-white" />
            </motion.div>
            
            <h1 className={`text-3xl font-bold mb-2 font-['Orbitron'] ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Welcome Back
            </h1>
            <p className={`${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Sign in to access your account
            </p>
          </div>

          {/* Form */}
          <div className="p-8">
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mb-6 p-4 rounded-xl border flex items-center gap-3 ${
                  isDark 
                    ? 'bg-red-500/10 border-red-500/20' 
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <AlertCircle className={`w-5 h-5 flex-shrink-0 ${
                  isDark ? 'text-red-400' : 'text-red-600'
                }`} />
                <span className={`text-sm ${
                  isDark ? 'text-red-400' : 'text-red-600'
                }`}>{error}</span>
              </motion.div>
            )}

            {success && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mb-6 p-4 rounded-xl border flex items-center gap-3 ${
                  isDark 
                    ? 'bg-green-500/10 border-green-500/20' 
                    : 'bg-green-50 border-green-200'
                }`}
              >
                <CheckCircle className={`w-5 h-5 flex-shrink-0 ${
                  isDark ? 'text-green-400' : 'text-green-600'
                }`} />
                <span className={`text-sm ${
                  isDark ? 'text-green-400' : 'text-green-600'
                }`}>{success}</span>
              </motion.div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Email Address
                </label>
                <div className="relative">
                  <Mail className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full pl-12 pr-4 py-3.5 rounded-xl border focus:ring-2 transition-all duration-200 ${
                      isDark 
                        ? 'bg-gray-900/50 border-gray-600 text-gray-200 placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-600 focus:ring-purple-600/20'
                    }`}
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Password
                </label>
                <div className="relative">
                  <Lock className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full pl-12 pr-12 py-3.5 rounded-xl border focus:ring-2 transition-all duration-200 ${
                      isDark 
                        ? 'bg-gray-900/50 border-gray-600 text-gray-200 placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-600 focus:ring-purple-600/20'
                    }`}
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-4 top-1/2 transform -translate-y-1/2 transition-colors ${
                      isDark 
                        ? 'text-gray-400 hover:text-gray-300' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className={`w-4 h-4 rounded text-purple-500 focus:ring-2 ${
                      isDark 
                        ? 'border-gray-600 bg-gray-900/50 focus:ring-purple-500/20'
                        : 'border-gray-300 bg-white focus:ring-purple-600/20'
                    }`}
                  />
                  <span className={`text-sm ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>Remember me</span>
                </label>
                
                <Link
                  to="/forgot-password"
                  className={`text-sm transition-colors ${
                    isDark 
                      ? 'text-purple-400 hover:text-purple-300' 
                      : 'text-purple-600 hover:text-purple-700'
                  }`}
                >
                  Forgot password?
                </Link>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className={`w-full py-4 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-200 ${
                  isLoading 
                    ? isDark 
                      ? 'bg-gray-700 cursor-not-allowed' 
                      : 'bg-gray-300 cursor-not-allowed'
                    : isDark
                      ? 'bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 shadow-lg hover:shadow-purple-500/30'
                      : 'bg-gradient-to-r from-purple-600 to-blue-700 hover:from-purple-700 hover:to-blue-800 shadow-lg hover:shadow-purple-500/20'
                } text-white`}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </motion.button>
            </form>

            <div className="mt-8 text-center">
              <p className={`${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className={`font-semibold transition-colors ${
                    isDark 
                      ? 'text-purple-400 hover:text-purple-300' 
                      : 'text-purple-600 hover:text-purple-700'
                  }`}
                >
                  Create one here
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
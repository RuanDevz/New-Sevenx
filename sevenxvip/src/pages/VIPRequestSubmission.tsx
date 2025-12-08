import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/Authcontext';
import { useTheme } from '../contexts/ThemeContext';
import VIPHeader from '../components/VIP/VIPHeader';
import Footer from '../components/Footer';

interface RequestLimits {
  tier: string;
  totalRequests: number;
  usedRequests: number;
  remainingRequests: number;
  resetDate: string;
}

interface FormData {
  modelName: string;
  socialProfileLink: string;
  contentType: string;
  additionalDetails: string;
}

const VIPRequestSubmission = () => {
  const { theme } = useTheme();
  const { isVip, isAuthenticated, loadingAuth } = useAuth(); // IMPORTANTE
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [limits, setLimits] = useState<RequestLimits | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState<FormData>({
    modelName: '',
    socialProfileLink: '',
    contentType: 'asian',
    additionalDetails: ''
  });

  useEffect(() => {
    console.log('tem limite')
    fetchRequestLimits();
  }, [isAuthenticated, isVip, loadingAuth, navigate]);

  const fetchRequestLimits = async () => {
    try {
      const token = localStorage.getItem('Token');
      const apiKey = import.meta.env.VITE_FRONTEND_API_KEY;

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/vip-requests/my-limits`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'x-api-key': apiKey
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setLimits(data);
      } else {
        setError('Failed to load request limits');
      }
    } catch (err) {
      setError('Error loading request limits');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      const token = localStorage.getItem('Token');
      const apiKey = import.meta.env.VITE_FRONTEND_API_KEY;

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/vip-requests/create`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'x-api-key': apiKey
          },
          body: JSON.stringify(formData)
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSuccess('Request submitted successfully! Check your email for confirmation.');
        setFormData({
          modelName: '',
          socialProfileLink: '',
          contentType: 'asian',
          additionalDetails: ''
        });
        await fetchRequestLimits();
        setTimeout(() => {
          navigate('/vip-requests/history');
        }, 2000);
      } else {
        setError(data.message || 'Failed to submit request');
      }
    } catch (err) {
      setError('Error submitting request. Please try again.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Tela de carregamento do auth


  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Submit Content Request</h1>
          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
            Request exclusive content from your favorite models
          </p>
        </div>

        {limits && (
          <div className={`p-6 rounded-lg mb-8 ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          } shadow-lg`}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className={`text-sm mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Your Tier
                </p>
                <p className="text-2xl font-bold text-purple-500 capitalize">
                  {limits.tier}
                </p>
              </div>
              <div>
                <p className={`text-sm mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Available Tickets
                </p>
                <p className={`text-2xl font-bold ${
                  limits.remainingRequests > 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {limits.remainingRequests} / {limits.totalRequests}
                </p>
              </div>
              <div>
                <p className={`text-sm mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Next Reset
                </p>
                <p className="text-lg font-semibold">
                  {formatDate(limits.resetDate)}
                </p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-500 bg-opacity-10 border border-red-500 rounded-lg text-red-500">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-500 bg-opacity-10 border border-green-500 rounded-lg text-green-500">
            {success}
          </div>
        )}

        {limits && limits.remainingRequests > 0 ? (
          <form onSubmit={handleSubmit} className={`p-8 rounded-lg ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          } shadow-lg`}>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Model Name *
                </label>
                <input
                  type="text"
                  name="modelName"
                  value={formData.modelName}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter model's name"
                  className={`w-full px-4 py-3 rounded-lg border ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  } focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Social Profile Link *
                </label>
                <input
                  type="url"
                  name="socialProfileLink"
                  value={formData.socialProfileLink}
                  onChange={handleInputChange}
                  required
                  placeholder="https://instagram.com/model"
                  className={`w-full px-4 py-3 rounded-lg border ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  } focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Content Type *
                </label>
                <select
                  name="contentType"
                  value={formData.contentType}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-3 rounded-lg border ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                >
                  <option value="asian">Asian</option>
                  <option value="western">Western</option>
                  <option value="unknown">Unknown</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Additional Details
                </label>
                <textarea
                  name="additionalDetails"
                  value={formData.additionalDetails}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Provide any additional information..."
                  className={`w-full px-4 py-3 rounded-lg border ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  } focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none`}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit Request'}
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/vip-requests/history')}
                  className={`px-6 py-3 rounded-lg font-semibold ${
                    theme === 'dark'
                      ? 'bg-gray-700 hover:bg-gray-600'
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  View History
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className={`p-8 rounded-lg text-center ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          } shadow-lg`}>
            <h3 className="text-2xl font-bold mb-4">No Tickets Available</h3>
            <p className={`mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              You have used all your available request tickets for this month.
            </p>
            {limits && (
              <p className="text-lg">
                Your tickets will reset on{' '}
                <span className="font-bold text-purple-500">
                  {formatDate(limits.resetDate)}
                </span>
              </p>
            )}
            <button
              onClick={() => navigate('/vip-requests/history')}
              className="mt-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-8 rounded-lg font-semibold"
            >
              View Request History
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default VIPRequestSubmission;

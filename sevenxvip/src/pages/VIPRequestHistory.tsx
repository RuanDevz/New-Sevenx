import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/Authcontext';
import { useTheme } from '../contexts/ThemeContext';
import Footer from '../components/Footer';

interface VIPRequest {
  id: number;
  modelName: string;
  socialProfileLink: string;
  contentType: string;
  additionalDetails: string;
  status: 'pending' | 'approved' | 'rejected';
  tier: string;
  contentLink: string;
  rejectionReason: string;
  createdAt: string;
  processedAt: string | null;
}

const VIPRequestHistory = () => {
  const { theme } = useTheme();
  const { isVip, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<VIPRequest[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated || !isVip) {
      navigate('/');
      return;
    }
    fetchRequests();
  }, [filter]); // evitar loops desnecessários

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem('Token'); // corrigido
      const apiKey = import.meta.env.VITE_API_KEY;

      const url =
        filter === 'all'
          ? `${import.meta.env.VITE_API_URL}/vip-requests/my-requests`
          : `${import.meta.env.VITE_API_URL}/vip-requests/my-requests?status=${filter}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          'x-api-key': apiKey,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setRequests(data.requests);
      } else {
        setError('Failed to load request history');
      }
    } catch (err) {
      setError('Error loading request history');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: 'bg-yellow-500 bg-opacity-20 text-yellow-500 border-yellow-500',
      approved: 'bg-green-500 bg-opacity-20 text-green-500 border-green-500',
      rejected: 'bg-red-500 bg-opacity-20 text-red-500 border-red-500',
    };
    return badges[status as keyof typeof badges] || badges.pending;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };


  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">Request History</h1>
            <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
              Track all your content requests
            </p>
          </div>
          <Link
            to="/vip-requests/submit"
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
          >
            New Request
          </Link>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500 bg-opacity-10 border border-red-500 rounded-lg text-red-500">
            {error}
          </div>
        )}

        <div className="mb-6 flex gap-3 flex-wrap">
          {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-6 py-2 rounded-lg font-semibold capitalize transition-all duration-200 ${
                filter === status
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  : theme === 'dark'
                  ? 'bg-gray-800 hover:bg-gray-700'
                  : 'bg-white hover:bg-gray-100'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {requests.length === 0 ? (
          <div
            className={`p-12 rounded-lg text-center ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            } shadow-lg`}
          >
            <h3 className="text-2xl font-bold mb-4">No Requests Found</h3>
            <p className={`mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              {filter === 'all'
                ? "You haven't submitted any requests yet."
                : `You don't have any ${filter} requests.`}
            </p>
            <Link
              to="/vip-requests/submit"
              className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-8 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
            >
              Submit Your First Request
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <div
                key={request.id}
                className={`p-6 rounded-lg ${
                  theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                } shadow-lg hover:shadow-xl transition-shadow duration-200`}
              >
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-bold">{request.modelName}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(request.status)}`}>
                        {request.status.toUpperCase()}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500 bg-opacity-20 text-purple-500 border border-purple-500 capitalize">
                        {request.tier}
                      </span>
                    </div>

                    <div className={`space-y-2 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">Content Type:</span>
                        <span className="capitalize">{request.contentType}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="font-semibold">Social Profile:</span>
                        <a
                          href={request.socialProfileLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-500 hover:underline"
                        >
                          {request.socialProfileLink}
                        </a>
                      </div>

                      {request.additionalDetails && (
                        <div className="flex items-start gap-2">
                          <span className="font-semibold">Details:</span>
                          <span>{request.additionalDetails}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <span className="font-semibold">Submitted:</span>
                        <span>{formatDate(request.createdAt)}</span>
                      </div>

                      {request.processedAt && (
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">Processed:</span>
                          <span>{formatDate(request.processedAt)}</span>
                        </div>
                      )}
                    </div>

                    {request.status === 'approved' && request.contentLink && (
                      <div className="mt-4">
                        <a
                          href={request.contentLink}
                          className="inline-block bg-gradient-to-r from-green-600 to-emerald-600 text-white py-2 px-6 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-200"
                        >
                          View Content
                        </a>
                      </div>
                    )}

                    {request.status === 'rejected' && request.rejectionReason && (
                      <div className="mt-4 p-4 bg-red-500 bg-opacity-10 border border-red-500 rounded-lg">
                        <p className="text-sm font-semibold text-red-500 mb-1">Rejection Reason:</p>
                        <p className="text-sm text-red-400">{request.rejectionReason}</p>
                      </div>
                    )}
                  </div>

                  <div className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                    Request #{request.id}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default VIPRequestHistory;

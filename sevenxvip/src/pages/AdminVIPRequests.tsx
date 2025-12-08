import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/Authcontext';
import { useTheme } from '../contexts/ThemeContext';
import HeaderLogged from '../components/HeaderLogged';
import Footer from '../components/Footer';

interface VIPRequest {
  id: number;
  userId: number;
  userEmail: string;
  userName: string;
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
  user?: {
    name: string;
    email: string;
    vipTier: string;
  };
}

interface Stats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  diamondPending: number;
  lifetimePending: number;
}

const AdminVIPRequests = () => {
  const { theme } = useTheme();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<VIPRequest[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [tierFilter, setTierFilter] = useState<'all' | 'diamond' | 'lifetime'>('all');
  const [error, setError] = useState('');
  const [processingId, setProcessingId] = useState<number | null>(null);

  const [approvalModal, setApprovalModal] = useState<{
    show: boolean;
    requestId: number | null;
    contentLink: string;
  }>({
    show: false,
    requestId: null,
    contentLink: ''
  });

  const [rejectionModal, setRejectionModal] = useState<{
    show: boolean;
    requestId: number | null;
    reason: string;
  }>({
    show: false,
    requestId: null,
    reason: ''
  });

  

  useEffect(() => {
    fetchRequests();
    fetchStats();
  }, [isAuthenticated, navigate, filter, tierFilter]);

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem('Token');
      const apiKey = import.meta.env.VITE_FRONTEND_API_KEY;

      let url = `${import.meta.env.VITE_BACKEND_URL}/vip-requests/admin/all?limit=100`;
      if (filter !== 'all') url += `&status=${filter}`;
      if (tierFilter !== 'all') url += `&tier=${tierFilter}`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-api-key': apiKey
        }
      });

      if (response.ok) {
        const data = await response.json();
        setRequests(data.requests);
      } else {
        setError('Failed to load requests');
      }
    } catch (err) {
      setError('Error loading requests');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('Token');
      const apiKey = import.meta.env.VITE_FRONTEND_API_KEY;

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/vip-requests/admin/stats`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'x-api-key': apiKey
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      }
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  };

  const handleApprove = async () => {
    if (!approvalModal.requestId || !approvalModal.contentLink.trim()) {
      setError('Content link is required');
      return;
    }

    setProcessingId(approvalModal.requestId);

    try {
      const token = localStorage.getItem('Token');
      const apiKey = import.meta.env.VITE_FRONTEND_API_KEY;

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/vip-requests/admin/approve/${approvalModal.requestId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'x-api-key': apiKey
          },
          body: JSON.stringify({ contentLink: approvalModal.contentLink })
        }
      );

      if (response.ok) {
        setApprovalModal({ show: false, requestId: null, contentLink: '' });
        await fetchRequests();
        await fetchStats();
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to approve request');
      }
    } catch (err) {
      setError('Error approving request');
      console.error(err);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async () => {
    if (!rejectionModal.requestId) return;

    setProcessingId(rejectionModal.requestId);

    try {
      const token = localStorage.getItem('Token');
      const apiKey = import.meta.env.VITE_FRONTEND_API_KEY;

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/vip-requests/admin/reject/${rejectionModal.requestId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'x-api-key': apiKey
          },
          body: JSON.stringify({ rejectionReason: rejectionModal.reason })
        }
      );

      if (response.ok) {
        setRejectionModal({ show: false, requestId: null, reason: '' });
        await fetchRequests();
        await fetchStats();
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to reject request');
      }
    } catch (err) {
      setError('Error rejecting request');
      console.error(err);
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: 'bg-yellow-500 bg-opacity-20 text-yellow-500 border-yellow-500',
      approved: 'bg-green-500 bg-opacity-20 text-green-500 border-green-500',
      rejected: 'bg-red-500 bg-opacity-20 text-red-500 border-red-500'
    };
    return badges[status as keyof typeof badges] || badges.pending;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };



  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">VIP Request Management</h1>
          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
            Manage Diamond and Lifetime member content requests
          </p>
        </div>

        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <p className={`text-sm mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Total
              </p>
              <p className="text-2xl font-bold text-purple-500">{stats.total}</p>
            </div>
            <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <p className={`text-sm mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Pending
              </p>
              <p className="text-2xl font-bold text-yellow-500">{stats.pending}</p>
            </div>
            <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <p className={`text-sm mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Approved
              </p>
              <p className="text-2xl font-bold text-green-500">{stats.approved}</p>
            </div>
            <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <p className={`text-sm mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Rejected
              </p>
              <p className="text-2xl font-bold text-red-500">{stats.rejected}</p>
            </div>
            <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <p className={`text-sm mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Diamond Queue
              </p>
              <p className="text-2xl font-bold text-blue-500">{stats.diamondPending}</p>
            </div>
            <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <p className={`text-sm mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Lifetime Queue
              </p>
              <p className="text-2xl font-bold text-pink-500">{stats.lifetimePending}</p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-500 bg-opacity-10 border border-red-500 rounded-lg text-red-500">
            {error}
          </div>
        )}

        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="flex gap-3 flex-wrap">
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
          <div className="flex gap-3 flex-wrap">
            {(['all', 'diamond', 'lifetime'] as const).map((tier) => (
              <button
                key={tier}
                onClick={() => setTierFilter(tier)}
                className={`px-6 py-2 rounded-lg font-semibold capitalize transition-all duration-200 ${
                  tierFilter === tier
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                    : theme === 'dark'
                    ? 'bg-gray-800 hover:bg-gray-700'
                    : 'bg-white hover:bg-gray-100'
                }`}
              >
                {tier}
              </button>
            ))}
          </div>
        </div>

        {requests.length === 0 ? (
          <div className={`p-12 rounded-lg text-center ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          } shadow-lg`}>
            <h3 className="text-2xl font-bold mb-4">No Requests Found</h3>
            <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
              No requests match the selected filters.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <div
                key={request.id}
                className={`p-6 rounded-lg ${
                  theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                } shadow-lg`}
              >
                <div className="flex flex-col lg:flex-row justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3 flex-wrap">
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
                        <span className="font-semibold">Requested by:</span>
                        <span>{request.userName} ({request.userEmail})</span>
                      </div>
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
                          className="text-purple-500 hover:underline break-all"
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
                    </div>

                    {request.status === 'approved' && request.contentLink && (
                      <div className="mt-4 p-3 bg-green-500 bg-opacity-10 border border-green-500 rounded-lg">
                        <p className="text-sm font-semibold text-green-500 mb-1">Content Link:</p>
                        <a
                          href={request.contentLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-green-400 hover:underline break-all"
                        >
                          {request.contentLink}
                        </a>
                      </div>
                    )}

                    {request.status === 'rejected' && request.rejectionReason && (
                      <div className="mt-4 p-3 bg-red-500 bg-opacity-10 border border-red-500 rounded-lg">
                        <p className="text-sm font-semibold text-red-500 mb-1">Rejection Reason:</p>
                        <p className="text-sm text-red-400">{request.rejectionReason}</p>
                      </div>
                    )}
                  </div>

                  {request.status === 'pending' && (
                    <div className="flex flex-col gap-3 lg:w-48">
                      <button
                        onClick={() => setApprovalModal({
                          show: true,
                          requestId: request.id,
                          contentLink: ''
                        })}
                        disabled={processingId === request.id}
                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-2 px-4 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => setRejectionModal({
                          show: true,
                          requestId: request.id,
                          reason: ''
                        })}
                        disabled={processingId === request.id}
                        className="w-full bg-gradient-to-r from-red-600 to-rose-600 text-white py-2 px-4 rounded-lg font-semibold hover:from-red-700 hover:to-rose-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {approvalModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`max-w-lg w-full p-6 rounded-lg ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}>
            <h3 className="text-2xl font-bold mb-4">Approve Request</h3>
            <p className={`mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Provide the content link to approve this request:
            </p>
            <input
              type="url"
              value={approvalModal.contentLink}
              onChange={(e) => setApprovalModal(prev => ({ ...prev, contentLink: e.target.value }))}
              placeholder="https://example.com/vip-asian/slug"
              className={`w-full px-4 py-3 rounded-lg border mb-4 ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
            />
            <div className="flex gap-3">
              <button
                onClick={handleApprove}
                disabled={!approvalModal.contentLink.trim() || processingId !== null}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-2 px-4 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processingId ? 'Processing...' : 'Approve'}
              </button>
              <button
                onClick={() => setApprovalModal({ show: false, requestId: null, contentLink: '' })}
                disabled={processingId !== null}
                className={`flex-1 py-2 px-4 rounded-lg font-semibold ${
                  theme === 'dark'
                    ? 'bg-gray-700 hover:bg-gray-600'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {rejectionModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`max-w-lg w-full p-6 rounded-lg ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}>
            <h3 className="text-2xl font-bold mb-4">Reject Request</h3>
            <p className={`mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Provide a reason for rejection (optional):
            </p>
            <textarea
              value={rejectionModal.reason}
              onChange={(e) => setRejectionModal(prev => ({ ...prev, reason: e.target.value }))}
              placeholder="Reason for rejection..."
              rows={4}
              className={`w-full px-4 py-3 rounded-lg border mb-4 ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none`}
            />
            <div className="flex gap-3">
              <button
                onClick={handleReject}
                disabled={processingId !== null}
                className="flex-1 bg-gradient-to-r from-red-600 to-rose-600 text-white py-2 px-4 rounded-lg font-semibold hover:from-red-700 hover:to-rose-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processingId ? 'Processing...' : 'Reject'}
              </button>
              <button
                onClick={() => setRejectionModal({ show: false, requestId: null, reason: '' })}
                disabled={processingId !== null}
                className={`flex-1 py-2 px-4 rounded-lg font-semibold ${
                  theme === 'dark'
                    ? 'bg-gray-700 hover:bg-gray-600'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default AdminVIPRequests;

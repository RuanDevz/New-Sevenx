import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Calendar,
  AlertCircle,
  CheckCircle2,
  X,
  Users,
  Clock,
  Shield,
  ShieldCheck,
  ShieldX,
  Loader2,
  ChevronDown,
  Filter,
  RefreshCw
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

interface User {
  id: string;
  name: string;
  email: string;
  vipExpirationDate: string | null;
  vipDisabled?: boolean;
}

interface ConfirmModalProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ title, message, onConfirm, onCancel }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  
  return (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
  >
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      className={`rounded-xl shadow-xl p-6 max-w-md w-full mx-4 ${
        isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
      }`}
    >
      <h3 className={`text-xl font-bold mb-2 ${
        isDark ? 'text-white' : 'text-gray-900'
      }`}>{title}</h3>
      <p className={`mb-6 ${
        isDark ? 'text-gray-300' : 'text-gray-600'
      }`}>{message}</p>
      <div className="flex justify-end gap-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onCancel}
          className={`px-4 py-2 transition-colors rounded-lg ${
            isDark 
              ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
          }`}
        >
          Cancel
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onConfirm}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Confirm
        </motion.button>
      </div>
    </motion.div>
  </motion.div>
  );
};

const SuccessModal: React.FC<{ message: string; onClose: () => void }> = ({ message, onClose }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  
  return (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
  >
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      className={`rounded-xl shadow-xl p-6 max-w-md w-full mx-4 ${
        isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-6 h-6 text-green-500" />
          <h3 className={`text-xl font-bold ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>Success</h3>
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className={`rounded-full p-1 transition-colors ${
            isDark 
              ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
              : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
          }`}
        >
          <X className="w-5 h-5" />
        </motion.button>
      </div>
      <p className={`mb-4 ${
        isDark ? 'text-gray-300' : 'text-gray-600'
      }`}>{message}</p>
    </motion.div>
  </motion.div>
  );
};

const AdminVipUsers: React.FC = () => {
  const [vipUsers, setVipUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<{
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "expired">("all");

  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    fetchVipUsers();
  }, []);

  useEffect(() => {
    const filtered = vipUsers.filter(
      (user) =>
        (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (statusFilter === "all" ||
        (statusFilter === "active" && !isVipExpired(user.vipExpirationDate)) ||
        (statusFilter === "expired" && isVipExpired(user.vipExpirationDate)))
    );
    setFilteredUsers(filtered);
  }, [searchTerm, vipUsers, statusFilter]);

  const fetchVipUsers = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get<User[]>(
        `${import.meta.env.VITE_BACKEND_URL}/auth/vip-users`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("Token")}` },
        }
      );

      if (Array.isArray(response.data)) {
        const usersWithStatus = response.data.map((user) => ({
          ...user,
          vipDisabled: user.vipDisabled ?? false,
        }));
        setVipUsers(usersWithStatus);
        setFilteredUsers(usersWithStatus);
      } else {
        throw new Error("Invalid data received from API");
      }
    } catch (error) {
      console.error("Error fetching VIP users:", error);
      setError("Failed to load VIP users. Please try again.");
      setVipUsers([]);
      setFilteredUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | null): string => {
    if (!dateString || dateString === "Not defined") return "Not defined";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isVipExpired = (expirationDate: string | null): boolean => {
    if (!expirationDate || expirationDate === "Not defined") return true;
    return new Date(expirationDate) < new Date();
  };

  const disableVip = async (email: string): Promise<void> => {
    setConfirmAction({
      title: "Disable VIP Access",
      message: `Are you sure you want to disable VIP access for ${email}?`,
      onConfirm: async () => {
        try {
          setLoading(true);
          await axios.put(
            `${import.meta.env.VITE_BACKEND_URL}/auth/disable-user/${email}`,
            {},
            { headers: { Authorization: `Bearer ${localStorage.getItem("Token")}` } }
          );
          setSuccessMessage("VIP access disabled successfully!");
          setShowSuccessModal(true);
          await fetchVipUsers();
        } catch (error) {
          console.error("Error disabling VIP:", error);
          setError("Failed to disable VIP access. Please try again.");
        } finally {
          setLoading(false);
          setConfirmAction(null);
        }
      },
    });
  };

  const renewVip = async (email: string, period: "30days" | "1year"): Promise<void> => {
    const periodText = period === "30days" ? "30 days" : "1 year";
    setConfirmAction({
      title: "Renew VIP Access",
      message: `Are you sure you want to renew VIP access for ${email} for ${periodText}?`,
      onConfirm: async () => {
        try {
          setLoading(true);
          const endpoint = period === "30days"
            ? `${import.meta.env.VITE_BACKEND_URL}/auth/renew-vip/${email}`
            : `${import.meta.env.VITE_BACKEND_URL}/auth/renew-vip-year/${email}`;
          
          const response = await axios.put(
            endpoint,
            {},
            { headers: { Authorization: `Bearer ${localStorage.getItem("Token")}` } }
          );
          setSuccessMessage(response.data.message || "VIP access renewed successfully!");
          setShowSuccessModal(true);
          await fetchVipUsers();
        } catch (error) {
          console.error("Error renewing VIP:", error);
          setError("Failed to renew VIP access. Please try again.");
        } finally {
          setLoading(false);
          setConfirmAction(null);
        }
      },
    });
  };

  return (
    <div className={`min-h-screen ${
      isDark 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white' 
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <div>
            <h1 className={`text-3xl font-bold ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>VIP Users Management</h1>
            <p className={`mt-2 ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>Manage and monitor VIP user access</p>
          </div>
          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/admin-vip-disabled")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isDark 
                  ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
              }`}
            >
              <Users className="w-5 h-5" />
              Disabled VIP Users
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={fetchVipUsers}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
              Refresh
            </motion.button>
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`border p-4 rounded-lg mb-6 flex items-center gap-2 ${
              isDark 
                ? 'bg-red-500/10 border-red-500 text-red-500' 
                : 'bg-red-50 border-red-200 text-red-700'
            }`}
          >
            <AlertCircle className="w-5 h-5" />
            {error}
          </motion.div>
        )}

        <div className={`backdrop-blur-sm border rounded-xl p-6 ${
          isDark 
            ? 'bg-gray-800/50 border-gray-700' 
            : 'bg-white/80 border-gray-200'
        }`}>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    isDark 
                      ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                />
              </div>
            </div>
            <div className="relative">
              <Filter className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as "all" | "active" | "expired")}
                className={`pl-10 pr-8 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none transition-colors ${
                  isDark 
                    ? 'bg-gray-700/50 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="all">All Users</option>
                <option value="active">Active VIP</option>
                <option value="expired">Expired VIP</option>
              </select>
              <ChevronDown className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`} />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${
                  isDark ? 'border-gray-700' : 'border-gray-200'
                }`}>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>User</th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>Status</th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>Expiration</th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>Actions</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${
                isDark ? 'divide-gray-700' : 'divide-gray-200'
              }`}>
                <AnimatePresence>
                  {loading ? (
                    <tr>
                      <td colSpan={4}>
                        <div className="flex items-center justify-center py-8">
                          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                        </div>
                      </td>
                    </tr>
                  ) : filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={4}>
                        <div className={`text-center py-8 ${
                          isDark ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          No users found
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => {
                      const expired = isVipExpired(user.vipExpirationDate);
                      return (
                        <motion.tr
                          key={user.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className={`${
                            user.vipDisabled
                              ? isDark ? "bg-gray-700/20" : "bg-gray-100/50"
                              : expired
                                ? isDark ? "bg-red-500/10" : "bg-red-50"
                                : isDark ? "bg-green-500/10" : "bg-green-50"
                          }`}
                        >
                          <td className="px-6 py-4">
                            <div>
                              <div className={`font-medium ${
                                isDark ? 'text-white' : 'text-gray-900'
                              }`}>{user.name}</div>
                              <div className={`text-sm ${
                                isDark ? 'text-gray-400' : 'text-gray-600'
                              }`}>{user.email}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              {user.vipDisabled ? (
                                <>
                                  <ShieldX className="w-5 h-5 text-red-500" />
                                  <span className="text-red-500">Disabled</span>
                                </>
                              ) : expired ? (
                                <>
                                  <Shield className="w-5 h-5 text-yellow-500" />
                                  <span className="text-yellow-500">Expired</span>
                                </>
                              ) : (
                                <>
                                  <ShieldCheck className="w-5 h-5 text-green-500" />
                                  <span className="text-green-500">Active</span>
                                </>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <Clock className={`w-4 h-4 ${
                                isDark ? 'text-gray-400' : 'text-gray-600'
                              }`} />
                              <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                                {formatDate(user.vipExpirationDate)}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              {expired ? (
                                <>
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => disableVip(user.email)}
                                    className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded-lg transition-colors text-sm text-white flex items-center gap-1"
                                  >
                                    <ShieldX className="w-4 h-4" />
                                    Disable VIP
                                  </motion.button>
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => renewVip(user.email, "30days")}
                                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-sm text-white flex items-center gap-1"
                                  >
                                    <Calendar className="w-4 h-4" />
                                    30 Days
                                  </motion.button>
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => renewVip(user.email, "1year")}
                                    className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded-lg transition-colors text-sm text-white flex items-center gap-1"
                                  >
                                    <Calendar className="w-4 h-4" />
                                    1 Year
                                  </motion.button>
                                </>
                              ) : null}
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {confirmAction && (
          <ConfirmModal
            title={confirmAction.title}
            message={confirmAction.message}
            onConfirm={confirmAction.onConfirm}
            onCancel={() => setConfirmAction(null)}
          />
        )}

        {showSuccessModal && (
          <SuccessModal
            message={successMessage}
            onClose={() => setShowSuccessModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminVipUsers;
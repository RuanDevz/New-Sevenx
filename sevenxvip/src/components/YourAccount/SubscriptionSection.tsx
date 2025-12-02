import React from "react";
import { Link } from "react-router-dom";
import { Crown, Calendar, CheckCircle, XCircle, Sparkles, AlertTriangle, Settings, ExternalLink } from "lucide-react";
import { Userdatatypes } from "../../../types/Userdatatypes";
import { motion } from "framer-motion";


interface SubscriptionSectionProps {
  userData: Userdatatypes;
  isSubscriptionActive: boolean;
  isCanceling: boolean;
  setShowCancelModal: (show: boolean) => void;
}

const SubscriptionSection: React.FC<SubscriptionSectionProps> = ({
  userData,
  isSubscriptionActive,
  isCanceling,
  setShowCancelModal,
}) => {
  const handleManageSubscription = async () => {
    try {
      const token = localStorage.getItem('Token');
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/stripe-portal/create-portal-session`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (response.ok && data.url) {
        // Redirecionar para o Customer Portal da Stripe
        window.open(data.url, '_blank');
      } else {
        console.error('Erro ao criar sessão do portal:', data.error);
        alert('Erro ao acessar o portal de gerenciamento. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao criar sessão do portal:', error);
      alert('Erro ao acessar o portal de gerenciamento. Tente novamente.');
    }
  };
  
  return (
    <div className="bg-gray-800/60 backdrop-blur-xl border border-gray-700 rounded-2xl overflow-hidden shadow-xl">
      <div className="bg-gradient-to-r from-gray-800/80 to-gray-900/80 px-6 py-4 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <div className={`flex items-center justify-center w-12 h-12 rounded-xl shadow-lg ${
            userData.isVip 
              ? "bg-gradient-to-br from-yellow-400 to-yellow-500 text-black"
              : "bg-gradient-to-br from-gray-600 to-gray-700 text-gray-400"
          }`}>
            <Crown className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white font-orbitron">Subscription Management</h3>
            <p className="text-sm text-gray-400">Manage your VIP subscription</p>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-gray-700/50 rounded-xl border border-gray-600/30 flex items-start gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              userData.isVip 
                ? "bg-green-500/20 text-green-400"
                : "bg-gray-600/20 text-gray-400"
            }`}>
              {userData.isVip ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
            </div>
            <div>
              <h4 className="font-medium mb-1 text-white">Current Plan</h4>
              <p className={`text-lg font-semibold font-orbitron ${
                userData.isVip
                  ? "text-yellow-400"
                  : "text-gray-400"
              }`}>
                {userData.isVip ? "VIP Subscription" : "Free Account"}
              </p>
              {userData.isVip && (
                <p className="text-sm text-gray-400">
                  Full access to all premium content
                </p>
              )}
            </div>
          </div>
          
          {userData.isVip && (
            <div className="p-4 bg-gray-700/50 rounded-xl border border-gray-600/30 flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h4 className="font-medium mb-1 text-white">Next Billing Date</h4>
                <p className="text-lg font-semibold text-blue-400 font-orbitron">
                  {new Date(userData.vipExpirationDate).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-400">
                  {isCanceling ? "Subscription will not renew" : "Auto-renewal enabled"}
                </p>
              </div>
            </div>
          )}
        </div>
        
        {isCanceling && (
          <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-3">
            <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="font-medium text-amber-400">
                Subscription Canceled
              </p>
              <p className="text-sm text-gray-300">
                You will retain VIP access until{" "}
                <span className="font-medium">
                  {new Date(userData.vipExpirationDate).toLocaleDateString()}
                </span>
              </p>
            </div>
          </div>
        )}
        
        {userData.isVip && !isSubscriptionActive && (
          <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-3">
            <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="font-medium text-amber-400">
                Subscription Expired
              </p>
              <p className="text-sm text-gray-300">
                Your VIP subscription has expired. You can renew it by upgrading your plan.
              </p>
            </div>
          </div>
        )}
        
        <div className="flex flex-wrap gap-3">
          <Link to="/plans">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white rounded-xl text-sm font-bold flex items-center gap-2 transition-all duration-300 shadow-lg hover:shadow-purple-500/30 font-orbitron"
            >
              <Sparkles size={16} />
              {userData.isVip ? "Change Plan" : "Upgrade to VIP"}
            </motion.button>
          </Link>
          
          {userData.isVip && (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCancelModal(true)}
                className="px-6 py-3 bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 rounded-xl text-sm font-medium flex items-center gap-2 transition-all duration-300"
              >
                <XCircle size={16} />
                Cancel Subscription
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleManageSubscription}
                className="px-6 py-3 bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 rounded-xl text-sm font-medium flex items-center gap-2 transition-all duration-300"
              >
                <Settings size={16} />
                Manage Subscription
                <ExternalLink size={14} />
              </motion.button>
            </>
          )}
          
          {isCanceling && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 rounded-xl text-sm font-medium flex items-center gap-2 transition-all duration-300"
            >
              <CheckCircle size={16} />
              Reactivate Subscription
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionSection;
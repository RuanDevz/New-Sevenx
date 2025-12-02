import React, { useRef, useState, useEffect } from "react";
import { User, Mail, Calendar, Edit, Crown, Shield } from "lucide-react";
import { Userdatatypes } from "../../../types/Userdatatypes";
import { useTheme } from "../../contexts/ThemeContext";
import { motion } from "framer-motion";
import axios from "axios";

interface UserProfileSectionProps {
  userData: Userdatatypes;
  setUserData: (updatedData: Userdatatypes) => void; 
}

const UserProfileSection: React.FC<UserProfileSectionProps> = ({ userData, setUserData }) => {
  const { theme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const isDark = theme === "dark";

  useEffect(() => {
 
    const fetchProfileImage = async () => {
      try {
        const token = localStorage.getItem("Token");
        if (!token) return;

        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/profile-image`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.profileImage && res.data.profileImage !== userData.profileImage) {
          // Atualiza o userData com a imagem vinda do backend
          setUserData({ ...userData, profileImage: res.data.profileImage });
        }
      } catch (error) {
        console.error("Erro ao buscar imagem de perfil:", error);
      }
    };

    fetchProfileImage();
  }, []); // Executa só ao montar

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESET);
    formData.append("cloud_name", import.meta.env.VITE_CLOUDY_NAME);

    try {
      // Envia imagem para o Cloudinary
      const cloudRes = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDY_NAME}/image/upload`, {
        method: "POST",
        body: formData,
      });

      const cloudData = await cloudRes.json();
      const imageUrl = cloudData.secure_url;

      // Atualiza a imagem no backend
      const token = localStorage.getItem("Token"); 

      const apiRes = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/auth/update-profile-image`,
        { profileImage: imageUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUserData(apiRes.data.user); 

    } catch (error) {
      console.error("Erro ao atualizar imagem:", error);
    } finally {
      setLoading(false);
    }
  };
  

  const handleEditClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-gray-800/60 backdrop-blur-xl border border-gray-700 rounded-2xl overflow-hidden shadow-2xl">
      {/* Header Background */}
      <div className="relative w-full h-32 bg-gradient-to-r from-purple-900/40 to-blue-900/40 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20"></div>
        <div className="absolute top-4 right-4 flex gap-2">
          {userData.isVip && (
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center border border-yellow-500/30"
            >
              <Crown className="w-4 h-4 text-yellow-400" />
            </motion.div>
          )}
          {userData.isAdmin && (
            <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center border border-red-500/30">
              <Shield className="w-4 h-4 text-red-400" />
            </div>
          )}
        </div>
      </div>

      <div className="p-6 -mt-16 relative">
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
          <div className="relative rounded-full w-24 h-24 overflow-hidden border-4 border-gray-800 shadow-xl">
            {userData.profileImage ? (
              <img
                src={userData.profileImage}
                alt={userData.username}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-800">
                <User className="w-12 h-12 text-gray-400" />
              </div>
            )}

            <button
              type="button"
              onClick={handleEditClick}
              className="absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center bg-purple-500 hover:bg-purple-600 text-white transition-colors duration-200 shadow-lg"
              disabled={loading}
            >
              <Edit className="w-4 h-4" />
            </button>

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          <div className="flex-1 pt-2 sm:pt-0">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-white font-orbitron">
                {userData.name}
              </h2>
              {userData.isVip && (
                <div className="flex items-center gap-1 px-2 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-full">
                  <Crown className="w-3 h-3 text-yellow-400" />
                  <span className="text-xs font-bold text-yellow-400">VIP</span>
                </div>
              )}
            </div>
            <p className="text-sm text-gray-400 font-roboto">
              Member since {new Date(userData.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-4 bg-gray-700/50 rounded-xl border border-gray-600/30">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <Mail className="text-purple-400 w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-roboto">Email Address</p>
              <p className="text-sm font-medium text-white">
                {userData.email || "No email provided"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-gray-700/50 rounded-xl border border-gray-600/30">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Calendar className="text-blue-400 w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-roboto">Account Status</p>
              <p className="text-sm font-medium text-white">
                {userData.isVip ? "VIP Member" : "Free Member"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileSection;

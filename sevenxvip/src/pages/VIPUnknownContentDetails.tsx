import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  Calendar,
  Tag,
  Download,
  Crown,
  Shield,
  Sparkles,
  Star,
  HelpCircle
} from "lucide-react";
import DownloadOptions from "../components/DownloadOptions";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import LoadingVip from "../components/Loaders/LoadingVip";
import VIPHeader from "../components/VIP/VIPHeader";
import { useTheme } from "../contexts/ThemeContext";

type ContentItem = {
  id: number;
  name: string;
  link: string;
  link2: string;
  linkP: string;
  linkG: string;
  linkMV1: string;
  linkMV2: string;
  linkMV3: string;
  linkMV4: string
  category: string;
  postDate: string;
  createdAt: string;
  updatedAt: string;
  region: string
  slug: string;
};

const VIPUnknownContentDetails = () => {
  const { slug } = useParams<{ slug: string }>();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [content, setContent] = useState<ContentItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContentDetails = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("Token");
        
        // Tenta buscar primeiro no VipAsianContent
        let response;
        let decodedContent;
        
        try {
          response = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/vip-asiancontent/${slug}`,
            { 
              headers: { 
                Authorization: `Bearer ${token}`, 
                "x-api-key": `${import.meta.env.VITE_FRONTEND_API_KEY}` 
              } 
            }
          );
          if (response.data?.data) {
            decodedContent = decodeModifiedBase64(response.data.data);
            setContent(decodedContent);
            return;
          }
        } catch (e) {
          // Continua para tentar VipWesternContent
        }
        
        // Se não encontrou no VIP Asian, tenta no VipWesternContent
        try {
          response = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/vip-westerncontent/${slug}`,
            { 
              headers: { 
                Authorization: `Bearer ${token}`, 
                "x-api-key": `${import.meta.env.VITE_FRONTEND_API_KEY}` 
              } 
            }
          );
          if (response.data?.data) {
            decodedContent = decodeModifiedBase64(response.data.data);
            setContent(decodedContent);
            return;
          }
        } catch (e) {
          // Se não encontrou em nenhum, lança erro
        }
        
        throw new Error("Content not found");
      } catch (error) {
        console.error("Error fetching VIP Unknown content details:", error);
        setError("Failed to load VIP content details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchContentDetails();
  }, [slug]);

  function decodeModifiedBase64(encodedStr: string): any {
    const fixedBase64 = encodedStr.slice(0, 2) + encodedStr.slice(3);
    const jsonString = atob(fixedBase64);
    return JSON.parse(jsonString);
  }

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  if (loading) return (
    <div>
      <LoadingVip />
    </div>
  );

  if (error) {
    return (
      <div>
        <div className={`min-h-screen flex items-center justify-center p-4 ${
          isDark 
            ? 'bg-gradient-to-br from-gray-900 via-yellow-900/10 to-gray-900' 
            : 'bg-gradient-to-br from-gray-50 via-yellow-100/20 to-gray-100'
        }`}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className={`max-w-md backdrop-blur-xl border rounded-2xl p-8 text-center shadow-2xl ${
            isDark 
              ? 'bg-gray-800/90 border-yellow-500/30' 
              : 'bg-white/90 border-yellow-400/30'
          }`}>
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-red-400" />
            </div>
            <h2 className={`text-2xl font-bold mb-4 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>Error</h2>
            <p className={`mb-6 ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>{error}</p>
            <Link to="/vip-unknown" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black rounded-xl font-semibold transition-all duration-300">
              <ArrowLeft className="w-4 h-4" />
              Back to VIP Unknown
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div>
        <div className={`min-h-screen flex items-center justify-center p-4 ${
          isDark 
            ? 'bg-gradient-to-br from-gray-900 via-yellow-900/10 to-gray-900' 
            : 'bg-gradient-to-br from-gray-50 via-yellow-100/20 to-gray-100'
        }`}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className={`max-w-md backdrop-blur-xl border rounded-2xl p-8 text-center shadow-2xl ${
            isDark 
              ? 'bg-gray-800/90 border-yellow-500/30' 
              : 'bg-white/90 border-yellow-400/30'
          }`}>
            <div className="w-16 h-16 bg-gray-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Crown className="w-8 h-8 text-yellow-400" />
            </div>
            <h2 className={`text-2xl font-bold mb-4 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>Content Not Found</h2>
            <p className={`mb-6 ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>The VIP Unknown content you're looking for doesn't exist or has been removed.</p>
            <Link to="/vip-unknown" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black rounded-xl font-semibold transition-all duration-300">
              <ArrowLeft className="w-4 h-4" />
              Back to VIP Unknown
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative min-h-screen overflow-x-clip ${
      isDark 
        ? 'bg-gradient-to-br from-gray-900 via-yellow-900/10 to-gray-900' 
        : 'bg-gradient-to-br from-gray-50 via-yellow-100/20 to-gray-100'
    }`}>
      <Helmet>
        <title>Sevenxleaks - {content.name} (VIP Unknown)</title>
        <link rel="canonical" href={`https://sevenxleaks.com/vip-unknown/${content.slug}`} />
        <style>{`
          html, body, #root { max-width: 100%; overflow-x: hidden; }
          [data-ads], iframe { width: 100% !important; max-width: 100% !important; }
          * { word-break: break-word; }
        `}</style>
      </Helmet>

      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute inset-0 ${
          isDark 
            ? 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-yellow-900/20 via-gray-900 to-gray-900'
            : 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-yellow-100/30 via-white to-gray-50'
        }`} />
        <div className={`absolute top-1/4 left-1/2 -translate-x-1/2 w-64 h-64 sm:w-96 sm:h-96 rounded-full blur-3xl animate-pulse ${
          isDark ? 'bg-yellow-500/15' : 'bg-yellow-200/40'
        }`} />
        <div className={`absolute bottom-1/4 left-1/2 -translate-x-1/2 w-64 h-64 sm:w-96 sm:h-96 rounded-full blur-3xl animate-pulse ${
          isDark ? 'bg-gray-500/10' : 'bg-gray-200/30'
        }`} />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-6">
          <Link to="/vip-unknown" className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800/60 hover:bg-gray-700/80 border border-yellow-500/30 hover:border-gray-400/50 rounded-xl text-gray-300 hover:text-white transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-yellow-500/10">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to VIP Unknown</span>
          </Link>
        </motion.div>

        {/* VIP Content Card */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className={`backdrop-blur-xl border rounded-2xl overflow-hidden shadow-2xl ${
          isDark 
            ? 'bg-gray-800/90 border-yellow-500/40 shadow-yellow-500/20'
            : 'bg-white/90 border-yellow-400/40 shadow-yellow-400/20'
        }`}>
          {/* VIP Header */}
          <div className={`px-6 py-6 border-b ${
            isDark 
              ? 'bg-gradient-to-r from-yellow-900/50 to-gray-900/30 border-yellow-500/30'
              : 'bg-gradient-to-r from-yellow-100/50 to-gray-100/30 border-yellow-400/30'
          }`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-gray-500 rounded-xl flex items-center justify-center shadow-xl">
                <Crown className="w-6 h-6 text-black" />
              </div>
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full border backdrop-blur-sm ${
                isDark 
                  ? 'bg-gradient-to-r from-yellow-500/30 to-gray-500/20 text-yellow-300 border-yellow-500/40'
                  : 'bg-gradient-to-r from-yellow-200/50 to-gray-200/30 text-yellow-700 border-yellow-400/50'
              }`}>
                <HelpCircle className="w-3 h-3 text-gray-400" />
                <span className="font-bold text-xs hidden sm:inline">VIP UNKNOWN EXCLUSIVE</span>
                <span className="font-bold text-xs sm:hidden">VIP UNKNOWN</span>
              </div>
            </div>

            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className={`text-xl sm:text-2xl lg:text-3xl font-bold mb-4 leading-tight break-words ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              {content.name}
            </motion.h1>

            <div className="flex flex-wrap items-center gap-2 sm:gap-4">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className={`flex items-center gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border backdrop-blur-sm ${
                isDark 
                  ? 'bg-gray-700/50 border-gray-600/50'
                  : 'bg-gray-200/50 border-gray-300/50'
              }`}>
                <Calendar className="w-4 h-4 text-yellow-400" />
                <span className={`text-sm ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>{formatDate(content.postDate)}</span>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className={`flex items-center gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border backdrop-blur-sm ${
                isDark 
                  ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                  : 'bg-yellow-200/40 text-yellow-700 border-yellow-400/40'
              }`}>
                <Tag className="w-4 h-4" />
                <span className="font-medium text-sm break-words">{content.category}</span>
              </motion.div>

              {/* Region Badge */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className={`flex items-center gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border backdrop-blur-sm ${
                content.region === 'asian' 
                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                  : 'bg-orange-500/20 text-orange-300 border-orange-500/30'
              }`}>
                <Shield className="w-4 h-4" />
                <span className="font-medium text-sm break-words">{content.region.toUpperCase()}</span>
              </motion.div>
            </div>
          </div>

          {/* VIP Download Section */}
          <div className="p-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-gray-500 rounded-lg flex items-center justify-center shadow-lg">
                  <Download className="w-4 h-4 text-black" />
                </div>
                <h2 className={`text-xl font-bold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>VIP Unknown Download Options</h2>
                <HelpCircle className="w-5 h-5 text-gray-400" />
              </div>

              <div className={`rounded-xl p-4 mb-4 border ${
                isDark 
                  ? 'bg-gradient-to-r from-yellow-500/15 to-gray-500/10 border-yellow-500/30'
                  : 'bg-gradient-to-r from-yellow-100/50 to-gray-100/30 border-yellow-400/40'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="w-4 h-4 text-yellow-400" />
                  <span className={`font-semibold text-sm ${
                    isDark ? 'text-yellow-400' : 'text-yellow-600'
                  }`}>VIP Unknown Benefits Active</span>
                  <HelpCircle className="w-4 h-4 text-gray-400" />
                </div>
                <p className={`text-sm ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>Access exclusive unknown content that's only available to VIP members, with no ads and premium download speeds.</p>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
              <div className="w-full max-w-full overflow-hidden">
<DownloadOptions
  primaryLinks={{
    linkG: content.link,     // MEGA (vertise)
    linkP: content.linkG,    // MEGA 2 (vertise)
    pixeldrain: content.linkP, // Pixeldrain (vertise)

    LINKMV1: content.linkMV1, // MEGA (admaven)
    LINKMV2: content.linkMV2, // MEGA 2 (admaven)
    LINKMV3: content.linkMV3, // Pixeldrain (admaven)
  }}
/>

              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default VIPUnknownContentDetails;
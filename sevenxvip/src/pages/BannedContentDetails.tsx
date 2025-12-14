import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  Calendar,
  Tag,
  ExternalLink,
  Shield,
  Crown,
  ChevronDown,
  AlertTriangle,
  ShieldCheck,
  Zap,
  Ban,
  BadgeCheck,
  DoorOpen,
  Archive
} from "lucide-react";

import DownloadOptions from "../components/DownloadOptions";
import { linkvertise } from "../components/Linkvertise";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import LoadingBanned from "../components/Loaders/LoadingBanned";
import { useTheme } from "../contexts/ThemeContext";
import visa from "../assets/visa.svg";
import mastercard from "../assets/mastercard.svg";
import applepay from "../assets/applepay.svg";
import googlepay from "../assets/googlepay.svg";


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
  preview?: string
  category: string;
  postDate: string;
  createdAt: string;
  updatedAt: string;
  slug: string;
};

const BannedContentDetails = () => {
  const { slug } = useParams<{ slug: string }>();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [content, setContent] = useState<ContentItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [linkvertiseAccount, setLinkvertiseAccount] = useState<string>("518238");
  const [benefitsOpen, setBenefitsOpen] = useState<boolean>(false);
  const [previewLoaded, setPreviewLoaded] = useState(false);
const [previewError, setPreviewError] = useState(false);

useEffect(() => {
  setPreviewLoaded(false);
  setPreviewError(false);
}, [content?.preview]);

  useEffect(() => {
    const fetchLinkvertiseConfig = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/linkvertise-config`,
          { headers: { "x-api-key": `${import.meta.env.VITE_FRONTEND_API_KEY}` } }
        );
        if (response.data && response.data.activeAccount) setLinkvertiseAccount(response.data.activeAccount);
      } catch {
        setLinkvertiseAccount("518238");
      }
    };
    fetchLinkvertiseConfig();
  }, []);

  useEffect(() => {
    if (content) {
      linkvertise(linkvertiseAccount, { whitelist: ["mega.nz", "pixeldrain.com", "gofile.io"] });
    }
  }, [content, linkvertiseAccount]);

  function decodeModifiedBase64(encodedStr: string): any {
    const fixedBase64 = encodedStr.slice(0, 2) + encodedStr.slice(3);
    const jsonString = atob(fixedBase64);
    return JSON.parse(jsonString);
  }

  useEffect(() => {
    const fetchContentDetails = async () => {
      try {
        setLoading(true);
        
        // Tenta buscar primeiro no AsianContent
        let response;
        let decodedContent;
        
        try {
          response = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/asiancontent/${slug}`,
            { headers: { "x-api-key": `${import.meta.env.VITE_FRONTEND_API_KEY}` } }
          );
          if (response.data?.data) {
            decodedContent = decodeModifiedBase64(response.data.data);
            if (decodedContent.category === 'Banned') {
              setContent(decodedContent);
              return;
            }
          }
        } catch (e) {
          // Continua para tentar WesternContent
        }
        
        // Se não encontrou no Asian, tenta no WesternContent
        try {
          response = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/westerncontent/${slug}`,
            { headers: { "x-api-key": `${import.meta.env.VITE_FRONTEND_API_KEY}` } }
          );
          if (response.data?.data) {
            decodedContent = decodeModifiedBase64(response.data.data);
            if (decodedContent.category === 'Banned') {
              setContent(decodedContent);
              return;
            }
          }
        } catch (e) {
          // Se não encontrou em nenhum, lança erro
        }
        
        throw new Error("Content not found");
      } catch {
        setError("Failed to load content details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchContentDetails();
  }, [slug]);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  if (loading) return <LoadingBanned />;

  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 ${
        isDark 
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
          : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
      }`}>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className={`max-w-md backdrop-blur-xl border rounded-2xl p-8 text-center shadow-2xl ${
          isDark 
            ? 'bg-gray-800/90 border-gray-700' 
            : 'bg-white/90 border-gray-200'
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
          <Link
            to="/asian"
            className={`inline-flex items-center gap-2 mb-3 text-xs font-medium transition-colors ${
              isDark
                ? "text-gray-400 hover:text-gray-100"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Asian Content
          </Link>
        </motion.div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 ${
        isDark 
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
          : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
      }`}>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className={`max-w-md backdrop-blur-xl border rounded-2xl p-8 text-center shadow-2xl ${
          isDark 
            ? 'bg-gray-800/90 border-gray-700' 
            : 'bg-white/90 border-gray-200'
        }`}>
          <div className="w-16 h-16 bg-gray-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className={`text-2xl font-bold mb-4 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>Content Not Found</h2>
          <p className={`mb-6 ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>The banned content you're looking for doesn't exist or has been removed.</p>
          <Link to="/banned" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-semibold transition-all duration-300">
            <ArrowLeft className="w-4 h-4" />
            Back to banned content
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`relative min-h-screen overflow-x-clip ${
      isDark 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
    }`}>
      <Helmet>
        <title>Sevenxleaks - {content.name} (Banned)</title>
        <link rel="canonical" href={`https://sevenxleaks.com/banned/${content.slug}`} />
        {/* Corte global e neutralização de 100vw de terceiros */}
        <style>{`
          html, body, #root { max-width: 100%; overflow-x: hidden; }
          .linkvertise-container, [data-ads], iframe { width: 100% !important; max-width: 100% !important; }
          * { word-break: break-word; }
        `}</style>
      </Helmet>

      {/* Background Effects contidos e centralizados */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute inset-0 ${
          isDark 
            ? 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-900/20 via-gray-900 to-gray-900'
            : 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-100/30 via-white to-gray-50'
        }`} />
        <div className={`absolute top-1/4 left-1/2 -translate-x-1/2 w-64 h-64 sm:w-96 sm:h-96 rounded-full blur-3xl animate-pulse ${
          isDark ? 'bg-red-500/10' : 'bg-red-200/30'
        }`} />
        <div className={`absolute bottom-1/4 left-1/2 -translate-x-1/2 w-64 h-64 sm:w-96 sm:h-96 rounded-full blur-3xl animate-pulse ${
          isDark ? 'bg-red-500/10' : 'bg-red-200/30'
        }`} />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-6">
          <Link to="/banned" className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800/60 hover:bg-gray-700/80 border border-gray-700 hover:border-red-500/50 rounded-xl text-gray-300 hover:text-white transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-red-500/10">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to banned content</span>
          </Link>
        </motion.div>

        {/* Content Card */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className={`backdrop-blur-xl border rounded-2xl overflow-hidden shadow-2xl ${
          isDark 
            ? 'bg-gray-800/90 border-red-500/30 shadow-red-500/10'
            : 'bg-white/90 border-red-400/30 shadow-red-400/10'
        }`}>
          {/* Header */}
          <div className={`px-6 py-6 border-b ${
            isDark 
              ? 'bg-gradient-to-r from-red-900/40 to-red-800/40 border-red-500/20'
              : 'bg-gradient-to-r from-red-100/40 to-red-200/40 border-red-400/20'
          }`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-red-500 rounded-xl flex items-center justify-center shadow-xl">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              <div className={`flex items-center gap-2 px-2 sm:px-3 py-1 rounded-full border backdrop-blur-sm ${
                isDark 
                  ? 'bg-red-500/20 text-red-300 border-red-500/30'
                  : 'bg-red-200/40 text-red-700 border-red-400/40'
              }`}>
                <Shield className="w-3 h-3" />
                <span className="font-bold text-xs hidden sm:inline">BANNED CONTENT</span>
                <span className="font-bold text-xs sm:hidden">BANNED</span>
              </div>
            </div>

            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className={`text-xl sm:text-3xl font-bold mb-4 leading-tight break-words ${
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
                <Calendar className="w-4 h-4 text-red-400" />
                <span className={`text-xs sm:text-sm ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>{formatDate(content.postDate)}</span>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className={`flex items-center gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border backdrop-blur-sm ${
                isDark 
                  ? 'bg-red-500/20 text-red-300 border-red-500/30'
                  : 'bg-red-200/40 text-red-700 border-red-400/40'
              }`}>
                <Tag className="w-4 h-4" />
                <span className="font-medium text-xs sm:text-sm break-words">{content.category}</span>
              </motion.div>
            </div>
          </div>

        {content.preview && !previewError && (
          <div className="p-3">
            <a
              href={content.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`group relative block rounded-md overflow-hidden border ${
                isDark ? "border-white/10" : "border-black/10"
              }`}
            >
              {/* Preview Image */}
              <img
                src={content.preview}
                onLoad={() => setPreviewLoaded(true)}
                onError={() => setPreviewError(true)}
                className="w-full max-h-[300px] object-cover transition-transform duration-700 group-hover:scale-105"
              />
        
              {previewLoaded && (
                <>
                  {/* Overlay */}
                  <div
                    className={`absolute inset-0 transition-all duration-700 ${
                      isDark
                        ? "bg-black/10 group-hover:bg-black/40"
                        : "bg-white/0 group-hover:bg-black/30"
                    }`}
                  />
        
                  {/* Play Button with Slow Waves */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative flex items-center justify-center">
                      {/* Wave 1 */}
                      <span className="absolute w-24 h-24 rounded-full bg-red-500/30 animate-[ping_2.5s_ease-out_infinite]" />
                      
                      {/* Wave 2 */}
                      <span className="absolute w-32 h-32 rounded-full bg-red-500/20 animate-[ping_3.2s_ease-out_infinite]" />
        
                      {/* Core Button */}
                      <div
                        className="
                          relative z-10
                          w-16 h-16
                          rounded-full
                          bg-red-600
                          flex items-center justify-center
                          shadow-[0_0_35px_rgba(168,85,247,0.9)]
                          transition-transform duration-300
                          group-hover:scale-110
                        "
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="white"
                          className="w-8 h-8 ml-1"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </a>
        
            {/* VERIFIED SAFE */}
            <div
              className={`mt-2 flex items-center justify-center gap-1 text-[11px] font-semibold ${
                isDark ? "text-green-400" : "text-green-600"
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              Verified & Safe Download
            </div>
          </div>
        )}

 <div className="px-3">
              <div
                className={`mt-3 rounded-lg p-3 text-center border ${
                  isDark
                    ? "border-yellow-400/40 bg-yellow-400/5"
                    : "border-yellow-400 bg-yellow-50"
                }`}
              >
                <h3
                  className={`flex items-center justify-center gap-2 text-base font-bold mb-1 ${
                    isDark ? "text-yellow-400" : "text-yellow-600"
                  }`}
                >
                  <Crown className="w-4 h-4" />
                  UNLOCK FULL SITE ACCESS
                </h3>

                <p
                  className={`text-[11px] mb-2 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Get instant access to this video &{" "}
                  <b>20000+ Exclusive Folders</b>
                </p>

                {/* BENEFITS */}
                <div className="flex flex-wrap justify-center gap-2 mb-3 text-[10px]">
                  <Benefit icon={Zap} label="Max Speed" dark={isDark} />
                  <Benefit icon={Ban} label="No Ads" dark={isDark} />
                  <Benefit icon={DoorOpen} label="VIP Room" dark={isDark} />
                  <Benefit icon={BadgeCheck} label="Exclusive Badge" dark={isDark} />
                  <Benefit icon={Archive} label="All Archives" dark={isDark} />
                </div>

                <Link
                  to="/plans"
                  className="block w-full max-w-xs mx-auto px-3 py-1.5 rounded-md bg-yellow-500 hover:bg-yellow-600 text-black font-bold transition text-sm"
                >
                  UPGRADE TO VIP ACCESS NOW →
                </Link>

                {/* PAYMENTS */}
                <div className="mt-3 flex flex-wrap justify-center gap-4">
                  <img src={visa} alt="Visa" className="w-8 opacity-80" />
                  <img src={mastercard} alt="Mastercard" className="w-8 opacity-80" />
                  <img src={applepay} alt="ApplePay" className="w-8 opacity-80" />
                  <img src={googlepay} alt="GooglePay" className="w-8 opacity-80" />
                </div>
              </div>
            </div>

            {/* FREE */}
            <p
              className={`text-center text-[11px] mt-3 ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Or continue with limited free servers (Slow speed and Unskippable
              ADS):
            </p>


          {/* Download Section */}
          <div className="p-6">
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

            {/* VIP Upgrade Section */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className={`mt-6 rounded-xl p-4 w-full max-w-full border ${
              isDark 
                ? 'bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 border-yellow-500/30'
                : 'bg-gradient-to-r from-yellow-100/50 to-yellow-200/50 border-yellow-400/40'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg flex items-center justify-center shadow-lg">
                    <Crown className="w-4 h-4 text-black" />
                  </div>
                  <h3 className={`text-base sm:text-lg font-bold ${
                    isDark ? 'text-yellow-400' : 'text-yellow-600'
                  }`}>Upgrade to VIP</h3>
                </div>

                <button
                  type="button"
                  onClick={() => setBenefitsOpen((v) => !v)}
                  aria-expanded={benefitsOpen}
                  aria-controls="vip-benefits"
                  className={`inline-flex items-center gap-2 px-2 sm:px-3 py-1.5 border rounded-md text-xs font-medium transition-all ${
                    isDark 
                      ? 'bg-yellow-500/15 border-yellow-500/30 text-yellow-300'
                      : 'bg-yellow-200/30 border-yellow-400/40 text-yellow-700'
                  }`}
                >
                  <span className="hidden sm:inline">{benefitsOpen ? "Hide benefits" : "Show benefits"}</span>
                  <span className="sm:hidden">{benefitsOpen ? "Hide" : "Show"}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${benefitsOpen ? "rotate-180" : ""}`} />
                </button>
              </div>

              <div
                id="vip-benefits"
                className={`grid grid-cols-2 gap-2 mb-4 overflow-hidden transition-all duration-300 w/full max-w-full ${
                  benefitsOpen ? "max-h-96 opacity-100 mt-1" : "max-h-0 opacity-0"
                }`}
              >
                {[
                  "Instant access without ads",
                  "All content unlocked",
                  "Premium download speeds",
                  "Exclusive VIP content",
                ].map((benefit, index) => (
                  <div key={index} className={`flex items-center gap-2 text-xs sm:text-sm ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    <div className="w-4 h-4 bg-green-500/20 rounded-full flex items-center justify-center">
                      <i className="fa-solid fa-check text-green-400 text-xs"></i>
                    </div>
                    <span className="break-words">{benefit}</span>
                  </div>
                ))}
              </div>

              <Link to="/plans" className="inline-flex items-center gap-2 w-full justify-center px-4 py-2.5 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold rounded-lg transition-all duration-300 shadow-lg hover:shadow-yellow-500/30 text-xs sm:text-sm">
                <Crown className="w-4 h-4" />
                <span>Unlock VIP Access</span>
                <ExternalLink className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const Benefit = ({
  icon: Icon,
  label,
  dark,
}: {
  icon: any;
  label: string;
  dark: boolean;
}) => (
  <span
    className={`flex items-center gap-1 px-2 py-0.5 rounded-full font-semibold ${
      dark
        ? "bg-yellow-400/20 text-yellow-300"
        : "bg-yellow-200 text-yellow-800"
    }`}
  >
    <Icon className="w-3.5 h-3.5" />
    {label}
  </span>
);

export default BannedContentDetails;
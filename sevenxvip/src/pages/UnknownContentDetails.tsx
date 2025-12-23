import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  Calendar,
  Crown,
  Zap,
  Ban,
  DoorOpen,
  BadgeCheck,
  Archive,
  ShieldCheck,
  Monitor,
  Star,
} from "lucide-react";
import DownloadOptions from "../components/DownloadOptions";
import { linkvertise } from "../components/Linkvertise";
import { Helmet } from "react-helmet";
import { useTheme } from "../contexts/ThemeContext";
import visa from "../assets/visa.svg";
import mastercard from "../assets/mastercard.svg";
import applepay from "../assets/applepay.svg";
import googlepay from "../assets/googlepay.svg";
import LoadingUnknown from "../components/Loaders/LoadingUnknown";

type ContentItem = {
  id: number;
  name: string;
  link: string;
  linkP: string;
  linkG: string;
  linkMV1: string;
  linkMV2: string;
  linkMV3: string;
  category: string;
  preview?: string;
  postDate: string;
  slug: string;
};

const UnknownContentDetails = () => {
  const { slug } = useParams<{ slug: string }>();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [content, setContent] = useState<ContentItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [previewLoaded, setPreviewLoaded] = useState(false);
  const [previewError, setPreviewError] = useState(false);
  const [linkvertiseAccount] = useState("518238");

  function decodeModifiedBase64(encodedStr: string): any {
    const fixedBase64 = encodedStr.slice(0, 2) + encodedStr.slice(3);
    return JSON.parse(atob(fixedBase64));
  }

  useEffect(() => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth", // pode remover se quiser instantâneo
  });
}, [slug]);

  useEffect(() => {
    if (content) {
      linkvertise(linkvertiseAccount, {
        whitelist: ["mega.nz", "pixeldrain.com", "gofile.io"],
      });
    }
  }, [content, linkvertiseAccount]);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/asiancontent/${slug}`,
          {
            headers: {
              "x-api-key": import.meta.env.VITE_FRONTEND_API_KEY,
            },
          }
        );
        setContent(decodeModifiedBase64(res.data.data));
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchContent();
  }, [slug]);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  if (loading) return <LoadingUnknown />;
  if (!content) return null;

  return (
    <div
      className={`min-h-screen py-6 transition-colors ${
        isDark ? "bg-gray-900" : "bg-gray-100"
      }`}
    >
      <Helmet>
        <title>{content.name}</title>
      </Helmet>

      <div className="max-w-4xl mx-auto px-4">
        <div className="origin-top transform scale-[0.82]">
          {/* BACK */}
          <Link
            to="/unknown"
            className={`inline-flex items-center gap-2 mb-3 text-xs font-medium transition-colors ${
              isDark
                ? "text-gray-400 hover:text-gray-100"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Unknown Content
          </Link>

          <div
            className={`rounded-lg shadow-md overflow-hidden transition-colors ${
              isDark ? "bg-gray-800" : "bg-white"
            }`}
          >
           <div
  className={`px-3 py-3 border-b ${
    isDark ? "border-gray-700" : "border-gray-200"
  }`}
>
  {/* TITLE */}
  <h1
    className={`text-lg sm:text-xl font-bold leading-tight mb-1 ${
      isDark ? "text-white" : "text-gray-900"
    }`}
  >
    {content.name}
  </h1>

  {/* META / BADGES */}
  <div className="flex flex-wrap items-center gap-2 text-[11px]">
    {/* Date */}
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md ${
        isDark ? "bg-gray-700/60 text-gray-200" : "bg-gray-100 text-gray-700"
      }`}
    >
      <Calendar className="w-3 h-3" />
      {formatDate(content.postDate)}
    </span>

    {/* 1080p */}
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-semibold ${
        isDark
          ? "bg-gray-700/60 text-gray-200"
          : "bg-gray-100 text-gray-700"
      }`}
    >
      <Monitor className="w-3 h-3" />
      1080p FHD
    </span>

    {/* NEW */}
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-semibold bg-slate-600 text-white">
      <Star className="w-3 h-3" />
      NEW
    </span>

    {/* Category */}
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-semibold ${
        isDark
          ? "bg-gray-700/60 text-gray-200"
          : "bg-gray-100 text-gray-700"
      }`}
    >
      {content.category}
    </span>
  </div>
</div>



            {/* PREVIEW */}
{content.preview && !previewError && (
  <div className="p-3">
    <a
      href={content.link || content.linkMV1}
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
              <span className="absolute w-24 h-24 rounded-full bg-slate-500/30 animate-[ping_2.5s_ease-out_infinite]" />
              
              {/* Wave 2 */}
              <span className="absolute w-32 h-32 rounded-full bg-slate-500/20 animate-[ping_3.2s_ease-out_infinite]" />

              {/* Core Button */}
              <div
                className="
                  relative z-10
                  w-16 h-16
                  rounded-full
                  bg-slate-600
                  flex items-center justify-center
                  shadow-[0_0_35px_rgba(100,116,139,0.9)]

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



            {/* VIP */}
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

            <div className="p-3 pb-10">
              <DownloadOptions
                primaryLinks={{
                  linkG: content.link,
                  linkP: content.linkG,
                  pixeldrain: content.linkP,
                  LINKMV1: content.linkMV1,
                  LINKMV2: content.linkMV2,
                  LINKMV3: content.linkMV3,
                }}
              />
            </div>
          </div>
        </div>
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

export default UnknownContentDetails;
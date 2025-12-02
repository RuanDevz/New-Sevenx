import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Heart, Shield, ExternalLink } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

const Footer = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { name: "Home", href: "/" },
    { name: "Plans", href: "/plans" },
    { name: "Support", href: "/support" },
    { name: "Discord", href: "https://discord.gg/Ec4zzTbsWs", external: true }
  ];

  const socialLinks = [
    { icon: "fab fa-discord", href: "https://discord.gg/Ec4zzTbsWs", name: "Discord" },
    { icon: "fas fa-envelope", href: "mailto:dmca@sevenxleaks.com", name: "Email" }
  ];

  return (
    <footer className={`relative overflow-hidden border-t transition-all duration-300 ${
      isDark 
        ? "bg-gray-900/95 border-gray-800/50 text-white" 
        : "bg-white/95 border-gray-200/50 text-gray-900"
    }`}>
      {/* Background Effects */}
      <div className={`absolute inset-0 ${
        isDark 
          ? 'bg-gradient-to-r from-purple-500/5 via-transparent to-blue-500/5'
          : 'bg-gradient-to-r from-purple-200/20 via-transparent to-blue-200/20'
      }`}></div>
      <div className={`absolute top-0 left-1/4 w-96 h-32 rounded-full blur-3xl ${
        isDark ? 'bg-purple-500/10' : 'bg-purple-200/30'
      }`}></div>
      <div className={`absolute bottom-0 right-1/4 w-96 h-32 rounded-full blur-3xl ${
        isDark ? 'bg-blue-500/10' : 'bg-blue-200/30'
      }`}></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            <Link to="/" className="inline-block group mb-6">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110 ${
                  isDark 
                    ? "bg-gradient-to-br from-purple-500 to-blue-600" 
                    : "bg-gradient-to-br from-purple-600 to-blue-700"
                }`}>
                  <i className="fa-solid fa-crown text-white text-xl"></i>
                </div>
                <div>
                  <h3 className={`text-2xl font-bold font-orbitron transition-colors duration-300 ${
                    isDark ? "text-white group-hover:text-purple-300" : "text-gray-900 group-hover:text-purple-600"
                  }`}>
                    SEVENXLEAKS
                  </h3>
                  <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                    Premium Content Platform
                  </p>
                </div>
              </div>
            </Link>
            
            <p className={`text-base leading-relaxed mb-6 max-w-md ${
              isDark ? "text-gray-300" : "text-gray-600"
            }`}>
              Your ultimate destination for exclusive content. Join our community and unlock premium experiences.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  whileHover={{ scale: 1.1, y: -2 }}
                  className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl ${
                    isDark
                      ? "bg-gray-800/60 hover:bg-purple-500/20 border border-gray-700/50 hover:border-purple-500/50 text-gray-300 hover:text-purple-400"
                      : "bg-gray-100 hover:bg-purple-100 border border-gray-200 hover:border-purple-300 text-gray-600 hover:text-purple-600"
                  }`}
                  title={social.name}
                >
                  <i className={`${social.icon} text-lg`}></i>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <h4 className={`text-lg font-bold mb-6 font-orbitron ${
              isDark ? "text-white" : "text-gray-900"
            }`}>
              Quick Links
            </h4>
            <ul className="space-y-3">
              {footerLinks.map((link, index) => (
                <motion.li
                  key={link.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-2 transition-all duration-300 group ${
                        isDark 
                          ? "text-gray-400 hover:text-purple-400" 
                          : "text-gray-600 hover:text-purple-600"
                      }`}
                    >
                      <span className="group-hover:translate-x-1 transition-transform duration-300">
                        {link.name}
                      </span>
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </a>
                  ) : (
                    <Link
                      to={link.href}
                      className={`block transition-all duration-300 group ${
                        isDark 
                          ? "text-gray-400 hover:text-purple-400" 
                          : "text-gray-600 hover:text-purple-600"
                      }`}
                    >
                      <span className="group-hover:translate-x-1 transition-transform duration-300 inline-block">
                        {link.name}
                      </span>
                    </Link>
                  )}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <h4 className={`text-lg font-bold mb-6 font-orbitron ${
              isDark ? "text-white" : "text-gray-900"
            }`}>
              Contact
            </h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center mt-0.5 ${
                  isDark 
                    ? "bg-red-500/20 text-red-400" 
                    : "bg-red-100 text-red-600"
                }`}>
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <p className={`text-sm font-medium mb-1 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}>
                    DMCA
                  </p>
                  <a 
                    href="mailto:dmca@sevenxleaks.com"
                    className={`text-sm transition-colors duration-300 ${
                      isDark 
                        ? "text-gray-400 hover:text-red-400" 
                        : "text-gray-600 hover:text-red-600"
                    }`}
                  >
                    dmca@sevenxleaks.com
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className={`mt-12 pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4 ${
            isDark ? "border-gray-800/50" : "border-gray-200"
          }`}
        >
          <div className="flex items-center gap-2">
            <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              © {currentYear} SEVENXLEAKS. All rights reserved.
            </p>
            <div className="flex items-center gap-1">
              <span className={`text-sm ${isDark ? "text-gray-500" : "text-gray-500"}`}>
                Made with
              </span>
              <Heart className={`w-4 h-4 ${isDark ? "text-red-400" : "text-red-500"} animate-pulse`} />
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <Link 
              to="/plans"
              className={`text-sm transition-colors duration-300 ${
                isDark 
                  ? "text-gray-400 hover:text-purple-400" 
                  : "text-gray-600 hover:text-purple-600"
              }`}
            >
              Privacy Policy
            </Link>
            <Link 
              to="/plans"
              className={`text-sm transition-colors duration-300 ${
                isDark 
                  ? "text-gray-400 hover:text-purple-400" 
                  : "text-gray-600 hover:text-purple-600"
              }`}
            >
              Terms of Service
            </Link>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
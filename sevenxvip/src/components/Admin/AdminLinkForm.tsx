import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Edit2, X, Save, Calendar, Tag, Link as LinkIcon } from "lucide-react";
import { LinkItem } from "../../utils/index";
import { useTheme } from "../../contexts/ThemeContext";

interface AdminLinkFormProps {
  newLink: LinkItem;
  setNewLink: React.Dispatch<React.SetStateAction<LinkItem>>;
  categories: string[];
  isEditing: number | null;
  setIsEditing: React.Dispatch<React.SetStateAction<number | null>>;
  handleAddLink: () => Promise<void>;
  handleUpdateLink: () => Promise<void>;
  isLoading: boolean;
}

const AdminLinkForm: React.FC<AdminLinkFormProps> = ({
  newLink,
  setNewLink,
  categories,
  isEditing,
  setIsEditing,
  handleAddLink,
  handleUpdateLink,
  isLoading,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      await handleUpdateLink();
    } else {
      await handleAddLink();
    }
    setIsFormOpen(false);
  };

  const handleCancel = () => {
    setIsEditing(null);
    setNewLink({
      id: 0,
      name: "",
      link: "",
      link2: "",
      linkP: "",
      linkG: "",
      linkMV1: "",
      linkMV2: "",
      linkMV3: "",
      linkMV4: "",
      category: "",
      postDate: new Date().toISOString().split("T")[0],
      createdAt: "",
      updatedAt: "",
      slug: "",
    });
    setIsFormOpen(false);
  };

  return (
    <div>
      {!isFormOpen && !isEditing ? (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsFormOpen(true)}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 shadow-lg ${
            isDark
              ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
              : "bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white"
          }`}
        >
          <Plus className="w-5 h-5" />
          Add New Content
        </motion.button>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`border rounded-xl p-6 ${
            isDark
              ? "bg-gray-700/30 border-gray-600"
              : "bg-gray-100/50 border-gray-300"
          }`}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                isEditing 
                  ? isDark 
                    ? "bg-yellow-500/20 text-yellow-400"
                    : "bg-yellow-100 text-yellow-600"
                  : isDark
                    ? "bg-blue-500/20 text-blue-400"
                    : "bg-blue-100 text-blue-600"
              }`}>
                {isEditing ? <Edit2 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
              </div>
              <h3 className={`text-xl font-semibold ${
                isDark ? "text-white" : "text-gray-900"
              }`}>
                {isEditing ? "Edit Content" : "Add New Content"}
              </h3>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleCancel}
              className={`p-2 rounded-full transition-colors ${
                isDark
                  ? "text-gray-400 hover:text-white hover:bg-gray-600"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-200"
              }`}
            >
              <X className="w-5 h-5" />
            </motion.button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}>
                  Content Name *
                </label>
                <input
                  type="text"
                  value={newLink.name}
                  onChange={(e) => setNewLink({ ...newLink, name: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    isDark
                      ? "bg-gray-800/50 border-gray-600 text-white placeholder-gray-400"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                  }`}
                  placeholder="Enter content name"
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}>
                  Category *
                </label>
                <select
                  value={newLink.category}
                  onChange={(e) => setNewLink({ ...newLink, category: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    isDark
                      ? "bg-gray-800/50 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}>
                MEGA Link *
              </label>
              <input
                type="url"
                value={newLink.link}
                onChange={(e) => setNewLink({ ...newLink, link: e.target.value })}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  isDark
                    ? "bg-gray-800/50 border-gray-600 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                }`}
                placeholder="https://mega.nz/..."
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}>
                  Primary MEGA Link *
                </label>
                <input
                  type="url"
                  value={newLink.linkG}
                  onChange={(e) => setNewLink({ ...newLink, link2: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    isDark
                      ? "bg-gray-800/50 border-gray-600 text-white placeholder-gray-400"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                  }`}
                  placeholder="https://mega.nz/..."
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}>
                  Secondary MEGA Link
                </label>
                <input
                  type="url"
                  value={newLink.linkP}
                  onChange={(e) => setNewLink({ ...newLink, linkP: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    isDark
                      ? "bg-gray-800/50 border-gray-600 text-white placeholder-gray-400"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                  }`}
                  placeholder="https://pixeldrain.com/..."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}>
                  Admaven MEGA Link
                </label>
                <input
                  type="url"
                  value={newLink.linkMV1 || ""}
                  onChange={(e) => setNewLink({ ...newLink, linkMV1: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    isDark
                      ? "bg-gray-800/50 border-gray-600 text-white placeholder-gray-400"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                  }`}
                  placeholder="https://mega.nz/..."
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}>
                  Admaven MEGA 2 Link
                </label>
                <input
                  type="url"
                  value={newLink.linkMV4 || ""}
                  onChange={(e) => setNewLink({ ...newLink, linkMV4: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    isDark
                      ? "bg-gray-800/50 border-gray-600 text-white placeholder-gray-400"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                  }`}
                  placeholder="https://mega.nz/..."
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}>
                  Admaven Pixeldrain Link
                </label>
                <input
                  type="url"
                  value={newLink.linkMV2 || ""}
                  onChange={(e) => setNewLink({ ...newLink, linkMV2: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    isDark
                      ? "bg-gray-800/50 border-gray-600 text-white placeholder-gray-400"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                  }`}
                  placeholder="https://pixeldrain.com/..."
                />
              </div>
            </div>


            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}>
                Post Date
              </label>
              <input
                type="date"
                value={newLink.postDate}
                onChange={(e) => setNewLink({ ...newLink, postDate: e.target.value })}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  isDark
                    ? "bg-gray-800/50 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={handleCancel}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  isDark
                    ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                }`}
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors ${
                  isLoading
                    ? isDark
                      ? "bg-gray-600 cursor-not-allowed"
                      : "bg-gray-300 cursor-not-allowed"
                    : isEditing
                      ? "bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700"
                      : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                } text-white`}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {isEditing ? "Updating..." : "Adding..."}
                  </>
                ) : (
                  <>
                    {isEditing ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    {isEditing ? "Update Content" : "Add Content"}
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      )}
    </div>
  );
};

export default AdminLinkForm;
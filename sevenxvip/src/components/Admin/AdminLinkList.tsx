import React, { useRef, useCallback } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Edit2, Trash2, LinkIcon, ExternalLink, Calendar, Tag, Image } from "lucide-react";
import { LinkItem } from "../../utils/index";
import { useTheme } from "../../contexts/ThemeContext";
import { motion } from "framer-motion";

// Interface corrigida para incluir apenas as props que este componente usa.
export interface AdminLinkListProps {
  links: LinkItem[];
  isLoading: boolean;
  handleEditLink: (id: number) => void;
  handleDeleteLink: (id: number) => Promise<void>;
  hasMore: boolean;
  loadMore: () => void;
}

const AdminLinkList: React.FC<AdminLinkListProps> = ({
  links = [],
  isLoading,
  handleEditLink,
  handleDeleteLink,
  hasMore,
  loadMore,
}) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const rowVirtualizer = useVirtualizer({
    count: links.length,
    getScrollElement: () => parentRef.current,
    estimateSize: useCallback(() => 200, []),
    overscan: 5,
  });

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const target = e.target as HTMLDivElement;
      if (
        target.scrollHeight - target.scrollTop <= target.clientHeight * 1.5 &&
        hasMore &&
        !isLoading
      ) {
        loadMore();
      }
    },
    [hasMore, isLoading, loadMore]
  );

  if (isLoading && links.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div
          className={`animate-spin h-8 w-8 border-4 rounded-full border-t-transparent ${
            isDark ? "border-blue-500" : "border-blue-600"
          }`}
        ></div>
      </div>
    );
  }

  return (
    <div
      ref={parentRef}
      onScroll={handleScroll}
      className="h-[600px] overflow-auto"
      style={{ contain: "strict" }}
    >
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const link = links[virtualRow.index];
          return (
            <div
              key={link.id}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <div
                className={`border rounded-lg p-4 m-2 ${
                  isDark ? "bg-gray-700/30 border-gray-600" : "bg-gray-100/50 border-gray-300"
                }`}
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <h3
                      className={`font-medium text-lg ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {link.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          isDark ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {link.category}
                      </span>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-gray-400" />
                      <span
                        className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}
                      >
                        {new Date(link.postDate).toLocaleDateString()}
                      </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleEditLink(link.id!)}
                      className="p-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg transition-colors text-white shadow-lg"
                      title="Edit content"
                    >
                      <Edit2 className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDeleteLink(link.id!)}
                      className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors text-white shadow-lg"
                      title="Delete content"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>

                <div
                  className={`space-y-2 text-sm ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  <div className="flex items-center gap-2 p-2 bg-gray-600/20 rounded-lg">
                    <LinkIcon className="w-4 h-4" />
                    <span className="font-medium text-xs">Primary MEGA:</span>
                    <span className="truncate">{link.link}</span>
                    <a
                      href={link.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`p-1 rounded-full transition-colors ${
                        isDark ? "hover:bg-gray-600" : "hover:bg-gray-200"
                      }`}
                      title="Open MEGA link"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  {link.linkP && (
                    <div className="flex items-center gap-2 p-2 bg-blue-600/20 rounded-lg">
                      <LinkIcon className="w-4 h-4" />
                      <span className="font-medium text-xs">Pixeldrain:</span>
                      <span className="truncate">{link.linkP}</span>
                      <a
                        href={link.linkP}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`p-1 rounded-full transition-colors ${
                          isDark ? "hover:bg-gray-600" : "hover:bg-gray-200"
                        }`}
                        title="Open Pixeldrain link"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}

                  {link.linkG && (
                    <div className="flex items-center gap-2 p-2 bg-green-600/20 rounded-lg">
                      <LinkIcon className="w-4 h-4" />
                      <span className="font-medium text-xs">Secondary MEGA:</span>
                      <span className="truncate">{link.linkG}</span>
                      <a
                        href={link.linkG}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`p-1 rounded-full transition-colors ${
                          isDark ? "hover:bg-gray-600" : "hover:bg-gray-200"
                        }`}
                        title="Open MEGA 2 link"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}

                 

                  <div className="grid grid-cols-1 gap-2 mt-2">
                    {link.linkMV1 && (
                      <div className="flex items-center gap-2 p-2 bg-orange-600/20 rounded-lg">
                        <LinkIcon className="w-3 h-3" />
                        <span className="font-medium text-xs">Admaven MEGA:</span>
                        <span className="truncate">{link.linkMV1}</span>
                      </div>
                    )}
                    {link.linkMV4 && (
                      <div className="flex items-center gap-2 p-2 bg-orange-600/20 rounded-lg">
                        <LinkIcon className="w-3 h-3" />
                        <span className="font-medium text-xs">Admaven MEGA 2:</span>
                        <span className="truncate">{link.linkMV4}</span>
                      </div>
                    )}
                    {link.linkMV2 && (
                      <div className="flex items-center gap-2 p-2 bg-orange-600/20 rounded-lg">
                        <LinkIcon className="w-3 h-3" />
                        <span className="font-medium text-xs">Admaven Pixeldrain:</span>
                        <span className="truncate">{link.linkMV2}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {isLoading && links.length > 0 && (
        <div className="flex justify-center py-4">
          <div
            className={`animate-spin h-8 w-8 border-4 rounded-full border-t-transparent ${
              isDark ? "border-blue-500" : "border-blue-600"
            }`}
          ></div>
        </div>
      )}
      {!isLoading && !hasMore && links.length > 0 && (
        <div className={`text-center py-4 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
          No more content to load
        </div>
      )}
      {links.length === 0 && (
        <div className={`text-center py-12 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
          No content found
        </div>
      )}
    </div>
  );
};

export default React.memo(AdminLinkList);
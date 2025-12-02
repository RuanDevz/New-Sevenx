import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface ContentCardProps {
  id: string;
  name: string;
  category: string;
  postDate: string;
  slug: string;
  thumbnail?: string;
  isVip?: boolean;
  isBanned?: boolean;
  isUnknown?: boolean;
  isNew?: boolean;
  index?: number;
}

const ContentCard: React.FC<ContentCardProps> = ({
  name,
  category,
  postDate,
  slug,
  thumbnail,
  isVip = false,
  isBanned = false,
  isUnknown = false,
  isNew = false,
  index = 0
}) => {
  const getPath = () => {
    if (isBanned) return `/banned/${slug}`;
    if (isUnknown) return `/unknown/${slug}`;
    if (isVip) return `/vip/${slug}`;
    return `/free/${slug}`;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      className="post-item"
    >
      <Link to={getPath()} className="w-full">
        <div className="post-title-container">
          <h3>{name}</h3>
          {isNew && <span className="tag tag-new">NEW</span>}
          {isVip && (
            <span className="tag" style={{ backgroundColor: 'var(--accent-vip)', color: '#111' }}>
              <i className="fa-solid fa-crown mr-1"></i>
              VIP
            </span>
          )}
          {isBanned && (
            <span className="tag" style={{ backgroundColor: 'var(--accent-banned)', color: '#fff' }}>
              <i className="fa-solid  mr-1"></i>
              BANNED
            </span>
          )}
          {isUnknown && (
            <span className="tag" style={{ backgroundColor: 'var(--accent-unknown)', color: '#fff' }}>
              <i className="fa-solid  mr-1"></i>
              UNKNOWN
            </span>
          )}
        </div>
        <div className="tags">
          <span className="tag">{category}</span>
        </div>
      </Link>
    </motion.div>
  );
};

export default ContentCard;
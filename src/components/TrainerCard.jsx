import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Tag, Typography, Space, Rate, Tooltip } from 'antd';
import {
  Clock,
  Award,
  Calendar,
  Star,
  TrendingUp,
  User
} from 'lucide-react';
import { getCategoryColor, getCategoryLabel } from '../data/trainerData';

const { Text, Paragraph } = Typography;

const FALLBACK_IMAGE = 'https://api.dicebear.com/7.x/avataaars/svg?seed=trainer';

const TrainerCard = ({ trainer, onBook }) => {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const {
    name,
    category,
    specialization,
    experience,
    rating,
    reviewCount,
    bio,
    availability,
    price,
    image,
    isTopRated,
    certifications
  } = trainer;

  const handleImageError = () => {
    setImgError(true);
  };

  const handleImageLoad = () => {
    setImgLoaded(true);
  };

  const getAvailabilityConfig = (status) => {
    const configs = {
      available: { color: '#52c41a', text: 'Available Now', bg: '#f6ffed' },
      busy: { color: '#faad14', text: 'Busy', bg: '#fffbe6' },
      offline: { color: '#ff4d4f', text: 'Offline', bg: '#fff2f0' }
    };
    return configs[status] || configs.available;
  };

  const availabilityConfig = getAvailabilityConfig(availability);

  // Navigate to trainer profile when card is clicked
  const handleCardClick = () => {
    navigate(`/trainer-dashboard/${trainer.id}`);
  };

  // Handle book button click - prevent card navigation
  const handleBookClick = (e) => {
    e.stopPropagation();
    onBook?.(trainer);
  };

  return (
    <Card
      className="trainer-card"
      hoverable
      onClick={handleCardClick}
      style={{
        borderRadius: '20px',
        overflow: 'hidden',
        border: 'none',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer'
      }}
      styles={{ body: { padding: 0, flex: 1, display: 'flex', flexDirection: 'column' } }}
    >
      {/* Top Badge */}
      {isTopRated && (
        <div className="top-rated-badge">
          <TrendingUp size={12} />
          <span>Top Rated</span>
        </div>
      )}

      {/* Image Section */}
      <div className="trainer-image-container">
        <div className="trainer-image-wrapper">
          {!imgLoaded && !imgError && (
            <div className="image-placeholder">
              <User size={40} color="#ccc" />
            </div>
          )}
          <img
            src={imgError ? FALLBACK_IMAGE : image}
            alt={name}
            className={`trainer-image ${imgLoaded ? 'loaded' : ''}`}
            onError={handleImageError}
            onLoad={handleImageLoad}
            loading="lazy"
          />
        </div>

        {/* Availability Badge */}
        <div
          className="availability-badge"
          style={{
            background: availabilityConfig.bg,
            color: availabilityConfig.color,
            border: `1px solid ${availabilityConfig.color}`
          }}
        >
          <span className="availability-dot" style={{ background: availabilityConfig.color }} />
          {availabilityConfig.text}
        </div>
      </div>

      {/* Content Section */}
      <div className="trainer-content">
        {/* Category Tag */}
        <Tag
          color={getCategoryColor(category)}
          style={{
            borderRadius: '12px',
            fontSize: '11px',
            fontWeight: 600,
            marginBottom: '12px'
          }}
        >
          {getCategoryLabel(category)}
        </Tag>

        {/* Name */}
        <Text strong style={{ fontSize: '18px', display: 'block', marginBottom: '4px' }}>
          {name}
        </Text>

        {/* Specialization */}
        <Text type="secondary" style={{ fontSize: '13px', display: 'block', marginBottom: '12px' }}>
          {specialization}
        </Text>

        {/* Stats Row */}
        <div className="trainer-stats">
          <div className="stat-item">
            <Clock size={14} color="#666" />
            <span>{experience} Years</span>
          </div>
          <div className="stat-item rating">
            <Star size={14} color="#faad14" fill="#faad14" />
            <span>{rating}</span>
            <Text type="secondary" style={{ fontSize: '11px' }}>({reviewCount})</Text>
          </div>
        </div>

        {/* Bio */}
        <Paragraph
          ellipsis={{ rows: 2 }}
          style={{
            fontSize: '13px',
            color: '#666',
            marginBottom: '12px',
            lineHeight: '1.5'
          }}
        >
          {bio}
        </Paragraph>

        {/* Certifications */}
        <div className="certifications">
          {certifications?.slice(0, 2).map((cert, idx) => (
            <Tooltip key={idx} title={cert}>
              <Tag
                icon={<Award size={10} />}
                style={{
                  fontSize: '10px',
                  borderRadius: '4px',
                  background: '#f5f5f5',
                  border: 'none',
                  color: '#666'
                }}
              >
                {cert}
              </Tag>
            </Tooltip>
          ))}
        </div>

        {/* Spacer to push footer to bottom */}
        <div style={{ flex: 1 }} />

        {/* Footer */}
        <div className="trainer-footer">
          <div className="price-section">
            <Text type="secondary" style={{ fontSize: '11px' }}>Starting from</Text>
            <Text strong style={{ fontSize: '18px', color: '#2d6a4f' }}>
              ₹{price.toLocaleString()}
            </Text>
            <Text type="secondary" style={{ fontSize: '11px' }}>/session</Text>
          </div>
          <Button
            type="primary"
            icon={<Calendar size={16} />}
            onClick={handleBookClick}
            disabled={availability === 'offline'}
            style={{
              borderRadius: '10px',
              height: '42px',
              fontWeight: 600
            }}
          >
            Book Now
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default TrainerCard;

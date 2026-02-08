import { Tag, Button, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { Star, Clock, ArrowRight, Award, TrendingUp } from 'lucide-react';
import { getCategoryColor, getCategoryLabel } from '../data/trainerData';
import { useSearch } from '../context/SearchContext';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import './FeaturedTrainers.css';

const { Text, Title } = Typography;

const FeaturedTrainers = () => {
  const navigate = useNavigate();
  const { allTrainers } = useSearch();

  // Get top 5 rated trainers for swiper
  const featuredTrainers = allTrainers
    .filter(t => t.isTopRated)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 5);

  return (
    <div className="featured-trainers-section">
      <div className="featured-header">
        <div className="featured-title-row">
          <TrendingUp size={20} color="#f7931e" />
          <Title level={4} style={{ margin: 0, color: '#1b4332' }}>
            Top Rated Experts
          </Title>
        </div>
        <Button
          type="link"
          onClick={() => navigate('/experts/all')}
          style={{ color: '#1b4332', fontWeight: 600, padding: 0 }}
        >
          See All <ArrowRight size={14} />
        </Button>
      </div>

      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={0}
        slidesPerView={1}
        centeredSlides={false}
        loop={true}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
          pauseOnMouseEnter: true
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true
        }}
        navigation={true}
        className="featured-swiper"
      >
        {featuredTrainers.map((trainer) => (
          <SwiperSlide key={trainer.id}>
            <div
              className="featured-card"
              onClick={() => navigate('/experts/all')}
            >
              <div
                className="featured-card-bg"
                style={{
                  backgroundImage: `url(${trainer.image})`
                }}
              />
              {/* Gradient Overlay */}
              <div className="featured-overlay" />

              {/* Top Badge */}
              <div className="featured-top-badge">
                <Award size={18} color="#fff" />
                <span>Top Rated</span>
              </div>

              {/* Rating Badge */}
              <div className="featured-rating-badge">
                <Star size={16} color="#faad14" fill="#faad14" />
                <span>{trainer.rating}</span>
              </div>

              {/* Content Overlay */}
              <div className="featured-card-content">
                <div className="featured-info">
                  <Text strong className="featured-name">{trainer.name}</Text>
                  <Tag
                    color={getCategoryColor(trainer.category)}
                    className="featured-category-tag"
                  >
                    {getCategoryLabel(trainer.category)}
                  </Tag>

                  <div className="featured-stats">
                    <div className="stat-box">
                      <Clock size={20} color="#fff" />
                      <div className="stat-content">
                        <span className="stat-value">{trainer.experience}+</span>
                        <span className="stat-label">Years Exp</span>
                      </div>
                    </div>
                    <div className="stat-box price-box">
                      <div className="stat-content">
                        <span className="stat-value price">₹{trainer.price.toLocaleString()}</span>
                        <span className="stat-label">per session</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="featured-action">
                  <Button
                    type="primary"
                    className="featured-book-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/book/${trainer.id}`);
                    }}
                  >
                    Book Now
                  </Button>
                  <span
                    className="view-profile"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/trainer-dashboard/${trainer.id}`);
                    }}
                  >
                    View Profile →
                  </span>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default FeaturedTrainers;

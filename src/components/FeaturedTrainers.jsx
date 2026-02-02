import { Card, Avatar, Tag, Button, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { Star, Clock, ArrowRight, Award, TrendingUp } from 'lucide-react';
import { TRAINER_DATA, getCategoryColor, getCategoryLabel } from '../data/trainerData';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import './FeaturedTrainers.css';

const { Text, Title } = Typography;

const FeaturedTrainers = () => {
  const navigate = useNavigate();

  // Get top 5 rated trainers for swiper
  const featuredTrainers = TRAINER_DATA
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
        spaceBetween={16}
        slidesPerView={1.1}
        centeredSlides={true}
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
        breakpoints={{
          480: {
            slidesPerView: 1.15,
            spaceBetween: 16
          },
          640: {
            slidesPerView: 1.2,
            spaceBetween: 20
          },
          768: {
            slidesPerView: 1.25,
            spaceBetween: 24
          },
          992: {
            slidesPerView: 1.3,
            spaceBetween: 24
          },
          1200: {
            slidesPerView: 1.35,
            spaceBetween: 28
          }
        }}
        className="featured-swiper"
      >
        {featuredTrainers.map((trainer) => (
          <SwiperSlide key={trainer.id}>
            <Card
              className="featured-card"
              hoverable
              onClick={() => navigate('/experts/all')}
            >
              <div className="featured-card-content">
                {/* Left: Avatar Section */}
                <div className="featured-avatar-section">
                  <div className="avatar-wrapper">
                    <Avatar
                      size={120}
                      src={trainer.image}
                    />
                    <div className="featured-badge">
                      <Award size={16} />
                    </div>
                  </div>
                  <div className="avatar-rating">
                    <Star size={14} color="#faad14" fill="#faad14" />
                    <span>{trainer.rating}</span>
                  </div>
                </div>

                {/* Center: Info */}
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
                      <Clock size={18} color="#2d6a4f" />
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

                {/* Right: Action */}
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
                  <span className="view-profile">View Profile →</span>
                </div>
              </div>
            </Card>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default FeaturedTrainers;

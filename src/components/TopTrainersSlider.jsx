import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Segmented, Space, Button, message } from 'antd';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

// Import Swiper core and modules styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

import TrainerCard from './TrainerCard';
import { CATEGORY_OPTIONS } from '../data/trainerData';
import { useSearch } from '../context/SearchContext';
import './TopTrainersSlider.css';

const { Title, Paragraph } = Typography;

const TopTrainersSlider = () => {
  const navigate = useNavigate();
  const { allTrainers } = useSearch();
  const [activeFilter, setActiveFilter] = useState('all');
  const [swiperRef, setSwiperRef] = useState(null);

  // Filter trainers based on category
  const filteredTrainers = activeFilter === 'all'
    ? allTrainers
    : allTrainers.filter(trainer => trainer.category === activeFilter);

  // Sort to show top-rated first
  const sortedTrainers = [...filteredTrainers].sort((a, b) => {
    if (a.isTopRated && !b.isTopRated) return -1;
    if (!a.isTopRated && b.isTopRated) return 1;
    return b.rating - a.rating;
  });

  const handlePrevious = useCallback(() => {
    swiperRef?.slidePrev();
  }, [swiperRef]);

  const handleNext = useCallback(() => {
    swiperRef?.slideNext();
  }, [swiperRef]);

  const handleBook = (trainer) => {
    navigate(`/book/${trainer.id}`);
  };

  return (
    <div className="top-trainers-section">
      {/* Section Header */}
      <div className="section-header">
        <div className="header-content">
          <Space align="center" size={12}>
            <div className="header-icon">
              <Sparkles size={24} color="#fff" />
            </div>
            <div>
              <Title level={2} style={{ margin: 0, color: '#1b4332' }}>
                Top Trainers
              </Title>
              <Paragraph type="secondary" style={{ margin: 0 }}>
                Connect with certified experts for your wellness journey
              </Paragraph>
            </div>
          </Space>
        </div>

        {/* Navigation Arrows */}
        <div className="nav-arrows">
          <Button
            type="text"
            shape="circle"
            icon={<ChevronLeft size={20} />}
            onClick={handlePrevious}
            className="nav-arrow"
          />
          <Button
            type="text"
            shape="circle"
            icon={<ChevronRight size={20} />}
            onClick={handleNext}
            className="nav-arrow"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="filter-container">
        <Segmented
          options={CATEGORY_OPTIONS.map(opt => ({
            label: opt.label,
            value: opt.value
          }))}
          value={activeFilter}
          onChange={setActiveFilter}
          size="large"
          className="category-filter"
        />
      </div>

      {/* Swiper Slider */}
      <div className="swiper-container">
        <Swiper
          onSwiper={setSwiperRef}
          modules={[Autoplay, Pagination, Navigation]}
          spaceBetween={16}
          slidesPerView={1}
          centeredSlides={false}
          loop={sortedTrainers.length > 3}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true
          }}
          pagination={{
            clickable: true
          }}
          navigation={true}
          breakpoints={{
            576: {
              slidesPerView: 2,
              spaceBetween: 16
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 20
            },
            992: {
              slidesPerView: 3,
              spaceBetween: 20
            },
            1200: {
              slidesPerView: 4,
              spaceBetween: 24
            }
          }}
          className="trainers-swiper"
        >
          {sortedTrainers.map((trainer) => (
            <SwiperSlide key={trainer.id}>
              <TrainerCard trainer={trainer} onBook={handleBook} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {sortedTrainers.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
          No trainers found
        </div>
      )}

      {/* View All Link */}
      <div className="view-all-container">
        <Button type="link" size="large" onClick={() => navigate('/experts/all')} style={{ color: '#1b4332', fontWeight: 600 }}>
          View All Trainers →
        </Button>
      </div>
    </div>
  );
};

export default TopTrainersSlider;

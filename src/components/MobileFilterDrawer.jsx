import React from 'react';
import {
  Drawer,
  Select,
  Slider,
  Button,
  Switch,
  Divider,
  Space,
  Typography
} from 'antd';
import {
  X,
  Filter,
  Star,
  Clock,
  IndianRupee,
  Sparkles,
  RotateCcw
} from 'lucide-react';
import { useSearch } from '../context/SearchContext';
import { CATEGORY_OPTIONS } from '../data/trainerData';
import './MobileFilterDrawer.css';

const { Title, Text } = Typography;
const { Option } = Select;

const MobileFilterDrawer = () => {
  const {
    filters,
    updateFilter,
    updateFilters,
    resetFilters,
    hasActiveFilters,
    activeFilterCount,
    filteredTrainers,
    priceRange,
    experienceRange,
    isMobileFilterOpen,
    setIsMobileFilterOpen
  } = useSearch();

  // Rating options
  const ratingOptions = [
    { value: 0, label: 'All Ratings' },
    { value: 4.5, label: '4.5★ & above' },
    { value: 4, label: '4★ & above' },
    { value: 3.5, label: '3.5★ & above' },
    { value: 3, label: '3★ & above' }
  ];

  // Experience options
  const experienceOptions = [
    { value: 0, label: 'All Experience Levels' },
    { value: 3, label: '3+ years experience' },
    { value: 5, label: '5+ years experience' },
    { value: 10, label: '10+ years experience' },
    { value: 15, label: '15+ years experience' }
  ];

  // Availability options
  const availabilityOptions = [
    { value: 'all', label: 'All Availability' },
    { value: 'available', label: 'Available Now' },
    { value: 'busy', label: 'Currently Busy' }
  ];

  // Sort options
  const sortOptions = [
    { value: 'rating', label: 'Top Rated' },
    { value: 'popularity', label: 'Most Popular' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' },
    { value: 'experience', label: 'Most Experienced' },
    { value: 'name', label: 'Name (A-Z)' }
  ];

  const handleClose = () => {
    setIsMobileFilterOpen(false);
  };

  const handleApply = () => {
    setIsMobileFilterOpen(false);
  };

  const handleReset = () => {
    resetFilters();
  };

  return (
    <Drawer
      title={
        <div className="mobile-filter-header">
          <div className="header-title">
            <Filter size={20} />
            <span>Filters & Sort</span>
            {activeFilterCount > 0 && (
              <span className="filter-count">{activeFilterCount}</span>
            )}
          </div>
          <Button
            type="text"
            icon={<X size={20} />}
            onClick={handleClose}
            className="close-btn"
          />
        </div>
      }
      placement="bottom"
      closable={false}
      onClose={handleClose}
      open={isMobileFilterOpen}
      height="85vh"
      className="mobile-filter-drawer"
      footer={
        <div className="mobile-filter-footer">
          <div className="results-info">
            <Sparkles size={16} />
            <span>{filteredTrainers.length} experts found</span>
          </div>
          <Space>
            <Button
              icon={<RotateCcw size={16} />}
              onClick={handleReset}
              disabled={!hasActiveFilters}
            >
              Reset
            </Button>
            <Button type="primary" onClick={handleApply}>
              Apply Filters
            </Button>
          </Space>
        </div>
      }
    >
      <div className="mobile-filter-content">
        {/* Sort By */}
        <div className="filter-section">
          <Title level={5} className="section-title">
            <Star size={18} /> Sort By
          </Title>
          <div className="sort-options">
            {sortOptions.map(option => (
              <div
                key={option.value}
                className={`sort-chip ${filters.sortBy === option.value ? 'active' : ''}`}
                onClick={() => updateFilter('sortBy', option.value)}
              >
                {option.label}
              </div>
            ))}
          </div>
        </div>

        <Divider />

        {/* Category */}
        <div className="filter-section">
          <Title level={5} className="section-title">
            Category
          </Title>
          <div className="category-options">
            {CATEGORY_OPTIONS.map(opt => (
              <div
                key={opt.value}
                className={`category-chip ${filters.category === opt.value ? 'active' : ''}`}
                onClick={() => updateFilter('category', opt.value)}
              >
                {opt.label}
              </div>
            ))}
          </div>
        </div>

        <Divider />

        {/* Price Range */}
        <div className="filter-section">
          <Title level={5} className="section-title">
            <IndianRupee size={18} /> Price Range
          </Title>
          <div className="price-display">
            <span className="price-value">₹{filters.minPrice}</span>
            <span className="price-separator">—</span>
            <span className="price-value">₹{filters.maxPrice}</span>
          </div>
          <Slider
            range
            min={priceRange.min}
            max={priceRange.max}
            value={[filters.minPrice, filters.maxPrice]}
            onChange={([min, max]) => updateFilters({ minPrice: min, maxPrice: max })}
            tooltip={{ formatter: (value) => `₹${value}` }}
            className="price-slider"
          />
          <div className="price-labels">
            <Text type="secondary">₹{priceRange.min}</Text>
            <Text type="secondary">₹{priceRange.max}</Text>
          </div>
        </div>

        <Divider />

        {/* Rating */}
        <div className="filter-section">
          <Title level={5} className="section-title">
            <Star size={18} /> Minimum Rating
          </Title>
          <div className="rating-options">
            {ratingOptions.map(opt => (
              <div
                key={opt.value}
                className={`rating-chip ${filters.minRating === opt.value ? 'active' : ''}`}
                onClick={() => updateFilter('minRating', opt.value)}
              >
                {opt.value > 0 && <Star size={14} fill="#faad14" color="#faad14" />}
                {opt.label}
              </div>
            ))}
          </div>
        </div>

        <Divider />

        {/* Experience */}
        <div className="filter-section">
          <Title level={5} className="section-title">
            <Clock size={18} /> Experience
          </Title>
          <Select
            value={filters.minExperience}
            onChange={(value) => updateFilter('minExperience', value)}
            style={{ width: '100%' }}
            size="large"
            className="experience-select"
          >
            {experienceOptions.map(opt => (
              <Option key={opt.value} value={opt.value}>{opt.label}</Option>
            ))}
          </Select>
        </div>

        <Divider />

        {/* Availability */}
        <div className="filter-section">
          <Title level={5} className="section-title">
            Availability
          </Title>
          <div className="availability-options">
            {availabilityOptions.map(opt => (
              <div
                key={opt.value}
                className={`availability-chip ${filters.availability === opt.value ? 'active' : ''}`}
                onClick={() => updateFilter('availability', opt.value)}
              >
                {opt.value === 'available' && <span className="available-dot" />}
                {opt.label}
              </div>
            ))}
          </div>
        </div>

        <Divider />

        {/* Top Rated Toggle */}
        <div className="filter-section toggle-section">
          <div className="toggle-info">
            <Title level={5} className="section-title" style={{ marginBottom: 0 }}>
              <Sparkles size={18} /> Top Rated Only
            </Title>
            <Text type="secondary">Show only premium rated experts</Text>
          </div>
          <Switch
            checked={filters.isTopRatedOnly}
            onChange={(checked) => updateFilter('isTopRatedOnly', checked)}
            className="top-rated-switch"
          />
        </div>
      </div>
    </Drawer>
  );
};

export default MobileFilterDrawer;

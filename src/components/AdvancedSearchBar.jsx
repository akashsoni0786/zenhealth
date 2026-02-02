import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Input,
  Select,
  Slider,
  Button,
  Space,
  Badge,
  Dropdown,
  Switch,
  Divider,
  Tag,
  Rate
} from 'antd';
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
  Star,
  Clock,
  IndianRupee,
  Filter,
  ArrowUpDown,
  Sparkles
} from 'lucide-react';
import { useSearch } from '../context/SearchContext';
import { CATEGORY_OPTIONS } from '../data/trainerData';
import './AdvancedSearchBar.css';

const { Option } = Select;

// Debounce hook
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

const AdvancedSearchBar = ({ variant = 'default', showFiltersInline = false }) => {
  const navigate = useNavigate();
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
    setIsMobileFilterOpen
  } = useSearch();

  const [localSearchQuery, setLocalSearchQuery] = useState(filters.searchQuery);
  const [isExpanded, setIsExpanded] = useState(false);
  const searchBarRef = useRef(null);

  // Debounced search query
  const debouncedSearchQuery = useDebounce(localSearchQuery, 300);

  // Update filter when debounced value changes
  useEffect(() => {
    updateFilter('searchQuery', debouncedSearchQuery);
  }, [debouncedSearchQuery, updateFilter]);

  // Handle search input
  const handleSearchChange = (e) => {
    setLocalSearchQuery(e.target.value);
  };

  // Handle search submit
  const handleSearchSubmit = useCallback(() => {
    navigate('/search');
  }, [navigate]);

  // Handle key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearchSubmit();
    }
  };

  // Clear search
  const handleClearSearch = () => {
    setLocalSearchQuery('');
    updateFilter('searchQuery', '');
  };

  // Sort options
  const sortOptions = [
    { value: 'rating', label: 'Top Rated', icon: <Star size={14} /> },
    { value: 'popularity', label: 'Most Popular', icon: <Sparkles size={14} /> },
    { value: 'price_low', label: 'Price: Low to High', icon: <IndianRupee size={14} /> },
    { value: 'price_high', label: 'Price: High to Low', icon: <IndianRupee size={14} /> },
    { value: 'experience', label: 'Experience', icon: <Clock size={14} /> },
    { value: 'name', label: 'Name (A-Z)', icon: null }
  ];

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
    { value: 0, label: 'All Experience' },
    { value: 3, label: '3+ years' },
    { value: 5, label: '5+ years' },
    { value: 10, label: '10+ years' },
    { value: 15, label: '15+ years' }
  ];

  // Availability options
  const availabilityOptions = [
    { value: 'all', label: 'All' },
    { value: 'available', label: 'Available Now' },
    { value: 'busy', label: 'Busy' }
  ];

  // Filter dropdown content
  const filterDropdownContent = (
    <div className="filter-dropdown-content">
      <div className="filter-dropdown-header">
        <span className="filter-dropdown-title">
          <Filter size={16} /> Filters
        </span>
        {hasActiveFilters && (
          <Button type="link" size="small" onClick={resetFilters} className="clear-all-btn">
            Clear All
          </Button>
        )}
      </div>

      <Divider style={{ margin: '12px 0' }} />

      {/* Category Filter */}
      <div className="filter-group">
        <label className="filter-label">Category</label>
        <Select
          value={filters.category}
          onChange={(value) => updateFilter('category', value)}
          style={{ width: '100%' }}
          size="middle"
        >
          {CATEGORY_OPTIONS.map(opt => (
            <Option key={opt.value} value={opt.value}>{opt.label}</Option>
          ))}
        </Select>
      </div>

      {/* Price Range Filter */}
      <div className="filter-group">
        <label className="filter-label">
          Price Range: ₹{filters.minPrice} - ₹{filters.maxPrice}
        </label>
        <Slider
          range
          min={priceRange.min}
          max={priceRange.max}
          value={[filters.minPrice, filters.maxPrice]}
          onChange={([min, max]) => updateFilters({ minPrice: min, maxPrice: max })}
          tooltip={{ formatter: (value) => `₹${value}` }}
        />
      </div>

      {/* Rating Filter */}
      <div className="filter-group">
        <label className="filter-label">Minimum Rating</label>
        <Select
          value={filters.minRating}
          onChange={(value) => updateFilter('minRating', value)}
          style={{ width: '100%' }}
          size="middle"
        >
          {ratingOptions.map(opt => (
            <Option key={opt.value} value={opt.value}>{opt.label}</Option>
          ))}
        </Select>
      </div>

      {/* Experience Filter */}
      <div className="filter-group">
        <label className="filter-label">Experience</label>
        <Select
          value={filters.minExperience}
          onChange={(value) => updateFilter('minExperience', value)}
          style={{ width: '100%' }}
          size="middle"
        >
          {experienceOptions.map(opt => (
            <Option key={opt.value} value={opt.value}>{opt.label}</Option>
          ))}
        </Select>
      </div>

      {/* Availability Filter */}
      <div className="filter-group">
        <label className="filter-label">Availability</label>
        <Select
          value={filters.availability}
          onChange={(value) => updateFilter('availability', value)}
          style={{ width: '100%' }}
          size="middle"
        >
          {availabilityOptions.map(opt => (
            <Option key={opt.value} value={opt.value}>{opt.label}</Option>
          ))}
        </Select>
      </div>

      {/* Top Rated Only */}
      <div className="filter-group filter-switch">
        <label className="filter-label">Top Rated Only</label>
        <Switch
          checked={filters.isTopRatedOnly}
          onChange={(checked) => updateFilter('isTopRatedOnly', checked)}
          size="small"
        />
      </div>

      <Divider style={{ margin: '12px 0' }} />

      <div className="filter-dropdown-footer">
        <span className="results-count">{filteredTrainers.length} experts found</span>
        <Button type="primary" size="small" onClick={handleSearchSubmit}>
          View Results
        </Button>
      </div>
    </div>
  );

  // Sort dropdown content
  const sortDropdownContent = (
    <div className="sort-dropdown-content">
      {sortOptions.map(option => (
        <div
          key={option.value}
          className={`sort-option ${filters.sortBy === option.value ? 'active' : ''}`}
          onClick={() => updateFilter('sortBy', option.value)}
        >
          {option.icon}
          <span>{option.label}</span>
        </div>
      ))}
    </div>
  );

  // Active filter tags
  const renderActiveFilters = () => {
    const tags = [];

    if (filters.category !== 'all') {
      const categoryLabel = CATEGORY_OPTIONS.find(c => c.value === filters.category)?.label;
      tags.push(
        <Tag
          key="category"
          closable
          onClose={() => updateFilter('category', 'all')}
          className="active-filter-tag"
        >
          {categoryLabel}
        </Tag>
      );
    }

    if (filters.minPrice > priceRange.min || filters.maxPrice < priceRange.max) {
      tags.push(
        <Tag
          key="price"
          closable
          onClose={() => updateFilters({ minPrice: priceRange.min, maxPrice: priceRange.max })}
          className="active-filter-tag"
        >
          ₹{filters.minPrice} - ₹{filters.maxPrice}
        </Tag>
      );
    }

    if (filters.minRating > 0) {
      tags.push(
        <Tag
          key="rating"
          closable
          onClose={() => updateFilter('minRating', 0)}
          className="active-filter-tag"
        >
          {filters.minRating}★+
        </Tag>
      );
    }

    if (filters.minExperience > 0) {
      tags.push(
        <Tag
          key="experience"
          closable
          onClose={() => updateFilter('minExperience', 0)}
          className="active-filter-tag"
        >
          {filters.minExperience}+ years
        </Tag>
      );
    }

    if (filters.availability !== 'all') {
      tags.push(
        <Tag
          key="availability"
          closable
          onClose={() => updateFilter('availability', 'all')}
          className="active-filter-tag"
        >
          {filters.availability === 'available' ? 'Available' : 'Busy'}
        </Tag>
      );
    }

    if (filters.isTopRatedOnly) {
      tags.push(
        <Tag
          key="topRated"
          closable
          onClose={() => updateFilter('isTopRatedOnly', false)}
          className="active-filter-tag premium"
        >
          <Sparkles size={12} /> Top Rated
        </Tag>
      );
    }

    return tags;
  };

  return (
    <div className={`advanced-search-bar ${variant} ${isExpanded ? 'expanded' : ''}`} ref={searchBarRef}>
      <div className="search-bar-main">
        {/* Search Input */}
        <div className="search-input-wrapper">
          <Search size={20} className="search-icon" />
          <Input
            placeholder="Search trainers, specializations..."
            value={localSearchQuery}
            onChange={handleSearchChange}
            onKeyPress={handleKeyPress}
            onFocus={() => setIsExpanded(true)}
            className="search-input"
            bordered={false}
            suffix={
              localSearchQuery && (
                <X
                  size={16}
                  className="clear-icon"
                  onClick={handleClearSearch}
                />
              )
            }
          />
        </div>

        {/* Desktop Filters */}
        <div className="search-actions desktop-only">
          {/* Category Quick Filter */}
          <Select
            value={filters.category}
            onChange={(value) => updateFilter('category', value)}
            className="category-select"
            suffixIcon={<ChevronDown size={14} />}
            popupMatchSelectWidth={false}
          >
            {CATEGORY_OPTIONS.map(opt => (
              <Option key={opt.value} value={opt.value}>{opt.label}</Option>
            ))}
          </Select>

          {/* Filter Dropdown */}
          <Dropdown
            dropdownRender={() => filterDropdownContent}
            trigger={['click']}
            placement="bottomRight"
          >
            <Badge count={activeFilterCount} size="small" offset={[-4, 4]}>
              <Button
                icon={<SlidersHorizontal size={16} />}
                className="filter-btn"
              >
                Filters
              </Button>
            </Badge>
          </Dropdown>

          {/* Sort Dropdown */}
          <Dropdown
            dropdownRender={() => sortDropdownContent}
            trigger={['click']}
            placement="bottomRight"
          >
            <Button
              icon={<ArrowUpDown size={16} />}
              className="sort-btn"
            >
              Sort
            </Button>
          </Dropdown>

          {/* Search Button */}
          <Button
            type="primary"
            icon={<Search size={16} />}
            onClick={handleSearchSubmit}
            className="search-submit-btn"
          >
            Search
          </Button>
        </div>

        {/* Mobile Filter Button */}
        <div className="search-actions mobile-only">
          <Badge count={activeFilterCount} size="small" offset={[-4, 4]}>
            <Button
              icon={<SlidersHorizontal size={18} />}
              onClick={() => setIsMobileFilterOpen(true)}
              className="mobile-filter-btn"
            />
          </Badge>
          <Button
            type="primary"
            icon={<Search size={18} />}
            onClick={handleSearchSubmit}
            className="mobile-search-btn"
          />
        </div>
      </div>

      {/* Active Filters Row */}
      {hasActiveFilters && (
        <div className="active-filters-row">
          <div className="active-filters-tags">
            {renderActiveFilters()}
          </div>
          <Button
            type="link"
            size="small"
            onClick={resetFilters}
            className="clear-all-link"
          >
            Clear All
          </Button>
        </div>
      )}

      {/* Results Preview (when expanded) */}
      {isExpanded && localSearchQuery && (
        <div className="search-preview">
          <div className="preview-header">
            <span>{filteredTrainers.length} results found</span>
            <Button type="link" size="small" onClick={handleSearchSubmit}>
              View All →
            </Button>
          </div>
          <div className="preview-results">
            {filteredTrainers.slice(0, 3).map(trainer => (
              <div
                key={trainer.id}
                className="preview-item"
                onClick={() => {
                  setIsExpanded(false);
                  navigate('/search');
                }}
              >
                <img src={trainer.image} alt={trainer.name} className="preview-avatar" />
                <div className="preview-info">
                  <span className="preview-name">{trainer.name}</span>
                  <span className="preview-spec">{trainer.specialization}</span>
                </div>
                <div className="preview-rating">
                  <Star size={12} fill="#faad14" color="#faad14" />
                  <span>{trainer.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Click outside handler */}
      {isExpanded && (
        <div className="search-overlay" onClick={() => setIsExpanded(false)} />
      )}
    </div>
  );
};

export default AdvancedSearchBar;

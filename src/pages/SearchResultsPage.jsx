import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Row,
  Col,
  Card,
  Typography,
  Button,
  Pagination,
  Empty,
  Select,
  Space,
  Tag
} from 'antd';
import {
  Search,
  Filter,
  ArrowLeft,
  Grid3X3,
  List,
  Star,
  Clock,
  Sparkles,
  Eye
} from 'lucide-react';
import { useSearch } from '../context/SearchContext';
import AdvancedSearchBar from '../components/AdvancedSearchBar';
import TrainerCard from '../components/TrainerCard';
import MobileFilterDrawer from '../components/MobileFilterDrawer';
import { CATEGORY_OPTIONS, getCategoryColor, getCategoryLabel } from '../data/trainerData';
import './SearchResultsPage.css';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const SearchResultsPage = () => {
  const navigate = useNavigate();
  const {
    filters,
    updateFilter,
    filteredTrainers,
    hasActiveFilters,
    activeFilterCount,
    resetFilters
  } = useSearch();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [viewMode, setViewMode] = useState('grid'); // grid or list

  // Calculate paginated results
  const paginatedTrainers = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredTrainers.slice(startIndex, startIndex + pageSize);
  }, [filteredTrainers, currentPage, pageSize]);

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // Sort options for quick access
  const sortOptions = [
    { value: 'rating', label: 'Top Rated' },
    { value: 'popularity', label: 'Most Popular' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' },
    { value: 'experience', label: 'Experience' },
    { value: 'name', label: 'Name (A-Z)' }
  ];

  // Handle trainer booking
  const handleBook = (trainer) => {
    navigate(`/book/${trainer.id}`);
  };

  // Page size options
  const pageSizeOptions = ['8', '12', '16', '24'];

  return (
    <div className="search-results-page">
      {/* Sticky Search Bar */}
      <div className="sticky-search-header">
        <div className="search-header-content">
          <Button
            type="text"
            icon={<ArrowLeft size={20} />}
            onClick={() => navigate(-1)}
            className="back-btn"
          />
          <div className="search-bar-wrapper">
            <AdvancedSearchBar variant="compact" />
          </div>
        </div>
      </div>

      {/* Results Container */}
      <div className="results-container">
        {/* Results Header */}
        <div className="results-header">
          <div className="results-info">
            <Title level={3} style={{ margin: 0 }}>
              {filters.searchQuery ? (
                <>Results for "{filters.searchQuery}"</>
              ) : (
                <>All Experts</>
              )}
            </Title>
            <Text type="secondary">
              {filteredTrainers.length} expert{filteredTrainers.length !== 1 ? 's' : ''} found
            </Text>
          </div>

          <div className="results-controls">
            {/* View Mode Toggle */}
            <div className="view-toggle">
              <Button
                type={viewMode === 'grid' ? 'primary' : 'default'}
                icon={<Grid3X3 size={16} />}
                onClick={() => setViewMode('grid')}
                className="view-btn"
              />
              <Button
                type={viewMode === 'list' ? 'primary' : 'default'}
                icon={<List size={16} />}
                onClick={() => setViewMode('list')}
                className="view-btn"
              />
            </div>

            {/* Sort Select */}
            <Select
              value={filters.sortBy}
              onChange={(value) => updateFilter('sortBy', value)}
              style={{ width: 160 }}
              className="sort-select"
            >
              {sortOptions.map(opt => (
                <Option key={opt.value} value={opt.value}>{opt.label}</Option>
              ))}
            </Select>
          </div>
        </div>

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <div className="active-filters-summary">
            <div className="filters-list">
              {filters.category !== 'all' && (
                <Tag
                  closable
                  onClose={() => updateFilter('category', 'all')}
                  color={getCategoryColor(filters.category)}
                >
                  {getCategoryLabel(filters.category)}
                </Tag>
              )}
              {(filters.minPrice > 0 || filters.maxPrice < 5000) && (
                <Tag
                  closable
                  onClose={() => updateFilter('minPrice', 0) || updateFilter('maxPrice', 5000)}
                >
                  ₹{filters.minPrice} - ₹{filters.maxPrice}
                </Tag>
              )}
              {filters.minRating > 0 && (
                <Tag closable onClose={() => updateFilter('minRating', 0)}>
                  <Star size={12} /> {filters.minRating}+
                </Tag>
              )}
              {filters.minExperience > 0 && (
                <Tag closable onClose={() => updateFilter('minExperience', 0)}>
                  <Clock size={12} /> {filters.minExperience}+ years
                </Tag>
              )}
              {filters.availability !== 'all' && (
                <Tag closable onClose={() => updateFilter('availability', 'all')}>
                  {filters.availability === 'available' ? 'Available' : 'Busy'}
                </Tag>
              )}
              {filters.isTopRatedOnly && (
                <Tag closable onClose={() => updateFilter('isTopRatedOnly', false)} color="gold">
                  <Sparkles size={12} /> Top Rated
                </Tag>
              )}
            </div>
            <Button type="link" onClick={resetFilters} className="clear-filters-btn">
              Clear All Filters
            </Button>
          </div>
        )}

        {/* Results Grid/List */}
        {filteredTrainers.length > 0 ? (
          <>
            <div className={`results-grid ${viewMode}`}>
              {viewMode === 'grid' ? (
                <Row gutter={[20, 20]}>
                  {paginatedTrainers.map(trainer => (
                    <Col xs={24} sm={12} md={8} lg={6} key={trainer.id}>
                      <TrainerCard trainer={trainer} onBook={handleBook} />
                    </Col>
                  ))}
                </Row>
              ) : (
                <div className="list-view">
                  {paginatedTrainers.map(trainer => (
                    <Card key={trainer.id} className="list-item-card" hoverable>
                      <div className="list-item-content">
                        <div className="list-item-avatar">
                          <img src={trainer.image} alt={trainer.name} />
                          {trainer.isTopRated && (
                            <div className="top-rated-badge-small">
                              <Sparkles size={12} />
                            </div>
                          )}
                        </div>
                        <div className="list-item-info">
                          <div className="list-item-header">
                            <Text strong className="trainer-name">{trainer.name}</Text>
                            <Tag color={getCategoryColor(trainer.category)}>
                              {getCategoryLabel(trainer.category)}
                            </Tag>
                          </div>
                          <Text type="secondary" className="specialization">
                            {trainer.specialization}
                          </Text>
                          <div className="list-item-stats">
                            <span className="stat">
                              <Star size={14} fill="#faad14" color="#faad14" />
                              {trainer.rating} ({trainer.reviewCount})
                            </span>
                            <span className="stat">
                              <Clock size={14} />
                              {trainer.experience} years
                            </span>
                            <span className={`availability ${trainer.availability}`}>
                              <span className="dot" />
                              {trainer.availability === 'available' ? 'Available' : 'Busy'}
                            </span>
                          </div>
                        </div>
                        <div className="list-item-action">
                          <div className="price">
                            <Text strong style={{ fontSize: 20, color: '#1b4332' }}>
                              ₹{trainer.price.toLocaleString()}
                            </Text>
                            <Text type="secondary" style={{ fontSize: 12 }}>
                              per session
                            </Text>
                          </div>
                          <Space>
                            <Button
                              icon={<Eye size={16} />}
                              onClick={() => navigate(`/trainer-dashboard/${trainer.id}`)}
                              className="view-btn"
                            >
                              View
                            </Button>
                            <Button
                              type="primary"
                              onClick={() => handleBook(trainer)}
                              className="book-btn"
                            >
                              Book Now
                            </Button>
                          </Space>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Pagination */}
            <div className="pagination-container">
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={filteredTrainers.length}
                onChange={(page, size) => {
                  setCurrentPage(page);
                  if (size !== pageSize) setPageSize(size);
                }}
                showSizeChanger
                pageSizeOptions={pageSizeOptions}
                showTotal={(total, range) => (
                  <span className="pagination-info">
                    Showing {range[0]}-{range[1]} of {total} experts
                  </span>
                )}
                className="results-pagination"
              />
            </div>
          </>
        ) : (
          <div className="no-results">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <div className="no-results-content">
                  <Title level={4}>No experts found</Title>
                  <Paragraph type="secondary">
                    Try adjusting your search or filters to find what you're looking for.
                  </Paragraph>
                  <Space>
                    <Button onClick={resetFilters}>Clear Filters</Button>
                    <Button type="primary" onClick={() => navigate('/')}>
                      Browse All Experts
                    </Button>
                  </Space>
                </div>
              }
            />
          </div>
        )}
      </div>

      {/* Mobile Filter Drawer */}
      <MobileFilterDrawer />
    </div>
  );
};

export default SearchResultsPage;

import React, { createContext, useState, useContext, useCallback, useMemo } from 'react';
import { TRAINER_DATA, convertRegisteredTrainer } from '../data/trainerData';
import { useTrainerAuth } from './TrainerAuthContext';

const SearchContext = createContext();

// Default filter state
const defaultFilters = {
  searchQuery: '',
  category: 'all',
  minPrice: 0,
  maxPrice: 5000,
  minRating: 0,
  minExperience: 0,
  availability: 'all',
  sortBy: 'rating', // rating, price_low, price_high, experience, name
  isTopRatedOnly: false
};

export const SearchProvider = ({ children }) => {
  const { registeredTrainers, hiddenTrainers, trainerEdits } = useTrainerAuth();
  const [filters, setFilters] = useState(defaultFilters);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Merge static trainers (with edits applied) + verified registered trainers (excluding hidden)
  const allTrainers = useMemo(() => {
    const visibleStatic = TRAINER_DATA
      .filter(t => !hiddenTrainers.includes(t.id))
      .map(t => trainerEdits[t.id] ? { ...t, ...trainerEdits[t.id] } : t);
    const verifiedTrainers = registeredTrainers
      .filter(t => t.status === 'verified')
      .map(convertRegisteredTrainer)
      .filter(t => !hiddenTrainers.includes(t.id));
    return [...visibleStatic, ...verifiedTrainers];
  }, [registeredTrainers, hiddenTrainers, trainerEdits]);

  // Update single filter
  const updateFilter = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  // Update multiple filters at once
  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Reset all filters
  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return (
      filters.searchQuery !== '' ||
      filters.category !== 'all' ||
      filters.minPrice !== 0 ||
      filters.maxPrice !== 5000 ||
      filters.minRating !== 0 ||
      filters.minExperience !== 0 ||
      filters.availability !== 'all' ||
      filters.isTopRatedOnly
    );
  }, [filters]);

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.searchQuery) count++;
    if (filters.category !== 'all') count++;
    if (filters.minPrice > 0 || filters.maxPrice < 5000) count++;
    if (filters.minRating > 0) count++;
    if (filters.minExperience > 0) count++;
    if (filters.availability !== 'all') count++;
    if (filters.isTopRatedOnly) count++;
    return count;
  }, [filters]);

  // Filter and sort trainers
  const filteredTrainers = useMemo(() => {
    let results = [...allTrainers];

    // Search query filter (name, specialization, bio)
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      results = results.filter(trainer =>
        trainer.name.toLowerCase().includes(query) ||
        trainer.specialization.toLowerCase().includes(query) ||
        trainer.bio.toLowerCase().includes(query) ||
        trainer.certifications.some(cert => cert.toLowerCase().includes(query))
      );
    }

    // Category filter
    if (filters.category !== 'all') {
      results = results.filter(trainer => trainer.category === filters.category);
    }

    // Price range filter
    results = results.filter(trainer =>
      trainer.price >= filters.minPrice && trainer.price <= filters.maxPrice
    );

    // Rating filter
    if (filters.minRating > 0) {
      results = results.filter(trainer => trainer.rating >= filters.minRating);
    }

    // Experience filter
    if (filters.minExperience > 0) {
      results = results.filter(trainer => trainer.experience >= filters.minExperience);
    }

    // Availability filter
    if (filters.availability !== 'all') {
      results = results.filter(trainer => trainer.availability === filters.availability);
    }

    // Top rated only filter
    if (filters.isTopRatedOnly) {
      results = results.filter(trainer => trainer.isTopRated);
    }

    // Sorting
    switch (filters.sortBy) {
      case 'rating':
        results.sort((a, b) => b.rating - a.rating);
        break;
      case 'price_low':
        results.sort((a, b) => a.price - b.price);
        break;
      case 'price_high':
        results.sort((a, b) => b.price - a.price);
        break;
      case 'experience':
        results.sort((a, b) => b.experience - a.experience);
        break;
      case 'name':
        results.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'popularity':
        results.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      default:
        break;
    }

    return results;
  }, [filters, allTrainers]);

  // Get price range from data
  const priceRange = useMemo(() => {
    const prices = allTrainers.map(t => t.price);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices)
    };
  }, [allTrainers]);

  // Get experience range from data
  const experienceRange = useMemo(() => {
    const experiences = allTrainers.map(t => t.experience);
    return {
      min: Math.min(...experiences),
      max: Math.max(...experiences)
    };
  }, [allTrainers]);

  return (
    <SearchContext.Provider
      value={{
        filters,
        updateFilter,
        updateFilters,
        resetFilters,
        hasActiveFilters,
        activeFilterCount,
        filteredTrainers,
        allTrainers,
        priceRange,
        experienceRange,
        isSearchOpen,
        setIsSearchOpen,
        isMobileFilterOpen,
        setIsMobileFilterOpen
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};

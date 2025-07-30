import { useQuery } from '@tanstack/react-query';
import { searchAPI } from '../services/api';
import { useEffect, useState } from 'react';

const useSearch = (initialSearchTerm = '', initialFilters = {}) => {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [filters, setFilters] = useState(initialFilters);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(initialSearchTerm);

  // Debounce search term to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Search query
  const searchQuery = useQuery({
    queryKey: ['search', 'all', debouncedSearchTerm, filters],
    queryFn: () => searchAPI.searchAll({ 
      search_keyword: debouncedSearchTerm,
      ...filters 
    }),
    enabled: debouncedSearchTerm.trim().length > 0,
    keepPreviousData: true,
  });

  return {
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    isLoading: searchQuery.isLoading,
    isError: searchQuery.isError,
    error: searchQuery.error,
    data: searchQuery.data,
    refetch: searchQuery.refetch,
  };
};

export default useSearch;
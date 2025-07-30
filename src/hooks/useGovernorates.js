import { useQuery } from '@tanstack/react-query';
import { governoratesAPI } from '../services/api';

export const useGovernorates = () => {
  // Get all governorates
  const useGovernoratesQuery = (options = {}) => {
    return useQuery({
      queryKey: ['governorates'],
      queryFn: () => governoratesAPI.getGovernorates(),
      staleTime: 24 * 60 * 60 * 1000, // 24 hours - governorates don't change often
      ...options,
    });
  };

  return {
    useGovernoratesQuery,
  };
};

export default useGovernorates;
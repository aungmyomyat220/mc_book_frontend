import { useQuery } from '@tanstack/react-query';
import { searchSeriesByName } from '@/services/seriesService';
import type { SearchSeriesResponse } from '@/lib/types';

export function useSearchSeries(name: string, enabled: boolean = true) {
  return useQuery<SearchSeriesResponse, Error>({
    queryKey: ['searchSeries', name],
    queryFn: () => searchSeriesByName(name),
    enabled: !!name && enabled,
    staleTime: 1000 * 60, // 1 minute
  });
} 
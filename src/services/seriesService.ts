import axiosInstance from '@/lib/axios';
import type { SeriesResponse, MostReadSeriesResponse, ChapterListResponse, ChapterImagesResponse } from '@/lib/types';

export async function fetchAllSeries(page = 1, pageSize = 18): Promise<SeriesResponse> {
  const res = await axiosInstance.get('/api/v1/series', {
    params: { page, pageSize },
  });
  return res.data;
}

export async function fetchMostReadSeries(limit = 5): Promise<MostReadSeriesResponse> {
  const res = await axiosInstance.get('/api/v1/series/most-read', {
    params: { limit },
  });
  return res.data;
}

export async function fetchNewChapterReleasedSeries(limit = 5,days = 2): Promise<MostReadSeriesResponse> {
  const res = await axiosInstance.get('/api/v1/series/recent-chapters', {
    params: { limit,days },
  });
  return res.data;
}

export async function searchSeriesByName(name: string) {
  const res = await axiosInstance.get('/api/v1/series/search', {
    params: { name },
  });
  return res.data;
}

export async function fetchSeriesById(id: number | null): Promise<import('@/lib/types').SeriesDetailResponse> {
  const res = await axiosInstance.get(`/api/v1/series/${id}`);  
  return res.data;
}

export async function fetchChaptersBySeriesId(seriesId: number): Promise<ChapterListResponse> {
  const res = await axiosInstance.get(`/api/v1/chapter/series/${seriesId}/numbers`);
  return res.data;
}

export async function fetchChapterImages(seriesId: number, chapterId: number): Promise<ChapterImagesResponse> {
  const res = await axiosInstance.get('/api/v1/chapter/images', {
    params: { seriesId, chapterId },
  });
  return res.data;
}
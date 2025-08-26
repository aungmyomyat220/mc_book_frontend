export interface Series {
  id: number;
  title: string;
  description: string;
  coverImageKey: string;
  createdAt: string;
  updatedAt: string;
  episodes: number;
  genere: string;
  likes: number;
  rating: number;
  status: string;
  views: number;
}

export interface SeriesResponse {
  data: Series[];
  total: number;
  page: number;
  pageSize: number;
}

export interface MostReadSeriesResponse {
  success: boolean;
  series: Series[];
}

export interface SearchSeriesResponse {
  success: boolean;
  series: Series[];
}

export interface SeriesDetailResponse {
  success: boolean;
  series: Series;
}

export interface Chapter {
  id: number;
  title: string;
  description: string;
  date: string;
  views: number;
  published: boolean;
  chapterId: number;
  createdAt: string;
}

export interface ChapterListResponse {
  success: boolean;
  chapters: Chapter[];
}

export interface ChapterImagesResponse {
  success: boolean;
  images: string[];
} 
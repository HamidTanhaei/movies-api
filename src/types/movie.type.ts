export interface Movie {
  id?: number;
  title: string;
  imdb_code?: string;
  year?: number;
  rating?: number;
  genres?: string;
  quality?: string;
  download_count?: number;
  like_count?: number;
  rotten_tomatoes_rating?: number;
  director?: string;
  cast?: string;
  synopsis?: string;
  poster_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface MovieSearchParams {
  title?: string;
  imdb_code?: string;
  actor?: string;
  director?: string;
  quality?: string | string[];
  genre?: string | string[];
  min_rating?: number;
  max_rating?: number;
  min_year?: number;
  max_year?: number;
  sort_by?: 'rating' | 'year' | 'download_count' | 'like_count' | 'title';
  sort_order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface MovieSearchResult {
  movies: Movie[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface MovieCreateRequest {
  title: string;
  imdb_code?: string;
  year?: number;
  rating?: number;
  genres?: string;
  quality?: string;
  download_count?: number;
  like_count?: number;
  rotten_tomatoes_rating?: number;
  director?: string;
  cast?: string;
  synopsis?: string;
  poster_url?: string;
}

export interface MovieUpdateRequest {
  title?: string;
  imdb_code?: string;
  year?: number;
  rating?: number;
  genres?: string;
  quality?: string;
  download_count?: number;
  like_count?: number;
  rotten_tomatoes_rating?: number;
  director?: string;
  cast?: string;
  synopsis?: string;
  poster_url?: string;
}

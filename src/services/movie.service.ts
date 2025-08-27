import { getDatabase } from '../config/database.config';
import {
  Movie,
  MovieSearchParams,
  MovieSearchResult,
  MovieCreateRequest,
  MovieUpdateRequest,
} from '../types/movie.type';

export class MovieService {
  private db = getDatabase();

  async createMovie(movieData: MovieCreateRequest): Promise<Movie> {
    const stmt = this.db.prepare(`
      INSERT INTO movies (
        title, imdb_code, year, rating, genres, quality, 
        download_count, like_count, rotten_tomatoes_rating, 
        director, cast, synopsis, poster_url
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      movieData.title,
      movieData.imdb_code,
      movieData.year,
      movieData.rating,
      movieData.genres,
      movieData.quality,
      movieData.download_count || 0,
      movieData.like_count || 0,
      movieData.rotten_tomatoes_rating,
      movieData.director,
      movieData.cast,
      movieData.synopsis,
      movieData.poster_url
    );

    const movie = await this.getMovieById(result.lastInsertRowid as number);
    if (!movie) {
      throw new Error('Failed to create movie');
    }
    return movie;
  }

  async getMovieById(id: number): Promise<Movie | null> {
    const stmt = this.db.prepare('SELECT * FROM movies WHERE id = ?');
    const movie = stmt.get(id) as Movie | undefined;
    return movie || null;
  }

  async getMovieByImdbCode(imdbCode: string): Promise<Movie | null> {
    const stmt = this.db.prepare('SELECT * FROM movies WHERE imdb_code = ?');
    const movie = stmt.get(imdbCode) as Movie | undefined;
    return movie || null;
  }

  async searchMovies(params: MovieSearchParams): Promise<MovieSearchResult> {
    const {
      title,
      imdb_code,
      actor,
      director,
      quality,
      genre,
      min_rating,
      max_rating,
      min_year,
      max_year,
      sort_by = 'rating',
      sort_order = 'desc',
      page = 1,
      limit = 20,
    } = params;

    let whereConditions: string[] = [];
    let queryParams: any[] = [];

    if (title) {
      whereConditions.push('title LIKE ?');
      queryParams.push(`%${title}%`);
    }

    if (imdb_code) {
      whereConditions.push('imdb_code = ?');
      queryParams.push(imdb_code);
    }

    if (actor) {
      whereConditions.push('cast LIKE ?');
      queryParams.push(`%${actor}%`);
    }

    if (director) {
      whereConditions.push('director LIKE ?');
      queryParams.push(`%${director}%`);
    }

    if (quality) {
      if (Array.isArray(quality)) {
        if (quality.length > 0) {
          const placeholders = quality.map(() => '?').join(',');
          whereConditions.push(`quality IN (${placeholders})`);
          queryParams.push(...quality);
        }
      } else {
        whereConditions.push('quality = ?');
        queryParams.push(quality);
      }
    }

    if (genre) {
      if (Array.isArray(genre)) {
        if (genre.length > 0) {
          const genreConditions = genre.map(() => 'genres LIKE ?');
          whereConditions.push(`(${genreConditions.join(' OR ')})`);
          genre.forEach(g => queryParams.push(`%${g}%`));
        }
      } else {
        whereConditions.push('genres LIKE ?');
        queryParams.push(`%${genre}%`);
      }
    }

    if (min_rating !== undefined) {
      whereConditions.push('rating >= ?');
      queryParams.push(min_rating);
    }

    if (max_rating !== undefined) {
      whereConditions.push('rating <= ?');
      queryParams.push(max_rating);
    }

    if (min_year !== undefined) {
      whereConditions.push('year >= ?');
      queryParams.push(min_year);
    }

    if (max_year !== undefined) {
      whereConditions.push('year <= ?');
      queryParams.push(max_year);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
    const orderClause = `ORDER BY ${sort_by} ${sort_order.toUpperCase()}`;
    const limitClause = `LIMIT ? OFFSET ?`;

    const countQuery = `SELECT COUNT(*) as total FROM movies ${whereClause}`;
    const countStmt = this.db.prepare(countQuery);
    const totalResult = countStmt.get(...queryParams) as { total: number };
    const total = totalResult.total;

    const offset = (page - 1) * limit;
    const searchQuery = `
      SELECT * FROM movies 
      ${whereClause} 
      ${orderClause} 
      ${limitClause}
    `;

    const searchStmt = this.db.prepare(searchQuery);
    const movies = searchStmt.all(...queryParams, limit, offset) as Movie[];

    const totalPages = Math.ceil(total / limit);

    return {
      movies,
      total,
      page,
      limit,
      total_pages: totalPages,
    };
  }

  async updateMovie(id: number, movieData: MovieUpdateRequest): Promise<Movie | null> {
    const existingMovie = await this.getMovieById(id);
    if (!existingMovie) {
      return null;
    }

    const updateFields: string[] = [];
    const updateValues: any[] = [];

    Object.entries(movieData).forEach(([key, value]) => {
      if (value !== undefined) {
        updateFields.push(`${key} = ?`);
        updateValues.push(value);
      }
    });

    if (updateFields.length === 0) {
      return existingMovie;
    }

    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    updateValues.push(id);

    const updateQuery = `UPDATE movies SET ${updateFields.join(', ')} WHERE id = ?`;
    const stmt = this.db.prepare(updateQuery);
    stmt.run(...updateValues);

    return this.getMovieById(id);
  }

  async deleteMovie(id: number): Promise<boolean> {
    const stmt = this.db.prepare('DELETE FROM movies WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }

  async getMoviesByQuality(quality: string): Promise<Movie[]> {
    const stmt = this.db.prepare('SELECT * FROM movies WHERE quality = ? ORDER BY rating DESC');
    return stmt.all(quality) as Movie[];
  }

  async getTopRatedMovies(limit: number = 10): Promise<Movie[]> {
    const stmt = this.db.prepare(
      'SELECT * FROM movies WHERE rating IS NOT NULL ORDER BY rating DESC LIMIT ?'
    );
    return stmt.all(limit) as Movie[];
  }

  async getMoviesByYear(year: number): Promise<Movie[]> {
    const stmt = this.db.prepare('SELECT * FROM movies WHERE year = ? ORDER BY rating DESC');
    return stmt.all(year) as Movie[];
  }

  async incrementDownloadCount(id: number): Promise<void> {
    const stmt = this.db.prepare(
      'UPDATE movies SET download_count = download_count + 1 WHERE id = ?'
    );
    stmt.run(id);
  }

  async incrementLikeCount(id: number): Promise<void> {
    const stmt = this.db.prepare('UPDATE movies SET like_count = like_count + 1 WHERE id = ?');
    stmt.run(id);
  }
}

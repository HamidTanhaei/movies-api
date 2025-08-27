import { getDatabase } from '../config/database.config';
import {
  Movie,
  MovieSearchParams,
  MovieSearchResult,
  MovieCreateRequest,
  MovieUpdateRequest,
  Genre,
  Quality,
  Director,
} from '../types/movie.type';

export class MovieService {
  private db = getDatabase();

  async createMovie(movieData: MovieCreateRequest): Promise<Movie> {
    const transaction = this.db.transaction(() => {
      const stmt = this.db.prepare(`
        INSERT INTO movies (
          title, imdb_code, year, rating, 
          download_count, like_count, rotten_tomatoes_rating, 
          cast, synopsis, poster_url
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const result = stmt.run(
        movieData.title,
        movieData.imdb_code,
        movieData.year,
        movieData.rating,
        movieData.download_count || 0,
        movieData.like_count || 0,
        movieData.rotten_tomatoes_rating,
        movieData.cast,
        movieData.synopsis,
        movieData.poster_url
      );

      const movieId = result.lastInsertRowid as number;

      // Insert genres
      if (movieData.genres && movieData.genres.length > 0) {
        const insertGenre = this.db.prepare('INSERT INTO movie_genres (movie_id, genre_id) VALUES (?, ?)');
        movieData.genres.forEach(genreId => insertGenre.run(movieId, genreId));
      }

      // Insert qualities
      if (movieData.qualities && movieData.qualities.length > 0) {
        const insertQuality = this.db.prepare('INSERT INTO movie_qualities (movie_id, quality_id) VALUES (?, ?)');
        movieData.qualities.forEach(qualityId => insertQuality.run(movieId, qualityId));
      }

      // Insert directors
      if (movieData.directors && movieData.directors.length > 0) {
        const insertDirector = this.db.prepare('INSERT INTO movie_directors (movie_id, director_id) VALUES (?, ?)');
        movieData.directors.forEach(directorId => insertDirector.run(movieId, directorId));
      }

      return movieId;
    });

    const movieId = transaction();
    const movie = await this.getMovieById(movieId);
    if (!movie) {
      throw new Error('Failed to create movie');
    }
    return movie;
  }

  async getMovieById(id: number): Promise<Movie | null> {
    const stmt = this.db.prepare('SELECT * FROM movies WHERE id = ?');
    const movie = stmt.get(id) as Movie | undefined;
    if (!movie) return null;

    // Fetch related data
    const genres = this.db.prepare(`
      SELECT g.id, g.name, g.created_at 
      FROM genres g 
      JOIN movie_genres mg ON g.id = mg.genre_id 
      WHERE mg.movie_id = ?
    `).all(id) as Genre[];

    const qualities = this.db.prepare(`
      SELECT q.id, q.name, q.created_at 
      FROM qualities q 
      JOIN movie_qualities mq ON q.id = mq.quality_id 
      WHERE mq.movie_id = ?
    `).all(id) as Quality[];

    const directors = this.db.prepare(`
      SELECT d.id, d.name, d.created_at 
      FROM directors d 
      JOIN movie_directors md ON d.id = md.director_id 
      WHERE md.movie_id = ?
    `).all(id) as Director[];

    return {
      ...movie,
      genres,
      qualities,
      directors
    };
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
      if (Array.isArray(director)) {
        if (director.length > 0) {
          const placeholders = director.map(() => '?').join(',');
          whereConditions.push(`EXISTS (
            SELECT 1 FROM movie_directors md 
            JOIN directors d ON md.director_id = d.id 
            WHERE md.movie_id = movies.id AND d.name IN (${placeholders})
          )`);
          queryParams.push(...director);
        }
      } else {
        whereConditions.push(`EXISTS (
          SELECT 1 FROM movie_directors md 
          JOIN directors d ON md.director_id = d.id 
          WHERE md.movie_id = movies.id AND d.name LIKE ?
        )`);
        queryParams.push(`%${director}%`);
      }
    }

    if (quality) {
      if (Array.isArray(quality)) {
        if (quality.length > 0) {
          const placeholders = quality.map(() => '?').join(',');
          whereConditions.push(`EXISTS (
            SELECT 1 FROM movie_qualities mq 
            JOIN qualities q ON mq.quality_id = q.id 
            WHERE mq.movie_id = movies.id AND q.name IN (${placeholders})
          )`);
          queryParams.push(...quality);
        }
      } else {
        whereConditions.push(`EXISTS (
          SELECT 1 FROM movie_qualities mq 
          JOIN qualities q ON mq.quality_id = q.id 
          WHERE mq.movie_id = movies.id AND q.name = ?
        )`);
        queryParams.push(quality);
      }
    }

    if (genre) {
      if (Array.isArray(genre)) {
        if (genre.length > 0) {
          const placeholders = genre.map(() => '?').join(',');
          whereConditions.push(`EXISTS (
            SELECT 1 FROM movie_genres mg 
            JOIN genres g ON mg.genre_id = g.id 
            WHERE mg.movie_id = movies.id AND g.name IN (${placeholders})
          )`);
          queryParams.push(...genre);
        }
      } else {
        whereConditions.push(`EXISTS (
          SELECT 1 FROM movie_genres mg 
          JOIN genres g ON mg.genre_id = g.id 
          WHERE mg.movie_id = movies.id AND g.name = ?
        )`);
        queryParams.push(genre);
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

    // Fetch related data for each movie
    const moviesWithRelations = await Promise.all(
      movies.map(async (movie) => {
        const genres = this.db.prepare(`
          SELECT g.id, g.name, g.created_at 
          FROM genres g 
          JOIN movie_genres mg ON g.id = mg.genre_id 
          WHERE mg.movie_id = ?
        `).all(movie.id) as Genre[];

        const qualities = this.db.prepare(`
          SELECT q.id, q.name, q.created_at 
          FROM qualities q 
          JOIN movie_qualities mq ON q.id = mq.quality_id 
          WHERE mq.movie_id = ?
        `).all(movie.id) as Quality[];

        const directors = this.db.prepare(`
          SELECT d.id, d.name, d.created_at 
          FROM directors d 
          JOIN movie_directors md ON d.id = md.director_id 
          WHERE md.movie_id = ?
        `).all(movie.id) as Director[];

        return {
          ...movie,
          genres,
          qualities,
          directors
        };
      })
    );

    const totalPages = Math.ceil(total / limit);

    return {
      movies: moviesWithRelations,
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

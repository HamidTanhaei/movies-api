import Database from 'better-sqlite3';
import path from 'path';

let db: Database.Database;

export const connectDatabase = async (): Promise<void> => {
  try {
    const dbPath = process.env.DB_PATH || path.join(__dirname, '../../data/movie-database.db');

    db = new Database(dbPath);

    console.log('✅ Connected to SQLite database successfully');

    initializeTables();

    process.on('SIGINT', () => {
      if (db) {
        db.close();
        console.log('🔄 SQLite database connection closed through app termination');
      }
      process.exit(0);
    });
  } catch (error) {
    console.error('❌ Failed to connect to SQLite database:', error);
    throw error;
  }
};

export const getDatabase = (): Database.Database => {
  if (!db) {
    throw new Error('Database not initialized. Call connectDatabase() first.');
  }
  return db;
};

const initializeTables = (): void => {
  const createMoviesTable = `
    CREATE TABLE IF NOT EXISTS movies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      imdb_code TEXT UNIQUE,
      year INTEGER,
      rating REAL,
      download_count INTEGER DEFAULT 0,
      like_count INTEGER DEFAULT 0,
      rotten_tomatoes_rating REAL,
      cast TEXT,
      synopsis TEXT,
      poster_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;

  const createGenresTable = `
    CREATE TABLE IF NOT EXISTS genres (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;

  const createQualitiesTable = `
    CREATE TABLE IF NOT EXISTS qualities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;

  const createDirectorsTable = `
    CREATE TABLE IF NOT EXISTS directors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;

  const createMovieGenresTable = `
    CREATE TABLE IF NOT EXISTS movie_genres (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      movie_id INTEGER NOT NULL,
      genre_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (movie_id) REFERENCES movies (id) ON DELETE CASCADE,
      FOREIGN KEY (genre_id) REFERENCES genres (id) ON DELETE CASCADE,
      UNIQUE(movie_id, genre_id)
    )
  `;

  const createMovieQualitiesTable = `
    CREATE TABLE IF NOT EXISTS movie_qualities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      movie_id INTEGER NOT NULL,
      quality_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (movie_id) REFERENCES movies (id) ON DELETE CASCADE,
      FOREIGN KEY (quality_id) REFERENCES qualities (id) ON DELETE CASCADE,
      UNIQUE(movie_id, quality_id)
    )
  `;

  const createMovieDirectorsTable = `
    CREATE TABLE IF NOT EXISTS movie_directors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      movie_id INTEGER NOT NULL,
      director_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (movie_id) REFERENCES movies (id) ON DELETE CASCADE,
      FOREIGN KEY (director_id) REFERENCES directors (id) ON DELETE CASCADE,
      UNIQUE(movie_id, director_id)
    )
  `;

  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;

  const createFavoritesTable = `
    CREATE TABLE IF NOT EXISTS favorites (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      movie_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id),
      FOREIGN KEY (movie_id) REFERENCES movies (id),
      UNIQUE(user_id, movie_id)
    )
  `;

  try {
    db.exec(createMoviesTable);
    db.exec(createGenresTable);
    db.exec(createQualitiesTable);
    db.exec(createDirectorsTable);
    db.exec(createMovieGenresTable);
    db.exec(createMovieQualitiesTable);
    db.exec(createMovieDirectorsTable);
    db.exec(createUsersTable);
    db.exec(createFavoritesTable);

    // Insert default data
    insertDefaultData();

    console.log('✅ Database tables initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize database tables:', error);
    throw error;
  }
};

const insertDefaultData = (): void => {
  try {
    // Insert default genres
    const defaultGenres = [
      'Action',
      'Adventure',
      'Animation',
      'Biography',
      'Comedy',
      'Crime',
      'Documentary',
      'Drama',
      'Family',
      'Fantasy',
      'Film-Noir',
      'History',
      'Horror',
      'Music',
      'Musical',
      'Mystery',
      'Romance',
      'Sci-Fi',
      'Sport',
      'Thriller',
      'War',
      'Western',
    ];
    const insertGenre = db.prepare('INSERT OR IGNORE INTO genres (name) VALUES (?)');
    defaultGenres.forEach((genre) => insertGenre.run(genre));

    // Insert default qualities
    const defaultQualities = ['480p', '720p', '1080p', '2160p', '3D'];
    const insertQuality = db.prepare('INSERT OR IGNORE INTO qualities (name) VALUES (?)');
    defaultQualities.forEach((quality) => insertQuality.run(quality));

    console.log('✅ Default data inserted successfully');
  } catch (error) {
    console.error('❌ Failed to insert default data:', error);
  }
};

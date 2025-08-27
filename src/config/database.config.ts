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
      genres TEXT,
      quality TEXT,
      download_count INTEGER DEFAULT 0,
      like_count INTEGER DEFAULT 0,
      rotten_tomatoes_rating REAL,
      director TEXT,
      cast TEXT,
      synopsis TEXT,
      poster_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
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
    db.exec(createUsersTable);
    db.exec(createFavoritesTable);
    console.log('✅ Database tables initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize database tables:', error);
    throw error;
  }
};

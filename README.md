# Movie Database API

A comprehensive REST API for managing and searching movies with advanced filtering, sorting, and pagination capabilities. Features a curated collection of **100 classic and modern films** from around the world.

## ✨ Key Features

- **🔍 Flexible Search**: Search movies by title, IMDb code, actor, or director
- **🎬 Multi-Genre Support**: 22+ genres including Action, Drama, Sci-Fi, Horror, Animation, and more
- **📺 Quality Filtering**: Filter by video qualities (480p, 720p, 1080p, 2160p, 3D)
- **🎯 Dynamic Filtering**: Smart filter suggestions based on current selections
- **📊 Advanced Sorting**: Sort by rating, year, download count, like count, and title
- **📄 Pagination**: Built-in pagination for large datasets
- **🍅 Rotten Tomatoes**: Integrated ratings from Rotten Tomatoes
- **🔐 User Authentication**: JWT-based secure authentication system
- **💾 SQLite Database**: Lightweight, normalized database with relational integrity
- **🛡️ Rate Limiting**: Built-in API protection against abuse
- **✅ Input Validation**: Comprehensive request validation and sanitization
- **🚨 Error Handling**: Structured error responses with proper HTTP status codes

## 📊 Database Content

- **100 curated movies** spanning from 1957 to 2019
- **22 genres**: Action, Adventure, Animation, Biography, Comedy, Crime, Documentary, Drama, Family, Fantasy, Film-Noir, History, Horror, Music, Musical, Mystery, Romance, Sci-Fi, Sport, Thriller, War, Western
- **5 quality levels**: 480p, 720p, 1080p, 2160p, 3D
- **International cinema**: Films from Hollywood, Asia, Europe, and Latin America
- **Rating range**: 6.9 to 9.3 IMDb ratings
- **Diverse directors**: From Kubrick and Hitchcock to Miyazaki and Bong Joon-ho

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: SQLite with better-sqlite3
- **Authentication**: JWT with bcryptjs
- **Validation**: express-validator
- **Security**: Helmet, CORS, Rate Limiting

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy environment file:
   ```bash
   cp env.example .env
   ```

4. Configure your environment variables in `.env`

## Environment Variables

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Database Configuration
DB_PATH=./data/movie-database.db

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# API Configuration
API_VERSION=v1
```

## Usage

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

### Database Setup
```bash
# Seed the database with 100 curated movies
npm run seed
```

**Note**: The database will be automatically created when you first run the application. The seed command populates it with 100 carefully selected movies spanning multiple decades and genres.

## API Endpoints

### Authentication

#### POST /api/v1/auth/register
Register a new user
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### POST /api/v1/auth/login
Login user
```json
{
  "username": "john_doe",
  "password": "password123"
}
```

### Movies

#### GET /api/v1/movies
Search and filter movies with multiple criteria simultaneously
```
GET /api/v1/movies?title=inception&quality=1080p&genre=Action&min_rating=8&sort_by=rating&sort_order=desc&page=1&limit=20
```

**Query Parameters:**
- `title`: Movie title (partial match)
- `imdb_code`: Exact IMDb code
- `actor`: Actor name (partial match)
- `director`: Director name (partial match)
- `quality`: Video quality or array of qualities (480p, 720p, 1080p, 2160p, 3D)
- `genre`: Genre or array of genres (partial match)
- `min_rating`: Minimum rating (0-10)
- `max_rating`: Maximum rating (0-10)
- `min_year`: Minimum year
- `max_year`: Maximum year
- `sort_by`: Sort field (rating, year, download_count, like_count, title)
- `sort_order`: Sort direction (asc, desc)
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)

**Multiple Values Examples:**
```
# Multiple qualities
GET /api/v1/movies?quality=1080p&quality=2160p

# Multiple genres
GET /api/v1/movies?genre=Action&genre=Sci-Fi

# Combined filtering
GET /api/v1/movies?quality=1080p&genre=Action&genre=Drama&min_rating=7&min_year=2020
```

#### GET /api/v1/movies/filters
Get dynamic filter options with smart suggestions
```
GET /api/v1/movies/filters
GET /api/v1/movies/filters?selectedFilters=[{"type":"genre","value":"Action"}]
```

**Dynamic Filtering Logic:**
- **No filters**: Returns all available options for all filter types
- **One filter**: Shows all options for that filter + common options for other filters
- **Multiple filters**: Shows selected options for previous filters + all options for the last filter

**Query Parameters:**
- `selectedFilters`: JSON string array of selected filters
  ```json
  [
    {"type": "genre", "value": "Action"},
    {"type": "quality", "value": "1080p"}
  ]
  ```

**Filter Types:**
- `genre`: Movie genres (Action, Drama, Sci-Fi, etc.)
- `quality`: Video qualities (480p, 720p, 1080p, 2160p, 3D)
- `director`: Director names
- `year`: Release years (grouped by decade)
- `rating_range`: Rating ranges (e.g., "8.0-8.5", "9.0+")

#### GET /api/v1/movies/:id
Get movie by ID
```
GET /api/v1/movies/1
```

#### GET /api/v1/movies/imdb/:imdbCode
Get movie by IMDb code
```
GET /api/v1/movies/imdb/tt1375666
```

#### POST /api/v1/movies
Create a new movie
```json
{
  "title": "Inception",
  "imdb_code": "tt1375666",
  "year": 2010,
  "rating": 8.8,
  "genres": "Action, Sci-Fi, Thriller",
  "quality": "1080p",
  "director": "Christopher Nolan",
  "cast": "Leonardo DiCaprio, Joseph Gordon-Levitt, Ellen Page",
  "synopsis": "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
  "poster_url": "https://example.com/inception-poster.jpg"
}
```

#### PUT /api/v1/movies/:id
Update a movie
```json
{
  "rating": 9.0,
  "download_count": 1500
}
```

#### DELETE /api/v1/movies/:id
Delete a movie
```
DELETE /api/v1/movies/1
```

#### POST /api/v1/movies/:id/download
Increment download count
```
POST /api/v1/movies/1/download
```

#### POST /api/v1/movies/:id/like
Increment like count
```
POST /api/v1/movies/1/like
```

## Database Schema

The database uses a **normalized relational structure** for better data integrity and efficient filtering.

### Movies Table
```sql
CREATE TABLE movies (
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
);
```

### Normalized Reference Tables
```sql
-- Genres table
CREATE TABLE genres (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL
);

-- Qualities table  
CREATE TABLE qualities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL
);

-- Directors table
CREATE TABLE directors (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL
);
```

### Relationship Tables (Many-to-Many)
```sql
-- Movie-Genre relationships
CREATE TABLE movie_genres (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  movie_id INTEGER NOT NULL,
  genre_id INTEGER NOT NULL,
  FOREIGN KEY (movie_id) REFERENCES movies (id) ON DELETE CASCADE,
  FOREIGN KEY (genre_id) REFERENCES genres (id) ON DELETE CASCADE,
  UNIQUE(movie_id, genre_id)
);

-- Movie-Quality relationships
CREATE TABLE movie_qualities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  movie_id INTEGER NOT NULL,
  quality_id INTEGER NOT NULL,
  FOREIGN KEY (movie_id) REFERENCES movies (id) ON DELETE CASCADE,
  FOREIGN KEY (quality_id) REFERENCES qualities (id) ON DELETE CASCADE,
  UNIQUE(movie_id, quality_id)
);

-- Movie-Director relationships
CREATE TABLE movie_directors (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  movie_id INTEGER NOT NULL,
  director_id INTEGER NOT NULL,
  FOREIGN KEY (movie_id) REFERENCES movies (id) ON DELETE CASCADE,
  FOREIGN KEY (director_id) REFERENCES directors (id) ON DELETE CASCADE,
  UNIQUE(movie_id, director_id)
);
```

### Users Table
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Favorites Table
```sql
CREATE TABLE favorites (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  movie_id INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id),
  FOREIGN KEY (movie_id) REFERENCES movies (id),
  UNIQUE(user_id, movie_id)
);
```

## Response Format

### Success Response
```json
{
  "success": true,
  "data": {
    // Response data
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "statusCode": 400,
    "timestamp": "2024-01-01T00:00:00.000Z",
    "path": "/api/v1/movies",
    "method": "GET"
  }
}
```

## Search Examples

### Find Action Movies from 2020-2023 with High Rating
```
GET /api/v1/movies?genre=Action&min_year=2020&max_year=2023&min_rating=7&sort_by=rating&sort_order=desc
```

### Find 4K Movies by Director
```
GET /api/v1/movies?director=Christopher Nolan&quality=2160p
```

### Find Movies by Actor with Pagination
```
GET /api/v1/movies?actor=Leonardo DiCaprio&page=1&limit=10&sort_by=year&sort_order=desc
```

### Multiple Quality and Genre Filtering
```
# Find high-quality Action or Sci-Fi movies
GET /api/v1/movies?quality=1080p&quality=2160p&genre=Action&genre=Sci-Fi&min_rating=8

# Find recent Drama or Thriller movies in 4K
GET /api/v1/movies?quality=2160p&genre=Drama&genre=Thriller&min_year=2020&sort_by=rating&sort_order=desc
```

## 🎯 Dynamic Filtering Examples

### Get All Available Filters
```bash
GET /api/v1/movies/filters
```
Returns all available options for genres, qualities, directors, years, and rating ranges.

### Progressive Filtering
```bash
# Step 1: Select Action genre
GET /api/v1/movies/filters?selectedFilters=[{"type":"genre","value":"Action"}]

# Step 2: Add 1080p quality filter  
GET /api/v1/movies/filters?selectedFilters=[{"type":"genre","value":"Action"},{"type":"quality","value":"1080p"}]

# Step 3: Add Christopher Nolan as director
GET /api/v1/movies/filters?selectedFilters=[{"type":"genre","value":"Action"},{"type":"quality","value":"1080p"},{"type":"director","value":"Christopher Nolan"}]
```

**Response Structure:**
```json
{
  "success": true,
  "data": {
    "genres": [
      {"id": 1, "name": "Action", "total": 25, "selected": true},
      {"id": 2, "name": "Drama", "total": 8, "selected": false}
    ],
    "qualities": [
      {"id": 3, "name": "1080p", "total": 15, "selected": true},
      {"id": 4, "name": "2160p", "total": 3, "selected": false}
    ],
    "directors": [
      {"id": 5, "name": "Christopher Nolan", "total": 3, "selected": false}
    ],
    "years": [
      {"name": "2010s", "total": 12, "selected": false}
    ],
    "rating_ranges": [
      {"name": "8.0-8.5", "total": 8, "selected": false}
    ]
  }
}
```

## Development

### Project Structure
```
src/
├── config/          # Database configuration and connection
├── middleware/      # Express middleware (auth, validation, rate limiting)
├── routes/          # API route handlers
├── services/        # Business logic and database operations
├── scripts/         # Database seeding and utilities
├── types/           # TypeScript type definitions
└── server.ts        # Main application server
```

## 🎬 Featured Movie Collection

Our curated collection includes iconic films from multiple eras and regions:

### **🏆 Acclaimed Classics**
- The Shawshank Redemption (9.3★) - Frank Darabont
- The Godfather (9.2★) - Francis Ford Coppola  
- Schindler's List (8.9★) - Steven Spielberg
- Pulp Fiction (8.9★) - Quentin Tarantino

### **🚀 Modern Masterpieces**
- Parasite (8.5★) - Bong Joon-ho
- Joker (8.4★) - Todd Phillips
- 1917 (8.2★) - Sam Mendes
- Knives Out (7.9★) - Rian Johnson

### **🎌 International Cinema**
- Spirited Away (8.6★) - Hayao Miyazaki
- Oldboy (8.4★) - Park Chan-wook
- City of God (8.6★) - Fernando Meirelles
- In the Mood for Love (8.1★) - Wong Kar-wai

### **🎭 Genre Diversity**
- **Action**: Mad Max: Fury Road, John Wick, The Raid
- **Sci-Fi**: Inception, Blade Runner, Arrival, Ex Machina  
- **Horror**: The Shining, Get Out, Hereditary, A Quiet Place
- **Animation**: Coco, Inside Out, Princess Mononoke, WALL-E
- **Comedy**: The Grand Budapest Hotel, The Big Lebowski, Amélie

### Adding New Features
1. Define types in `src/types/`
2. Implement business logic in `src/services/`
3. Create routes in `src/routes/`
4. Add validation in `src/middleware/`
5. Update server.ts if needed

## Testing

Run tests (when implemented):
```bash
npm test
```

## Security Features

- **Input Validation**: All inputs are validated and sanitized
- **Rate Limiting**: Prevents API abuse
- **CORS**: Configurable cross-origin requests
- **Helmet**: Security headers
- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: Bcrypt with salt rounds

## ⚡ Performance

- **SQLite**: Fast, lightweight database with optimized queries
- **Normalized Schema**: Efficient joins and reduced data redundancy  
- **Prepared Statements**: SQL injection protection and query optimization
- **Database Indexing**: Optimized search and filter performance
- **Efficient Pagination**: Smart data retrieval with limits
- **Dynamic Filtering**: Intelligent suggestions without unnecessary queries
- **Transaction Support**: ACID compliance for data integrity
- **Connection Management**: Optimized database connections

## License

ISC

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

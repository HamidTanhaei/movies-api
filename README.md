# Movie Database API

A comprehensive REST API for managing and searching movies with advanced filtering, sorting, and pagination capabilities.

## Features

- **Flexible Search**: Search movies by title, IMDb code, actor, or director
- **Quality Filtering**: Filter by specific qualities (480p, 720p, 1080p, 2160p, 3D)
- **Advanced Sorting**: Sort by rating, year, download count, like count, and title
- **Pagination**: Built-in pagination for large datasets
- **Rotten Tomatoes Integration**: Optional Rotten Tomatoes ratings
- **User Authentication**: JWT-based authentication system
- **SQLite Database**: Lightweight, file-based database
- **Rate Limiting**: API protection against abuse
- **Input Validation**: Comprehensive request validation
- **Error Handling**: Structured error responses

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
PORT=3000
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

#### GET /api/v1/movies/search
Search movies with filters
```
GET /api/v1/movies/search?title=inception&quality=1080p&min_rating=8&sort_by=rating&sort_order=desc&page=1&limit=20
```

**Query Parameters:**
- `title`: Movie title (partial match)
- `imdb_code`: Exact IMDb code
- `actor`: Actor name (partial match)
- `director`: Director name (partial match)
- `quality`: Video quality (480p, 720p, 1080p, 2160p, 3D)
- `genre`: Genre (partial match)
- `min_rating`: Minimum rating (0-10)
- `max_rating`: Maximum rating (0-10)
- `min_year`: Minimum year
- `max_year`: Maximum year
- `sort_by`: Sort field (rating, year, download_count, like_count, title)
- `sort_order`: Sort direction (asc, desc)
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)

#### GET /api/v1/movies/quality/:quality
Get movies by quality
```
GET /api/v1/movies/quality/1080p
```

#### GET /api/v1/movies/top-rated
Get top-rated movies
```
GET /api/v1/movies/top-rated?limit=10
```

#### GET /api/v1/movies/year/:year
Get movies by year
```
GET /api/v1/movies/year/2023
```

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

### Movies Table
```sql
CREATE TABLE movies (
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
GET /api/v1/movies/search?genre=Action&min_year=2020&max_year=2023&min_rating=7&sort_by=rating&sort_order=desc
```

### Find 4K Movies by Director
```
GET /api/v1/movies/search?director=Christopher Nolan&quality=2160p
```

### Find Movies by Actor with Pagination
```
GET /api/v1/movies/search?actor=Leonardo DiCaprio&page=1&limit=10&sort_by=year&sort_order=desc
```

## Development

### Project Structure
```
src/
├── config/          # Database and configuration
├── middleware/      # Express middleware
├── routes/          # API route handlers
├── services/        # Business logic
├── types/           # TypeScript type definitions
└── server.ts        # Main server file
```

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

## Performance

- **SQLite**: Fast, lightweight database
- **Prepared Statements**: SQL injection protection
- **Indexing**: Optimized queries
- **Pagination**: Efficient data retrieval
- **Connection Pooling**: Database connection management

## License

ISC

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

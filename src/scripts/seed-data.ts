import { connectDatabase, getDatabase } from '../config/database.config';

const sampleMovies = [
  {
    title: 'Inception',
    imdb_code: 'tt1375666',
    year: 2010,
    rating: 8.8,
    genres: 'Action, Sci-Fi, Thriller',
    quality: '1080p',
    download_count: 2500,
    like_count: 1800,
    rotten_tomatoes_rating: 87,
    director: 'Christopher Nolan',
    cast: 'Leonardo DiCaprio, Joseph Gordon-Levitt, Ellen Page, Ken Watanabe',
    synopsis: 'A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
    poster_url: 'https://example.com/inception-poster.jpg'
  },
  {
    title: 'The Dark Knight',
    imdb_code: 'tt0468569',
    year: 2008,
    rating: 9.0,
    genres: 'Action, Crime, Drama',
    quality: '2160p',
    download_count: 3200,
    like_count: 2100,
    rotten_tomatoes_rating: 94,
    director: 'Christopher Nolan',
    cast: 'Christian Bale, Heath Ledger, Aaron Eckhart, Maggie Gyllenhaal',
    synopsis: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    poster_url: 'https://example.com/dark-knight-poster.jpg'
  },
  {
    title: 'Interstellar',
    imdb_code: 'tt0816692',
    year: 2014,
    rating: 8.6,
    genres: 'Adventure, Drama, Sci-Fi',
    quality: '1080p',
    download_count: 1800,
    like_count: 1200,
    rotten_tomatoes_rating: 72,
    director: 'Christopher Nolan',
    cast: 'Matthew McConaughey, Anne Hathaway, Jessica Chastain, Mackenzie Foy',
    synopsis: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
    poster_url: 'https://example.com/interstellar-poster.jpg'
  },
  {
    title: 'Pulp Fiction',
    imdb_code: 'tt0110912',
    year: 1994,
    rating: 8.9,
    genres: 'Crime, Drama',
    quality: '720p',
    download_count: 1500,
    like_count: 900,
    rotten_tomatoes_rating: 92,
    director: 'Quentin Tarantino',
    cast: 'John Travolta, Uma Thurman, Samuel L. Jackson, Bruce Willis',
    synopsis: 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.',
    poster_url: 'https://example.com/pulp-fiction-poster.jpg'
  },
  {
    title: 'The Shawshank Redemption',
    imdb_code: 'tt0111161',
    year: 1994,
    rating: 9.3,
    genres: 'Drama',
    quality: '1080p',
    download_count: 2800,
    like_count: 1900,
    rotten_tomatoes_rating: 91,
    director: 'Frank Darabont',
    cast: 'Tim Robbins, Morgan Freeman, Bob Gunton, William Sadler',
    synopsis: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
    poster_url: 'https://example.com/shawshank-poster.jpg'
  },
  {
    title: 'Fight Club',
    imdb_code: 'tt0133093',
    year: 1999,
    rating: 8.8,
    genres: 'Drama',
    quality: '720p',
    download_count: 1200,
    like_count: 800,
    rotten_tomatoes_rating: 79,
    director: 'David Fincher',
    cast: 'Brad Pitt, Edward Norton, Helena Bonham Carter, Meat Loaf',
    synopsis: 'An insomniac office worker and a devil-may-care soapmaker form an underground fight club that evolves into something much, much more.',
    poster_url: 'https://example.com/fight-club-poster.jpg'
  },
  {
    title: 'The Matrix',
    imdb_code: 'tt0133093',
    year: 1999,
    rating: 8.7,
    genres: 'Action, Sci-Fi',
    quality: '1080p',
    download_count: 2200,
    like_count: 1500,
    rotten_tomatoes_rating: 88,
    director: 'Lana Wachowski, Lilly Wachowski',
    cast: 'Keanu Reeves, Laurence Fishburne, Carrie-Anne Moss, Hugo Weaving',
    synopsis: 'A computer programmer discovers that reality as he knows it is a simulation created by machines, and joins a rebellion to break free.',
    poster_url: 'https://example.com/matrix-poster.jpg'
  },
  {
    title: 'Forrest Gump',
    imdb_code: 'tt0109830',
    year: 1994,
    rating: 8.8,
    genres: 'Drama, Romance',
    quality: '720p',
    download_count: 1600,
    like_count: 1100,
    rotten_tomatoes_rating: 71,
    director: 'Robert Zemeckis',
    cast: 'Tom Hanks, Robin Wright, Gary Sinise, Sally Field',
    synopsis: 'The presidencies of Kennedy and Johnson, the Vietnam War, the Watergate scandal and other historical events unfold from the perspective of an Alabama man with an IQ of 75.',
    poster_url: 'https://example.com/forrest-gump-poster.jpg'
  }
];

const seedDatabase = async () => {
  try {
    await connectDatabase();
    const db = getDatabase();

    console.log('🌱 Starting database seeding...');

    const insertStmt = db.prepare(`
      INSERT INTO movies (
        title, imdb_code, year, rating, genres, quality, 
        download_count, like_count, rotten_tomatoes_rating, 
        director, cast, synopsis, poster_url
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    let insertedCount = 0;
    for (const movie of sampleMovies) {
      try {
        insertStmt.run(
          movie.title,
          movie.imdb_code,
          movie.year,
          movie.rating,
          movie.genres,
          movie.quality,
          movie.download_count,
          movie.like_count,
          movie.rotten_tomatoes_rating,
          movie.director,
          movie.cast,
          movie.synopsis,
          movie.poster_url
        );
        insertedCount++;
        console.log(`✅ Inserted: ${movie.title}`);
      } catch (error: any) {
        if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
          console.log(`⏭️ Skipped (already exists): ${movie.title}`);
        } else {
          console.error(`❌ Error inserting ${movie.title}:`, error.message);
        }
      }
    }

    console.log(`\n🎉 Seeding completed! Inserted ${insertedCount} movies.`);
    
    const totalMovies = db.prepare('SELECT COUNT(*) as count FROM movies').get() as { count: number };
    console.log(`📊 Total movies in database: ${totalMovies.count}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();

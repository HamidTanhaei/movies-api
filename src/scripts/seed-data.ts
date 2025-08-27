import { connectDatabase, getDatabase } from '../config/database.config';

let db: any;

// Sample data for seeding
const genres = [
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

const qualities = ['480p', '720p', '1080p', '2160p', '3D'];

const directors = [
  'Christopher Nolan',
  'Quentin Tarantino',
  'Martin Scorsese',
  'Steven Spielberg',
  'James Cameron',
  'David Fincher',
  'Ridley Scott',
  'Peter Jackson',
  'Francis Ford Coppola',
  'Stanley Kubrick',
  'Alfred Hitchcock',
  'Akira Kurosawa',
  'Ingmar Bergman',
  'Federico Fellini',
  'Jean-Luc Godard',
  'Werner Herzog',
  'Andrei Tarkovsky',
  'Hayao Miyazaki',
  'Bong Joon-ho',
  'Park Chan-wook',
  'Wong Kar-wai',
  'Zhang Yimou',
  'Ang Lee',
  'Wes Anderson',
  'Coen Brothers',
  'Paul Thomas Anderson',
  'David Lynch',
  'Lars von Trier',
  'Michael Haneke',
  'Pedro Almodóvar',
  'Guillermo del Toro',
];

const movies = [
  // Action & Adventure
  {
    title: 'The Dark Knight',
    imdb_code: 'tt0468569',
    year: 2008,
    rating: 9.0,
    genres: ['Action', 'Crime', 'Drama'],
    qualities: ['1080p', '2160p'],
    directors: ['Christopher Nolan'],
    download_count: 3200,
    like_count: 2100,
    rotten_tomatoes_rating: 94,
    cast: 'Christian Bale, Heath Ledger, Aaron Eckhart, Maggie Gyllenhaal',
    synopsis:
      'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    poster_url: 'https://example.com/dark-knight-poster.jpg',
  },
  {
    title: 'Mad Max: Fury Road',
    imdb_code: 'tt1392190',
    year: 2015,
    rating: 8.1,
    genres: ['Action', 'Adventure', 'Sci-Fi'],
    qualities: ['1080p', '2160p'],
    directors: ['George Miller'],
    download_count: 2800,
    like_count: 1800,
    rotten_tomatoes_rating: 97,
    cast: 'Tom Hardy, Charlize Theron, Nicholas Hoult, Hugh Keays-Byrne',
    synopsis:
      'In a post-apocalyptic wasteland, a woman rebels against a tyrannical ruler in search for her homeland with the aid of a group of female prisoners, a psychotic worshiper, and a drifter named Max.',
    poster_url: 'https://example.com/mad-max-poster.jpg',
  },
  {
    title: 'John Wick',
    imdb_code: 'tt2911666',
    year: 2014,
    rating: 7.4,
    genres: ['Action', 'Crime', 'Thriller'],
    qualities: ['1080p'],
    directors: ['Chad Stahelski'],
    download_count: 2200,
    like_count: 1500,
    rotten_tomatoes_rating: 86,
    cast: 'Keanu Reeves, Michael Nyqvist, Alfie Allen, Willem Dafoe',
    synopsis: 'An ex-hitman comes out of retirement when thugs kill his dog and steal his car.',
    poster_url: 'https://example.com/john-wick-poster.jpg',
  },
  {
    title: 'Mission: Impossible - Fallout',
    imdb_code: 'tt4912910',
    year: 2018,
    rating: 7.7,
    genres: ['Action', 'Adventure', 'Thriller'],
    qualities: ['1080p', '2160p'],
    directors: ['Christopher McQuarrie'],
    download_count: 2500,
    like_count: 1700,
    rotten_tomatoes_rating: 97,
    cast: 'Tom Cruise, Henry Cavill, Ving Rhames, Simon Pegg',
    synopsis:
      'Ethan Hunt and his IMF team, along with some familiar allies, race against time after a mission gone wrong.',
    poster_url: 'https://example.com/mission-impossible-poster.jpg',
  },
  {
    title: 'The Raid',
    imdb_code: 'tt1899353',
    year: 2011,
    rating: 7.6,
    genres: ['Action', 'Crime', 'Thriller'],
    qualities: ['720p', '1080p'],
    directors: ['Gareth Evans'],
    download_count: 1800,
    like_count: 1200,
    rotten_tomatoes_rating: 83,
    cast: 'Iko Uwais, Joe Taslim, Donny Alamsyah, Yayan Ruhian',
    synopsis:
      'A S.W.A.T. team becomes trapped in a tenement run by a ruthless mobster and his army of killers and thugs.',
    poster_url: 'https://example.com/raid-poster.jpg',
  },
  {
    title: 'Kill Bill: Vol. 1',
    imdb_code: 'tt0266697',
    year: 2003,
    rating: 8.1,
    genres: ['Action', 'Crime', 'Drama'],
    qualities: ['720p', '1080p'],
    directors: ['Quentin Tarantino'],
    download_count: 2000,
    like_count: 1400,
    rotten_tomatoes_rating: 85,
    cast: 'Uma Thurman, David Carradine, Daryl Hannah, Michael Madsen',
    synopsis:
      'After awakening from a four-year coma, a former assassin wreaks vengeance on the team of assassins who betrayed her.',
    poster_url: 'https://example.com/kill-bill-poster.jpg',
  },
  {
    title: 'The Matrix',
    imdb_code: 'tt0133093',
    year: 1999,
    rating: 8.7,
    genres: ['Action', 'Sci-Fi'],
    qualities: ['1080p', '2160p'],
    directors: ['Lana Wachowski', 'Lilly Wachowski'],
    download_count: 3000,
    like_count: 2000,
    rotten_tomatoes_rating: 88,
    cast: 'Keanu Reeves, Laurence Fishburne, Carrie-Anne Moss, Hugo Weaving',
    synopsis:
      'A computer programmer discovers that reality as he knows it is a simulation created by machines, and joins a rebellion to break free.',
    poster_url: 'https://example.com/matrix-poster.jpg',
  },
  {
    title: 'Die Hard',
    imdb_code: 'tt0095016',
    year: 1988,
    rating: 8.2,
    genres: ['Action', 'Thriller'],
    qualities: ['720p', '1080p'],
    directors: ['John McTiernan'],
    download_count: 2400,
    like_count: 1600,
    rotten_tomatoes_rating: 94,
    cast: 'Bruce Willis, Alan Rickman, Bonnie Bedelia, Reginald VelJohnson',
    synopsis:
      'An action classic where an action hero cop battles terrorists during a Christmas party at a Los Angeles skyscraper.',
    poster_url: 'https://example.com/die-hard-poster.jpg',
  },
  {
    title: 'Terminator 2: Judgment Day',
    imdb_code: 'tt0103064',
    year: 1991,
    rating: 8.6,
    genres: ['Action', 'Sci-Fi'],
    qualities: ['1080p', '2160p'],
    directors: ['James Cameron'],
    download_count: 2600,
    like_count: 1800,
    rotten_tomatoes_rating: 93,
    cast: 'Arnold Schwarzenegger, Linda Hamilton, Edward Furlong, Robert Patrick',
    synopsis:
      'A cyborg, identical to the one who failed to kill Sarah Connor, must now protect her ten year old son John from an even more advanced cyborg.',
    poster_url: 'https://example.com/terminator2-poster.jpg',
  },
  {
    title: 'Raiders of the Lost Ark',
    imdb_code: 'tt0082971',
    year: 1981,
    rating: 8.4,
    genres: ['Action', 'Adventure'],
    qualities: ['720p', '1080p'],
    directors: ['Steven Spielberg'],
    download_count: 2200,
    like_count: 1500,
    rotten_tomatoes_rating: 95,
    cast: 'Harrison Ford, Karen Allen, Paul Freeman, John Rhys-Davies',
    synopsis:
      "In 1936, archaeologist and adventurer Indiana Jones is hired by the U.S. government to find the Ark of the Covenant before Adolf Hitler's Nazis can obtain its awesome powers.",
    poster_url: 'https://example.com/raiders-poster.jpg',
  },

  // Drama & Crime
  {
    title: 'The Shawshank Redemption',
    imdb_code: 'tt0111161',
    year: 1994,
    rating: 9.3,
    genres: ['Drama'],
    qualities: ['720p', '1080p'],
    directors: ['Frank Darabont'],
    download_count: 3500,
    like_count: 2400,
    rotten_tomatoes_rating: 91,
    cast: 'Tim Robbins, Morgan Freeman, Bob Gunton, William Sadler',
    synopsis:
      'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
    poster_url: 'https://example.com/shawshank-poster.jpg',
  },
  {
    title: 'Pulp Fiction',
    imdb_code: 'tt0110912',
    year: 1994,
    rating: 8.9,
    genres: ['Crime', 'Drama'],
    qualities: ['720p', '1080p'],
    directors: ['Quentin Tarantino'],
    download_count: 2800,
    like_count: 1900,
    rotten_tomatoes_rating: 92,
    cast: 'John Travolta, Uma Thurman, Samuel L. Jackson, Bruce Willis',
    synopsis:
      'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.',
    poster_url: 'https://example.com/pulp-fiction-poster.jpg',
  },
  {
    title: 'Goodfellas',
    imdb_code: 'tt0099685',
    year: 1990,
    rating: 8.7,
    genres: ['Biography', 'Crime', 'Drama'],
    qualities: ['720p', '1080p'],
    directors: ['Martin Scorsese'],
    download_count: 2400,
    like_count: 1600,
    rotten_tomatoes_rating: 96,
    cast: 'Robert De Niro, Ray Liotta, Joe Pesci, Lorraine Bracco',
    synopsis:
      'The story of Henry Hill and his life in the mob, covering his relationship with his wife Karen Hill and his mob partners Jimmy Conway and Tommy DeVito.',
    poster_url: 'https://example.com/goodfellas-poster.jpg',
  },
  {
    title: 'The Godfather',
    imdb_code: 'tt0068646',
    year: 1972,
    rating: 9.2,
    genres: ['Crime', 'Drama'],
    qualities: ['720p', '1080p'],
    directors: ['Francis Ford Coppola'],
    download_count: 3200,
    like_count: 2200,
    rotten_tomatoes_rating: 98,
    cast: 'Marlon Brando, Al Pacino, James Caan, Diane Keaton',
    synopsis:
      'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
    poster_url: 'https://example.com/godfather-poster.jpg',
  },
  {
    title: 'Fight Club',
    imdb_code: 'tt0137523',
    year: 1999,
    rating: 8.8,
    genres: ['Drama'],
    qualities: ['720p', '1080p'],
    directors: ['David Fincher'],
    download_count: 2600,
    like_count: 1800,
    rotten_tomatoes_rating: 79,
    cast: 'Brad Pitt, Edward Norton, Helena Bonham Carter, Meat Loaf',
    synopsis:
      'An insomniac office worker and a devil-may-care soapmaker form an underground fight club that evolves into something much, much more.',
    poster_url: 'https://example.com/fight-club-poster.jpg',
  },
  {
    title: 'Forrest Gump',
    imdb_code: 'tt0109830',
    year: 1994,
    rating: 8.8,
    genres: ['Drama', 'Romance'],
    qualities: ['720p', '1080p'],
    directors: ['Robert Zemeckis'],
    download_count: 2400,
    like_count: 1600,
    rotten_tomatoes_rating: 71,
    cast: 'Tom Hanks, Robin Wright, Gary Sinise, Sally Field',
    synopsis:
      'The presidencies of Kennedy and Johnson, the Vietnam War, the Watergate scandal and other historical events unfold from the perspective of an Alabama man with an IQ of 75.',
    poster_url: 'https://example.com/forrest-gump-poster.jpg',
  },
  {
    title: 'The Green Mile',
    imdb_code: 'tt0120689',
    year: 1999,
    rating: 8.6,
    genres: ['Crime', 'Drama', 'Fantasy'],
    qualities: ['720p', '1080p'],
    directors: ['Frank Darabont'],
    download_count: 2000,
    like_count: 1400,
    rotten_tomatoes_rating: 78,
    cast: 'Tom Hanks, Michael Clarke Duncan, David Morse, Bonnie Hunt',
    synopsis:
      'The lives of guards on Death Row are affected by one of their charges: a black man accused of child murder and rape, yet who has a mysterious gift.',
    poster_url: 'https://example.com/green-mile-poster.jpg',
  },
  {
    title: "Schindler's List",
    imdb_code: 'tt0108052',
    year: 1993,
    rating: 8.9,
    genres: ['Biography', 'Drama', 'History'],
    qualities: ['720p', '1080p'],
    directors: ['Steven Spielberg'],
    download_count: 2200,
    like_count: 1500,
    rotten_tomatoes_rating: 98,
    cast: 'Liam Neeson, Ralph Fiennes, Ben Kingsley, Caroline Goodall',
    synopsis:
      'In German-occupied Poland during World War II, industrialist Oskar Schindler gradually becomes concerned for his Jewish workforce after witnessing their persecution by the Nazis.',
    poster_url: 'https://example.com/schindler-poster.jpg',
  },
  {
    title: 'The Silence of the Lambs',
    imdb_code: 'tt0102926',
    year: 1991,
    rating: 8.6,
    genres: ['Crime', 'Drama', 'Thriller'],
    qualities: ['720p', '1080p'],
    directors: ['Jonathan Demme'],
    download_count: 2000,
    like_count: 1400,
    rotten_tomatoes_rating: 96,
    cast: 'Jodie Foster, Anthony Hopkins, Scott Glenn, Ted Levine',
    synopsis:
      'A young F.B.I. cadet must receive the help of an incarcerated and manipulative cannibal killer to help catch another serial killer.',
    poster_url: 'https://example.com/silence-lambs-poster.jpg',
  },
  {
    title: "One Flew Over the Cuckoo's Nest",
    imdb_code: 'tt0073486',
    year: 1975,
    rating: 8.7,
    genres: ['Drama'],
    qualities: ['720p'],
    directors: ['Milos Forman'],
    download_count: 1800,
    like_count: 1200,
    rotten_tomatoes_rating: 94,
    cast: 'Jack Nicholson, Louise Fletcher, Michael Berryman, Peter Brocco',
    synopsis:
      'A criminal pleads insanity and is admitted to a mental institution, where he rebels against the oppressive nurse and rallies up the scared patients.',
    poster_url: 'https://example.com/cuckoo-nest-poster.jpg',
  },

  // Sci-Fi & Fantasy
  {
    title: 'Inception',
    imdb_code: 'tt1375666',
    year: 2010,
    rating: 8.8,
    genres: ['Action', 'Adventure', 'Sci-Fi'],
    qualities: ['1080p', '2160p'],
    directors: ['Christopher Nolan'],
    download_count: 3000,
    like_count: 2000,
    rotten_tomatoes_rating: 87,
    cast: 'Leonardo DiCaprio, Joseph Gordon-Levitt, Ellen Page, Ken Watanabe',
    synopsis:
      'A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
    poster_url: 'https://example.com/inception-poster.jpg',
  },
  {
    title: 'Interstellar',
    imdb_code: 'tt0816692',
    year: 2014,
    rating: 8.6,
    genres: ['Adventure', 'Drama', 'Sci-Fi'],
    qualities: ['1080p', '2160p'],
    directors: ['Christopher Nolan'],
    download_count: 2800,
    like_count: 1900,
    rotten_tomatoes_rating: 72,
    cast: 'Matthew McConaughey, Anne Hathaway, Jessica Chastain, Mackenzie Foy',
    synopsis:
      "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    poster_url: 'https://example.com/interstellar-poster.jpg',
  },
  {
    title: 'Blade Runner',
    imdb_code: 'tt0083658',
    year: 1982,
    rating: 8.1,
    genres: ['Action', 'Drama', 'Sci-Fi'],
    qualities: ['720p', '1080p'],
    directors: ['Ridley Scott'],
    download_count: 2000,
    like_count: 1400,
    rotten_tomatoes_rating: 89,
    cast: 'Harrison Ford, Rutger Hauer, Sean Young, Edward James Olmos',
    synopsis:
      'A blade runner must pursue and terminate four replicants who stole a ship in space and have returned to Earth to find their creator.',
    poster_url: 'https://example.com/blade-runner-poster.jpg',
  },
  {
    title: '2001: A Space Odyssey',
    imdb_code: 'tt0062622',
    year: 1968,
    rating: 8.3,
    genres: ['Adventure', 'Sci-Fi'],
    qualities: ['720p', '1080p'],
    directors: ['Stanley Kubrick'],
    download_count: 1800,
    like_count: 1200,
    rotten_tomatoes_rating: 92,
    cast: 'Keir Dullea, Gary Lockwood, William Sylvester, Daniel Richter',
    synopsis:
      'After discovering a mysterious artifact buried beneath the Lunar surface, mankind sets off on a quest to find its origins with help from intelligent supercomputer H.A.L. 9000.',
    poster_url: 'https://example.com/2001-poster.jpg',
  },
  {
    title: 'The Fifth Element',
    imdb_code: 'tt0119116',
    year: 1997,
    rating: 7.7,
    genres: ['Action', 'Adventure', 'Sci-Fi'],
    qualities: ['720p', '1080p'],
    directors: ['Luc Besson'],
    download_count: 1600,
    like_count: 1100,
    rotten_tomatoes_rating: 71,
    cast: 'Bruce Willis, Milla Jovovich, Gary Oldman, Ian Holm',
    synopsis:
      'In the colorful future, a cab driver unwittingly becomes the central figure in the search for a legendary cosmic weapon to keep Evil and Mr. Zorg at bay.',
    poster_url: 'https://example.com/fifth-element-poster.jpg',
  },
  {
    title: 'Arrival',
    imdb_code: 'tt2543164',
    year: 2016,
    rating: 7.9,
    genres: ['Drama', 'Sci-Fi', 'Thriller'],
    qualities: ['1080p'],
    directors: ['Denis Villeneuve'],
    download_count: 2000,
    like_count: 1400,
    rotten_tomatoes_rating: 94,
    cast: 'Amy Adams, Jeremy Renner, Forest Whitaker, Michael Stuhlbarg',
    synopsis:
      'A linguist works with the military to communicate with alien lifeforms after twelve mysterious spacecraft appear around the world.',
    poster_url: 'https://example.com/arrival-poster.jpg',
  },
  {
    title: 'Ex Machina',
    imdb_code: 'tt0470752',
    year: 2014,
    rating: 7.7,
    genres: ['Drama', 'Sci-Fi', 'Thriller'],
    qualities: ['1080p'],
    directors: ['Alex Garland'],
    download_count: 1800,
    like_count: 1200,
    rotten_tomatoes_rating: 92,
    cast: 'Alicia Vikander, Domhnall Gleeson, Oscar Isaac, Sonoya Mizuno',
    synopsis:
      'A young programmer is selected to participate in a ground-breaking experiment in synthetic intelligence by evaluating the human qualities of a highly advanced humanoid A.I.',
    poster_url: 'https://example.com/ex-machina-poster.jpg',
  },
  {
    title: 'Her',
    imdb_code: 'tt1798709',
    year: 2013,
    rating: 8.0,
    genres: ['Comedy', 'Drama', 'Romance'],
    qualities: ['1080p'],
    directors: ['Spike Jonze'],
    download_count: 1600,
    like_count: 1100,
    rotten_tomatoes_rating: 94,
    cast: 'Joaquin Phoenix, Amy Adams, Scarlett Johansson, Rooney Mara',
    synopsis:
      'In a near future, a lonely writer develops an unlikely relationship with an operating system designed to meet his every need.',
    poster_url: 'https://example.com/her-poster.jpg',
  },
  {
    title: 'The Martian',
    imdb_code: 'tt3659388',
    year: 2015,
    rating: 8.0,
    genres: ['Adventure', 'Drama', 'Sci-Fi'],
    qualities: ['1080p', '2160p'],
    directors: ['Ridley Scott'],
    download_count: 2400,
    like_count: 1600,
    rotten_tomatoes_rating: 91,
    cast: 'Matt Damon, Jessica Chastain, Kristen Wiig, Jeff Daniels',
    synopsis:
      'An astronaut becomes stranded on Mars after his team assume him dead, and must rely on his ingenuity to find a way to signal to Earth that he is alive.',
    poster_url: 'https://example.com/martian-poster.jpg',
  },
  {
    title: 'Gravity',
    imdb_code: 'tt1454468',
    year: 2013,
    rating: 7.7,
    genres: ['Drama', 'Sci-Fi', 'Thriller'],
    qualities: ['1080p', '3D'],
    directors: ['Alfonso Cuarón'],
    download_count: 2200,
    like_count: 1500,
    rotten_tomatoes_rating: 96,
    cast: 'Sandra Bullock, George Clooney, Ed Harris, Orto Ignatiussen',
    synopsis:
      'Two astronauts work together to survive after an accident leaves them stranded in space.',
    poster_url: 'https://example.com/gravity-poster.jpg',
  },

  // Comedy & Romance
  {
    title: 'The Grand Budapest Hotel',
    imdb_code: 'tt2278388',
    year: 2014,
    rating: 8.1,
    genres: ['Adventure', 'Comedy', 'Drama'],
    qualities: ['1080p'],
    directors: ['Wes Anderson'],
  },
  {
    title: 'La La Land',
    imdb_code: 'tt3783958',
    year: 2016,
    rating: 8.0,
    genres: ['Comedy', 'Drama', 'Musical'],
    qualities: ['1080p'],
    directors: ['Damien Chazelle'],
  },
  {
    title: 'The Princess Bride',
    imdb_code: 'tt0093779',
    year: 1987,
    rating: 8.0,
    genres: ['Adventure', 'Comedy', 'Family'],
    qualities: ['720p', '1080p'],
    directors: ['Rob Reiner'],
  },
  {
    title: 'Amélie',
    imdb_code: 'tt0211915',
    year: 2001,
    rating: 8.3,
    genres: ['Comedy', 'Romance'],
    qualities: ['720p', '1080p'],
    directors: ['Jean-Pierre Jeunet'],
  },
  {
    title: 'Eternal Sunshine of the Spotless Mind',
    imdb_code: 'tt0338013',
    year: 2004,
    rating: 8.3,
    genres: ['Drama', 'Romance', 'Sci-Fi'],
    qualities: ['720p', '1080p'],
    directors: ['Michel Gondry'],
  },
  {
    title: '500 Days of Summer',
    imdb_code: 'tt1022603',
    year: 2009,
    rating: 7.7,
    genres: ['Comedy', 'Drama', 'Romance'],
    qualities: ['720p', '1080p'],
    directors: ['Marc Webb'],
  },
  {
    title: 'The Big Lebowski',
    imdb_code: 'tt0118715',
    year: 1998,
    rating: 8.1,
    genres: ['Comedy', 'Crime', 'Sport'],
    qualities: ['720p', '1080p'],
    directors: ['Coen Brothers'],
  },
  {
    title: 'Groundhog Day',
    imdb_code: 'tt0107048',
    year: 1993,
    rating: 8.0,
    genres: ['Comedy', 'Drama', 'Fantasy'],
    qualities: ['720p', '1080p'],
    directors: ['Harold Ramis'],
  },
  {
    title: 'When Harry Met Sally...',
    imdb_code: 'tt0098635',
    year: 1989,
    rating: 7.6,
    genres: ['Comedy', 'Drama', 'Romance'],
    qualities: ['720p', '1080p'],
    directors: ['Rob Reiner'],
  },
  {
    title: 'The Apartment',
    imdb_code: 'tt0053604',
    year: 1960,
    rating: 8.3,
    genres: ['Comedy', 'Drama', 'Romance'],
    qualities: ['720p'],
    directors: ['Billy Wilder'],
  },

  // Horror & Thriller
  {
    title: 'The Shining',
    imdb_code: 'tt0081505',
    year: 1980,
    rating: 8.4,
    genres: ['Drama', 'Horror'],
    qualities: ['720p', '1080p'],
    directors: ['Stanley Kubrick'],
  },
  {
    title: 'Psycho',
    imdb_code: 'tt0054215',
    year: 1960,
    rating: 8.5,
    genres: ['Horror', 'Mystery', 'Thriller'],
    qualities: ['720p'],
    directors: ['Alfred Hitchcock'],
  },
  {
    title: 'The Thing',
    imdb_code: 'tt0084787',
    year: 1982,
    rating: 8.1,
    genres: ['Horror', 'Mystery', 'Sci-Fi'],
    qualities: ['720p', '1080p'],
    directors: ['John Carpenter'],
  },
  {
    title: 'Alien',
    imdb_code: 'tt0078748',
    year: 1979,
    rating: 8.4,
    genres: ['Horror', 'Sci-Fi'],
    qualities: ['720p', '1080p'],
    directors: ['Ridley Scott'],
  },
  {
    title: 'The Exorcist',
    imdb_code: 'tt0070047',
    year: 1973,
    rating: 8.0,
    genres: ['Horror'],
    qualities: ['720p'],
    directors: ['William Friedkin'],
  },
  {
    title: 'Get Out',
    imdb_code: 'tt5052448',
    year: 2017,
    rating: 7.7,
    genres: ['Horror', 'Mystery', 'Thriller'],
    qualities: ['1080p'],
    directors: ['Jordan Peele'],
  },
  {
    title: 'A Quiet Place',
    imdb_code: 'tt6644200',
    year: 2018,
    rating: 7.5,
    genres: ['Drama', 'Horror', 'Sci-Fi'],
    qualities: ['1080p'],
    directors: ['John Krasinski'],
  },
  {
    title: 'Hereditary',
    imdb_code: 'tt7784604',
    year: 2018,
    rating: 7.3,
    genres: ['Drama', 'Horror', 'Mystery'],
    qualities: ['1080p'],
    directors: ['Ari Aster'],
  },
  {
    title: 'Midsommar',
    imdb_code: 'tt8769648',
    year: 2019,
    rating: 7.1,
    genres: ['Drama', 'Horror', 'Mystery'],
    qualities: ['1080p'],
    directors: ['Ari Aster'],
  },
  {
    title: 'The Witch',
    imdb_code: 'tt4263482',
    year: 2015,
    rating: 6.9,
    genres: ['Horror', 'Mystery'],
    qualities: ['1080p'],
    directors: ['Robert Eggers'],
  },

  // Animation & Family
  {
    title: 'Spirited Away',
    imdb_code: 'tt0245429',
    year: 2001,
    rating: 8.6,
    genres: ['Animation', 'Adventure', 'Family'],
    qualities: ['720p', '1080p'],
    directors: ['Hayao Miyazaki'],
  },
  {
    title: 'My Neighbor Totoro',
    imdb_code: 'tt0096283',
    year: 1988,
    rating: 8.1,
    genres: ['Animation', 'Adventure', 'Family'],
    qualities: ['720p', '1080p'],
    directors: ['Hayao Miyazaki'],
  },
  {
    title: 'Princess Mononoke',
    imdb_code: 'tt0119698',
    year: 1997,
    rating: 8.4,
    genres: ['Animation', 'Action', 'Adventure'],
    qualities: ['720p', '1080p'],
    directors: ['Hayao Miyazaki'],
  },
  {
    title: 'Spider-Man: Into the Spider-Verse',
    imdb_code: 'tt4633694',
    year: 2018,
    rating: 8.4,
    genres: ['Animation', 'Action', 'Adventure'],
    qualities: ['1080p'],
    directors: ['Bob Persichetti', 'Peter Ramsey', 'Rodney Rothman'],
  },
  {
    title: 'Coco',
    imdb_code: 'tt2380307',
    year: 2017,
    rating: 8.4,
    genres: ['Animation', 'Adventure', 'Comedy'],
    qualities: ['1080p'],
    directors: ['Lee Unkrich', 'Adrian Molina'],
  },
  {
    title: 'Inside Out',
    imdb_code: 'tt2096673',
    year: 2015,
    rating: 8.1,
    genres: ['Animation', 'Adventure', 'Comedy'],
    qualities: ['1080p'],
    directors: ['Pete Docter', 'Ronnie del Carmen'],
  },
  {
    title: 'Up',
    imdb_code: 'tt1049413',
    year: 2009,
    rating: 8.2,
    genres: ['Animation', 'Adventure', 'Comedy'],
    qualities: ['720p', '1080p'],
    directors: ['Pete Docter', 'Bob Peterson'],
  },
  {
    title: 'WALL-E',
    imdb_code: 'tt0910970',
    year: 2008,
    rating: 8.4,
    genres: ['Animation', 'Adventure', 'Family'],
    qualities: ['720p', '1080p'],
    directors: ['Andrew Stanton'],
  },
  {
    title: 'The Lion King',
    imdb_code: 'tt0110357',
    year: 1994,
    rating: 8.5,
    genres: ['Animation', 'Adventure', 'Drama'],
    qualities: ['720p', '1080p'],
    directors: ['Roger Allers', 'Rob Minkoff'],
  },
  {
    title: 'Beauty and the Beast',
    imdb_code: 'tt0101414',
    year: 1991,
    rating: 8.0,
    genres: ['Animation', 'Family', 'Fantasy'],
    qualities: ['720p', '1080p'],
    directors: ['Gary Trousdale', 'Kirk Wise'],
  },

  // War & History
  {
    title: 'Saving Private Ryan',
    imdb_code: 'tt0120815',
    year: 1998,
    rating: 8.6,
    genres: ['Drama', 'War'],
    qualities: ['720p', '1080p'],
    directors: ['Steven Spielberg'],
  },
  {
    title: 'Apocalypse Now',
    imdb_code: 'tt0078788',
    year: 1979,
    rating: 8.4,
    genres: ['Drama', 'War'],
    qualities: ['720p', '1080p'],
    directors: ['Francis Ford Coppola'],
  },
  {
    title: 'Full Metal Jacket',
    imdb_code: 'tt0093058',
    year: 1987,
    rating: 8.3,
    genres: ['Drama', 'War'],
    qualities: ['720p', '1080p'],
    directors: ['Stanley Kubrick'],
  },
  {
    title: 'Platoon',
    imdb_code: 'tt0091763',
    year: 1986,
    rating: 8.1,
    genres: ['Drama', 'War'],
    qualities: ['720p', '1080p'],
    directors: ['Oliver Stone'],
  },
  {
    title: 'The Bridge on the River Kwai',
    imdb_code: 'tt0050212',
    year: 1957,
    rating: 8.1,
    genres: ['Adventure', 'Drama', 'War'],
    qualities: ['720p'],
    directors: ['David Lean'],
  },
  {
    title: 'Lawrence of Arabia',
    imdb_code: 'tt0056172',
    year: 1962,
    rating: 8.3,
    genres: ['Adventure', 'Biography', 'Drama'],
    qualities: ['720p'],
    directors: ['David Lean'],
  },
  {
    title: 'Braveheart',
    imdb_code: 'tt0112573',
    year: 1995,
    rating: 8.3,
    genres: ['Biography', 'Drama', 'History'],
    qualities: ['720p', '1080p'],
    directors: ['Mel Gibson'],
  },
  {
    title: 'Gladiator',
    imdb_code: 'tt0172495',
    year: 2000,
    rating: 8.5,
    genres: ['Action', 'Adventure', 'Drama'],
    qualities: ['720p', '1080p'],
    directors: ['Ridley Scott'],
  },
  {
    title: 'The Last of the Mohicans',
    imdb_code: 'tt0104694',
    year: 1992,
    rating: 7.7,
    genres: ['Action', 'Adventure', 'Drama'],
    qualities: ['720p', '1080p'],
    directors: ['Michael Mann'],
  },
  {
    title: 'Dances with Wolves',
    imdb_code: 'tt0099348',
    year: 1990,
    rating: 8.0,
    genres: ['Adventure', 'Drama', 'Western'],
    qualities: ['720p', '1080p'],
    directors: ['Kevin Costner'],
  },

  // Mystery & Crime
  {
    title: 'Se7en',
    imdb_code: 'tt0114369',
    year: 1995,
    rating: 8.6,
    genres: ['Crime', 'Drama', 'Mystery'],
    qualities: ['720p', '1080p'],
    directors: ['David Fincher'],
  },
  {
    title: 'Memento',
    imdb_code: 'tt0209144',
    year: 2000,
    rating: 8.4,
    genres: ['Mystery', 'Thriller'],
    qualities: ['720p', '1080p'],
    directors: ['Christopher Nolan'],
  },
  {
    title: 'The Usual Suspects',
    imdb_code: 'tt0114814',
    year: 1995,
    rating: 8.5,
    genres: ['Crime', 'Drama', 'Mystery'],
    qualities: ['720p', '1080p'],
    directors: ['Bryan Singer'],
  },
  {
    title: 'Chinatown',
    imdb_code: 'tt0071315',
    year: 1974,
    rating: 8.2,
    genres: ['Drama', 'Mystery', 'Thriller'],
    qualities: ['720p'],
    directors: ['Roman Polanski'],
  },
  {
    title: 'L.A. Confidential',
    imdb_code: 'tt0119488',
    year: 1997,
    rating: 8.2,
    genres: ['Crime', 'Drama', 'Mystery'],
    qualities: ['720p', '1080p'],
    directors: ['Curtis Hanson'],
  },
  {
    title: 'The Departed',
    imdb_code: 'tt0407887',
    year: 2006,
    rating: 8.5,
    genres: ['Crime', 'Drama', 'Thriller'],
    qualities: ['720p', '1080p'],
    directors: ['Martin Scorsese'],
  },
  {
    title: 'Heat',
    imdb_code: 'tt0113277',
    year: 1995,
    rating: 8.2,
    genres: ['Action', 'Crime', 'Drama'],
    qualities: ['720p', '1080p'],
    directors: ['Michael Mann'],
  },
  {
    title: 'Casino',
    imdb_code: 'tt0112641',
    year: 1995,
    rating: 8.2,
    genres: ['Crime', 'Drama'],
    qualities: ['720p', '1080p'],
    directors: ['Martin Scorsese'],
  },
  {
    title: 'Reservoir Dogs',
    imdb_code: 'tt0105236',
    year: 1992,
    rating: 8.3,
    genres: ['Crime', 'Drama', 'Thriller'],
    qualities: ['720p', '1080p'],
    directors: ['Quentin Tarantino'],
  },
  {
    title: 'True Romance',
    imdb_code: 'tt0108399',
    year: 1993,
    rating: 7.9,
    genres: ['Crime', 'Drama', 'Romance'],
    qualities: ['720p', '1080p'],
    directors: ['Tony Scott'],
  },

  // Modern Classics & Recent Films
  {
    title: 'Parasite',
    imdb_code: 'tt6751668',
    year: 2019,
    rating: 8.5,
    genres: ['Drama', 'Thriller'],
    qualities: ['1080p'],
    directors: ['Bong Joon-ho'],
  },
  {
    title: 'Joker',
    imdb_code: 'tt7286456',
    year: 2019,
    rating: 8.4,
    genres: ['Crime', 'Drama', 'Thriller'],
    qualities: ['1080p'],
    directors: ['Todd Phillips'],
  },
  {
    title: '1917',
    imdb_code: 'tt8579674',
    year: 2019,
    rating: 8.2,
    genres: ['Drama', 'War'],
    qualities: ['1080p'],
    directors: ['Sam Mendes'],
  },
  {
    title: 'Once Upon a Time in Hollywood',
    imdb_code: 'tt7131622',
    year: 2019,
    rating: 7.6,
    genres: ['Comedy', 'Drama'],
    qualities: ['1080p'],
    directors: ['Quentin Tarantino'],
  },
  {
    title: 'The Irishman',
    imdb_code: 'tt1302006',
    year: 2019,
    rating: 7.8,
    genres: ['Biography', 'Crime', 'Drama'],
    qualities: ['1080p'],
    directors: ['Martin Scorsese'],
  },
  {
    title: 'Marriage Story',
    imdb_code: 'tt7653254',
    year: 2019,
    rating: 7.9,
    genres: ['Drama', 'Romance'],
    qualities: ['1080p'],
    directors: ['Noah Baumbach'],
  },
  {
    title: 'Little Women',
    imdb_code: 'tt3281548',
    year: 2019,
    rating: 7.8,
    genres: ['Drama', 'Family', 'Romance'],
    qualities: ['1080p'],
    directors: ['Greta Gerwig'],
  },
  {
    title: 'Knives Out',
    imdb_code: 'tt8946378',
    year: 2019,
    rating: 7.9,
    genres: ['Comedy', 'Crime', 'Drama'],
    qualities: ['1080p'],
    directors: ['Rian Johnson'],
  },
  {
    title: 'Jojo Rabbit',
    imdb_code: 'tt2584384',
    year: 2019,
    rating: 7.9,
    genres: ['Comedy', 'Drama', 'War'],
    qualities: ['1080p'],
    directors: ['Taika Waititi'],
  },
  {
    title: 'The Lighthouse',
    imdb_code: 'tt7984734',
    year: 2019,
    rating: 7.4,
    genres: ['Drama', 'Fantasy', 'Horror'],
    qualities: ['1080p'],
    directors: ['Robert Eggers'],
  },

  // International Cinema
  {
    title: 'Oldboy',
    imdb_code: 'tt0364569',
    year: 2003,
    rating: 8.4,
    genres: ['Action', 'Drama', 'Mystery'],
    qualities: ['720p', '1080p'],
    directors: ['Park Chan-wook'],
  },
  {
    title: 'Memories of Murder',
    imdb_code: 'tt0353969',
    year: 2003,
    rating: 8.1,
    genres: ['Crime', 'Drama', 'Mystery'],
    qualities: ['720p', '1080p'],
    directors: ['Bong Joon-ho'],
  },
  {
    title: 'In the Mood for Love',
    imdb_code: 'tt0118694',
    year: 2000,
    rating: 8.1,
    genres: ['Drama', 'Romance'],
    qualities: ['720p', '1080p'],
    directors: ['Wong Kar-wai'],
  },
  {
    title: 'Crouching Tiger, Hidden Dragon',
    imdb_code: 'tt0190332',
    year: 2000,
    rating: 7.8,
    genres: ['Action', 'Adventure', 'Drama'],
    qualities: ['720p', '1080p'],
    directors: ['Ang Lee'],
  },
  {
    title: 'Hero',
    imdb_code: 'tt0299977',
    year: 2002,
    rating: 7.9,
    genres: ['Action', 'Adventure', 'Drama'],
    qualities: ['720p', '1080p'],
    directors: ['Zhang Yimou'],
  },
  {
    title: 'City of God',
    imdb_code: 'tt0317248',
    year: 2002,
    rating: 8.6,
    genres: ['Crime', 'Drama'],
    qualities: ['720p', '1080p'],
    directors: ['Fernando Meirelles', 'Kátia Lund'],
  },
  {
    title: "Pan's Labyrinth",
    imdb_code: 'tt0457430',
    year: 2006,
    rating: 8.2,
    genres: ['Drama', 'Fantasy', 'War'],
    qualities: ['720p', '1080p'],
    directors: ['Guillermo del Toro'],
  },
  {
    title: 'Let the Right One In',
    imdb_code: 'tt1139797',
    year: 2008,
    rating: 7.9,
    genres: ['Drama', 'Horror', 'Romance'],
    qualities: ['720p', '1080p'],
    directors: ['Tomas Alfredson'],
  },
  {
    title: 'The Lives of Others',
    imdb_code: 'tt0405094',
    year: 2006,
    rating: 8.4,
    genres: ['Drama', 'Thriller'],
    qualities: ['720p', '1080p'],
    directors: ['Florian Henckel von Donnersmarck'],
  },
  {
    title: 'A Separation',
    imdb_code: 'tt1832382',
    year: 2011,
    rating: 8.3,
    genres: ['Drama'],
    qualities: ['720p', '1080p'],
    directors: ['Asghar Farhadi'],
  },
];

const seedDatabase = async () => {
  try {
    await connectDatabase();
    db = getDatabase();

    console.log('🌱 Starting database seeding...');

    const insertMovieStmt = db.prepare(`
      INSERT INTO movies (
        title, imdb_code, year, rating, 
        download_count, like_count, rotten_tomatoes_rating, 
        cast, synopsis, poster_url
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    let insertedCount = 0;
    for (const movie of movies) {
      // Changed from sampleMovies to movies
      try {
        const transaction = db.transaction(() => {
          // Insert movie
          const result = insertMovieStmt.run(
            movie.title,
            movie.imdb_code,
            movie.year,
            movie.rating,
            movie.download_count, // Assuming these fields exist in the DB
            movie.like_count, // Assuming these fields exist in the DB
            movie.rotten_tomatoes_rating, // Assuming this field exists in the DB
            movie.cast, // Assuming this field exists in the DB
            movie.synopsis, // Assuming this field exists in the DB
            movie.poster_url // Assuming this field exists in the DB
          );

          const movieId = result.lastInsertRowid as number;

          // Insert genres
          if (movie.genres && movie.genres.length > 0) {
            const insertGenre = db.prepare(
              'INSERT INTO movie_genres (movie_id, genre_id) VALUES (?, ?)'
            );
            movie.genres.forEach((genreName) => {
              const genre = db
                .prepare('SELECT id FROM genres WHERE name = ?')
                .get(genreName) as any;
              if (genre) {
                insertGenre.run(movieId, genre.id);
              }
            });
          }

          // Insert qualities
          if (movie.qualities && movie.qualities.length > 0) {
            const insertQuality = db.prepare(
              'INSERT INTO movie_qualities (movie_id, quality_id) VALUES (?, ?)'
            );
            movie.qualities.forEach((qualityName) => {
              const quality = db
                .prepare('SELECT id FROM qualities WHERE name = ?')
                .get(qualityName) as any;
              if (quality) {
                insertQuality.run(movieId, quality.id);
              }
            });
          }

          // Insert directors
          if (movie.directors && movie.directors.length > 0) {
            const insertDirector = db.prepare(
              'INSERT INTO movie_directors (movie_id, director_id) VALUES (?, ?)'
            );
            movie.directors.forEach((directorName) => {
              let director = db
                .prepare('SELECT id FROM directors WHERE name = ?')
                .get(directorName) as any;
              if (!director) {
                // Create director if doesn't exist
                const createDirector = db.prepare('INSERT INTO directors (name) VALUES (?)');
                const directorResult = createDirector.run(directorName);
                director = { id: directorResult.lastInsertRowid };
              }
              insertDirector.run(movieId, director.id);
            });
          }

          return movieId;
        });

        transaction();
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

    const totalMovies = db.prepare('SELECT COUNT(*) as count FROM movies').get() as {
      count: number;
    };
    console.log(`📊 Total movies in database: ${totalMovies.count}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();

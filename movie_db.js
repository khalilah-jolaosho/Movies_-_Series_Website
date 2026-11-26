
const TMDB_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiM2NlMzAzY2MxODA3MWVhNjhhMDQ5OGFkY2U1YzViMyIsIm5iZiI6MTc5NDkxNjI2NS43MzksInN1YiI6IjZhZmMzZmE5ZjM2ZjE2OTI1OWY4MGM5NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.pXmIlaXFbdvDfwuW_m3DXOUyKFRRLhRG7LDvwqSPmQQ';

const IMAGE_BASE = 'https://image.tmdb.org/t/p/';

const movieIds = [
    603692,   // John Wick: Chapter 4
    693134,   // Dune: Part Two
    872585,   // Oppenheimer
    346698,   // Barbie
    569094,   // Spider-Man: Across the Spider-Verse
    414906,   // The Batman
    157336,   // Interstellar
    27205,    // Inception
    299534,   // Avengers: Endgame
    354912,   // Coco
    1022789,  // Inside Out 2
    155,      // The Dark Knight
    597,      // Titanic
    496243,   // Parasite
    545611,   // Everything Everywhere All at Once
    361743,   // Top Gun: Maverick
    8587,     // The Lion King
    546554,   // Knives Out
    76600,    // Avatar: The Way of Water
    502356    // The Super Mario Bros. Movie
];

let movies = [];

const getImage = (path, size = 'w500', name = 'Movie') => {
    return path
        ? `${IMAGE_BASE}${size}${path}`
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=500&background=222222&color=ffffff`;
};

const getCategory = (genres = []) => {
    const categories = [
        'Drama', 'Action', 'Adventure', 'Romance',
        'Fantasy', 'Comedy', 'Animation', 'Thriller',
        'Mystery', 'SciFi'
    ];

    const genreMap = {
        Action: 'Action',
        Adventure: 'Adventure',
        Animation: 'Animation',
        Comedy: 'Comedy',
        Crime: 'Thriller',
        Documentary: 'Drama',
        Drama: 'Drama',
        Family: 'Fantasy',
        Fantasy: 'Fantasy',
        History: 'Drama',
        Horror: 'Thriller',
        Music: 'Drama',
        Mystery: 'Mystery',
        Romance: 'Romance',
        ScienceFiction: 'SciFi',
        Thriller: 'Thriller',
        War: 'Action',
        Western: 'Adventure'
    };

    return genres
        .map(g => genreMap[g.name.replace(/\s/g, '')])
        .find(category => categories.includes(category)) || 'Drama';
};

const fetchMovie = async (id) => {
    const response = await fetch(
        `https://api.themoviedb.org/3/movie/${id}?append_to_response=credits,videos`,
        {
            headers: {
                Authorization: `Bearer ${TMDB_TOKEN}`,
                accept: 'application/json'
            }
        }
    );

    if (!response.ok) {
        throw new Error(`Failed to fetch movie ${id}: ${response.status}`);
    }

    return response.json();
};

const populateMovies = async () => {
    const results = await Promise.all(movieIds.map(fetchMovie));

    movies = results.map((movie, index) => {
        const director = movie.credits.crew.find(
            person => person.job === 'Director'
        );

        const trailer = movie.videos.results.find(
            video =>
                video.site === 'YouTube' &&
                video.type === 'Trailer' &&
                video.official === true
        ) || movie.videos.results.find(
            video =>
                video.site === 'YouTube' &&
                video.type === 'Trailer'
        );

        const cast = movie.credits.cast.slice(0, 5);

        return {
            title: movie.title,

            description: movie.overview,

            cover: getImage(movie.poster_path, 'w500', movie.title),

            type: 'movie',

            category: getCategory(movie.genres),

            thumbnails: getImage(
                movie.backdrop_path,
                'w1280',
                movie.title
            ),

            url: trailer
                ? `https://www.youtube.com/watch?v=${trailer.key}`
                : `https://www.youtube.com/results?search_query=${encodeURIComponent(movie.title + ' official trailer')}`,

            genre: movie.genres.map(g => g.name).join(', '),

            rating: Math.round((movie.vote_average || 0) / 2 * 10) / 10,

            director: {
                name: director?.name || 'Unknown Director',

                photo: getImage(
                    director?.profile_path,
                    'w185',
                    director?.name || 'Director'
                )
            },

            comments: [
                {
                    name: 'Movie Lover',
                    photo: 'https://ui-avatars.com/api/?name=Movie+Lover',

                    comment: `I really enjoyed watching ${movie.title}. Great movie!`,

                    likes: 3,

                    dislikes: 0
                }
            ],

            characters: cast.map(character => ({
                name: character.name,

                photo: getImage(
                    character.profile_path,
                    'w185',
                    character.name
                )
            })),

            related_movies: movieIds
                .filter((_, i) => i !== index)
                .slice(index, index + 3)
                .concat(
                    movieIds.filter((_, i) => i !== index)
                )
                .slice(0, 3)
                .map(relatedId => {
                    const related = results.find(
                        item => item.id === relatedId
                    );

                    return related ? {
                        name: related.title,

                        url: `https://www.youtube.com/results?search_query=${encodeURIComponent(related.title + ' official trailer')}`,

                        photo: getImage(
                            related.poster_path,
                            'w500',
                            related.title
                        )
                    } : null;
                })
                .filter(Boolean)
        };
    });

    

    return movies;
};

let series = [];
let kids = [];
let trending = [];

const seriesIds = [1399, 1396, 94605, 95557, 1622, 1668, 8521, 93405, 114472, 65334];
const kidsIds = [354912, 1022789, 8587, 502356, 129, 10681];

const populateExtra = async () => {
  
  const sResults = await Promise.all(seriesIds.map(id => fetchMovie(id).catch(()=>null)));
  
  const tvResults = await Promise.all(seriesIds.map(async (id) => {
    const r = await fetch(`https://api.themoviedb.org/3/tv/${id}?append_to_response=credits,videos`, {
      headers: { Authorization: `Bearer ${TMDB_TOKEN}`, accept: 'application/json' }
    });
    return r.json();
  }));
  series = tvResults.map(s => ({
    title: s.name,
    description: s.overview,
    cover: getImage(s.poster_path, 'w500', s.name),
    thumbnails: getImage(s.backdrop_path, 'w1280', s.name),
    type: 'series',
    category: getCategory(s.genres),
    genre: s.genres.map(g=>g.name).join(', '),
    rating: Math.round((s.vote_average||0)/2*10)/10,
    year: (s.first_air_date||'').slice(0,4),
    url: `https://www.youtube.com/results?search_query=${encodeURIComponent(s.name + ' official trailer')}`
  }));

  // Kids
  const kResults = await Promise.all(kidsIds.map(id => fetchMovie(id)));
  kids = kResults.map(m => ({
    title: m.title,
    description: m.overview,
    cover: getImage(m.poster_path, 'w500', m.title),
    thumbnails: getImage(m.backdrop_path, 'w1280', m.title),
    type: 'kids',
    category: getCategory(m.genres),
    genre: m.genres.map(g=>g.name).join(', '),
    rating: Math.round((m.vote_average||0)/2*10)/10,
    year: (m.release_date||'').slice(0,4),
    url: `https://www.youtube.com/results?search_query=${encodeURIComponent(m.title + ' official trailer')}`
  }));

  // Trending
  const tRes = await fetch(`https://api.themoviedb.org/3/trending/all/week`, {
    headers: { Authorization: `Bearer ${TMDB_TOKEN}`, accept: 'application/json' }
  });
  const tJson = await tRes.json();
  trending = tJson.results.slice(0,12).map(t => ({
    title: t.title || t.name,
    description: t.overview,
    cover: getImage(t.poster_path, 'w500', t.title||t.name),
    type: 'trending',
    category: 'Trending',
    rating: Math.round((t.vote_average||0)/2*10)/10,
    year: (t.release_date||t.first_air_date||'').slice(0,4),
    url: `https://www.youtube.com/results?search_query=${encodeURIComponent((t.title||t.name) + ' official trailer')}`
  }));

  document.dispatchEvent(new Event('dataReady'));
};

populateMovies().then(() => populateExtra()).catch(console.error);

const TMDB_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiM2NlMzAzY2MxODA3MWVhNjhhMDQ5OGFkY2U1YzViMyIsIm5iZiI6MTc5NDkxNjI2NS43MzksInN1YiI6IjZhZmMzZmE5ZjM2ZjE2OTI1OWY4MGM5NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.pXmIlaXFbdvDfwuW_m3DXOUyKFRRLhRG7LDvwqSPmQQ';

const IMAGE_BASE = 'https://image.tmdb.org/t/p/';

const movieIds = [
    603692, 693134, 872585, 346698, 569094,
    414906, 157336, 27205, 299534, 354912,
    1022789, 155, 597, 496243, 545611,
    361743, 8587, 546554, 76600, 502356
];

let movies = [];
let series = [];
let kids = [];
let trending = [];

const getImage = (path, size = 'w500', name = 'Movie') => {
    return path
        ? `${IMAGE_BASE}${size}${path}`
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=500&background=222222&color=ffffff`;
};

const getCategory = (genres = []) => {
    const categories = ['Drama', 'Action', 'Adventure', 'Romance', 'Fantasy', 'Comedy', 'Animation', 'Thriller', 'Mystery', 'SciFi'];
    const genreMap = {
        Action: 'Action', Adventure: 'Adventure', Animation: 'Animation', Comedy: 'Comedy',
        Crime: 'Thriller', Documentary: 'Drama', Drama: 'Drama', Family: 'Fantasy',
        Fantasy: 'Fantasy', History: 'Drama', Horror: 'Thriller', Music: 'Drama',
        Mystery: 'Mystery', Romance: 'Romance', ScienceFiction: 'SciFi',
        Thriller: 'Thriller', War: 'Action', Western: 'Adventure'
    };
    return genres.map(g => genreMap[g.name.replace(/\s/g, '')]).find(c => categories.includes(c)) || 'Drama';
};

const fetchTMDB = async (endpoint) => {
    try {
        const res = await fetch(`https://api.themoviedb.org/3/${endpoint}`, {
            headers: { Authorization: `Bearer ${TMDB_TOKEN}`, accept: 'application/json' }
        });
        if (!res.ok) return null;
        return res.json();
    } catch (e) {
        return null;
    }
};

const fetchMovie = (id) => fetchTMDB(`movie/${id}?language=en-US`);

const fetchMovieDetails = (id) => fetchTMDB(`movie/${id}?append_to_response=credits,videos&language=en-US`);

const populateMovies = async () => {
    const results = await Promise.all(movieIds.map(fetchMovie));
    const clean = results.filter(Boolean);

    movies = clean.map((movie, index) => {
        return {
            title: movie.title,
            description: movie.overview,
            cover: getImage(movie.poster_path, 'w500', movie.title),
            type: 'movie',
            category: getCategory(movie.genres),
            thumbnails: getImage(movie.backdrop_path, 'w780', movie.title),
            url: `https://www.youtube.com/results?search_query=${encodeURIComponent(movie.title + ' official trailer')}`,
            genre: movie.genres.map(g => g.name).join(', '),
            rating: Math.round((movie.vote_average || 0) / 2 * 10) / 10,
            director: { name: 'Unknown Director', photo: getImage(null, 'w185', 'Director') },
            comments: [{ name: 'Movie Lover', photo: 'https://ui-avatars.com/api/?name=Movie+Lover', comment: `I really enjoyed watching ${movie.title}. Great movie!`, likes: 3, dislikes: 0 }],
            characters: [],
            related_movies: clean
                .filter((_, i) => i !== index)
                .slice(0, 3)
                .map(r => ({
                    name: r.title,
                    url: `https://www.youtube.com/results?search_query=${encodeURIComponent(r.title + ' official trailer')}`,
                    photo: getImage(r.poster_path, 'w500', r.title)
                })),
            _id: movie.id
        };
    });
    return movies;
};

const seriesIds = [1399, 1396, 94605, 95557, 1622, 1668, 8521, 93405, 114472, 65334];
const kidsIds = [354912, 1022789, 8587, 502356, 129, 10681];

const populateExtra = async () => {
    const [tvResults, kResults, tJson] = await Promise.all([
        Promise.all(seriesIds.map(id => fetchTMDB(`tv/${id}?language=en-US`))),
        Promise.all(kidsIds.map(fetchMovie)),
        fetchTMDB(`trending/all/week?language=en-US`)
    ]);

    series = tvResults.filter(Boolean).map(s => ({
        title: s.name,
        description: s.overview,
        cover: getImage(s.poster_path, 'w500', s.name),
        thumbnails: getImage(s.backdrop_path, 'w780', s.name),
        type: 'series',
        category: getCategory(s.genres),
        genre: s.genres?.map(g => g.name).join(', '),
        rating: Math.round((s.vote_average || 0) / 2 * 10) / 10,
        year: (s.first_air_date || '').slice(0, 4),
        url: `https://www.youtube.com/results?search_query=${encodeURIComponent(s.name + ' official trailer')}`
    }));

    kids = kResults.filter(Boolean).map(m => ({
        title: m.title,
        description: m.overview,
        cover: getImage(m.poster_path, 'w500', m.title),
        thumbnails: getImage(m.backdrop_path, 'w780', m.title),
        type: 'kids',
        category: getCategory(m.genres),
        genre: m.genres.map(g => g.name).join(', '),
        rating: Math.round((m.vote_average || 0) / 2 * 10) / 10,
        year: (m.release_date || '').slice(0, 4),
        url: `https://www.youtube.com/results?search_query=${encodeURIComponent(m.title + ' official trailer')}`
    }));

    trending = (tJson?.results || []).slice(0, 12).map(t => ({
        title: t.title || t.name,
        description: t.overview,
        cover: getImage(t.poster_path, 'w500', t.title || t.name),
        thumbnails: getImage(t.backdrop_path, 'w780', t.title || t.name),
        type: 'trending',
        category: 'Trending',
        rating: Math.round((t.vote_average || 0) / 2 * 10) / 10,
        year: (t.release_date || t.first_air_date || '').slice(0, 4),
        url: `https://www.youtube.com/results?search_query=${encodeURIComponent((t.title || t.name) + ' official trailer')}`
    }));

    document.querySelectorAll('img').forEach((img, i) => {
        img.loading = i < 4 ? 'eager' : 'lazy';
        img.decoding = 'async';
    });

    document.dispatchEvent(new Event('dataReady'));
};

Promise.all([populateMovies(), populateExtra()]).catch(console.error);
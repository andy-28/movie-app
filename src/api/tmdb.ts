const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

export async function searchMovies(query: string, page = 1) {
    const response = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`);
    if (!response.ok) throw new Error('搜尋失敗');
    return await response.json();
}

export async function getMovieDetail(id: string) {
    const response = await fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=zh-TW`);
    if (!response.ok) throw new Error('取得電影詳情失敗');
    return await response.json();
}

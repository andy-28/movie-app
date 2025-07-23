const STORAGE_KEY = 'watchlist';

export function getWatchlist(): any[] {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
}

export function addToWatchlist(movie: any) {
    const list = getWatchlist();
    if (!list.find((m) => m.id === movie.id)) {
        list.push(movie);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    }
}

export function isInWatchlist(movieId: number): boolean {
    const list = getWatchlist();
    return list.some((m) => m.id === movieId);
}

export function removeFromWatchlist(movieId: number) {
    const list = getWatchlist().filter((m) => m.id !== movieId);
    localStorage.setItem('watchlist', JSON.stringify(list));
}

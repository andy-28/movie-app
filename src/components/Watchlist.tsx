import { useEffect, useState } from 'react';
import { getWatchlist, removeFromWatchlist } from '../utils/watchlistStorage';
import { Link } from 'react-router-dom';

function Watchlist() {
    const [movies, setMovies] = useState<any[]>([]);
    const [sortOption, setSortOption] = useState<'date' | 'title' | 'rating'>('date');

    useEffect(() => {
        const list = getWatchlist();
        setMovies(sortMovies(list, sortOption));
    }, []);

    useEffect(() => {
        setMovies((prev) => sortMovies([...prev], sortOption));
    }, [sortOption]);

    const handleRemove = (id: number) => {
        removeFromWatchlist(id);
        const updated = getWatchlist();
        setMovies(sortMovies(updated, sortOption));
    };

    const sortMovies = (list: any[], option: typeof sortOption) => {
        return list.sort((a, b) => {
            if (option === 'title') {
                return a.title.localeCompare(b.title);
            } else if (option === 'rating') {
                return (b.vote_average ?? 0) - (a.vote_average ?? 0);
            } else {
                return new Date(b.release_date).getTime() - new Date(a.release_date).getTime();
            }
        });
    };

    return (
        <div className="bg-gray-50 p-4 max-w-5xl mx-auto text-gray-800">
            <h1 className="text-2xl font-bold mb-6">我的待看清單</h1>

            {movies.length > 0 && (
                <div className="flex items-center gap-2 mb-4">
                    <label className="text-sm font-medium text-gray-700">排序：</label>
                    <select
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value as typeof sortOption)}
                        className="border px-2 py-1 rounded text-sm shadow-sm"
                    >
                        <option value="date">上映日</option>
                        <option value="title">名稱</option>
                        <option value="rating">評分</option>
                    </select>
                </div>
            )}

            {movies.length === 0 ? (
                <p className="text-gray-500">目前尚未加入任何電影。</p>
            ) : (
                <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {movies.map((movie) => (
                        <li
                            key={movie.id}
                            className="bg-white border rounded-lg p-2 shadow hover:shadow-md transition flex flex-col items-center text-center"
                        >
                            <Link to={`/movie/${movie.id}`} className="w-full">
                                {movie.poster_path ? (
                                    <img
                                        className="w-full h-48 object-cover rounded-md mb-2"
                                        src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                                        alt={movie.title}
                                    />
                                ) : (
                                    <div className="w-full h-48 bg-gray-200 rounded-md mb-2 flex items-center justify-center text-gray-400 text-sm">
                                        無圖片
                                    </div>
                                )}
                                <h2 className="text-sm font-semibold truncate">{movie.title}</h2>
                                <p className="text-xs text-gray-500">{movie.release_date}</p>
                            </Link>
                            <button
                                className="text-xs text-red-500 hover:underline mt-1"
                                onClick={() => handleRemove(movie.id)}
                            >
                                移除
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default Watchlist;

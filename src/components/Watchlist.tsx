// src/components/Watchlist.tsx
import { useEffect, useState } from 'react';
import { getWatchlist, removeFromWatchlist } from '../utils/watchlistStorage';
import { Link } from 'react-router-dom';

function Watchlist() {
    const [movies, setMovies] = useState<any[]>([]);

    useEffect(() => {
        setMovies(getWatchlist());
    }, []);

    const handleRemove = (id: number) => {
        removeFromWatchlist(id);
        setMovies(getWatchlist());
    };

    return (
        <div className="p-4 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">我的待看清單</h1>
            {movies.length === 0 ? (
                <p>目前尚未加入任何電影。</p>
            ) : (
                <ul className="grid grid-cols-2 gap-4">
                    {movies.map((movie) => (
                        <li key={movie.id} className="border p-2 rounded">
                            <Link to={`/movie/${movie.id}`}>
                                <h2 className="font-bold">{movie.title}</h2>
                                <p className="text-sm text-gray-600">{movie.release_date}</p>
                                {movie.poster_path && (
                                    <img
                                        className="mt-2"
                                        src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                                        alt={movie.title}
                                    />
                                )}
                            </Link>
                            <button
                                className="text-red-500 text-sm mt-2"
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

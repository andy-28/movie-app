import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getMovieDetail } from '../api/tmdb'; // 確保你有這個 API function

function MovieDetail() {
    const { id } = useParams();
    const [movie, setMovie] = useState<any>(null);

    useEffect(() => {
        if (id) {
            getMovieDetail(id).then(setMovie);
        }
    }, [id]);

    if (!movie) return <div>載入中...</div>;

    return (
        <div className="p-4 max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">{movie.title}</h1>
            <p className="text-gray-600">{movie.release_date}</p>
            <p>{movie.overview}</p>
            {movie.poster_path && (
                <img
                    className="mt-4"
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                />
            )}
        </div>
    );
}

export default MovieDetail;

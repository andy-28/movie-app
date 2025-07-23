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
        <div className="min-h-screen bg-gray-50 text-gray-800">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">

                    <h1 className="text-3xl font-bold mb-2 text-center">{movie.title}</h1>
                    <p className="text-center text-sm text-gray-500 mb-4">{movie.release_date}</p>

                    {movie.poster_path && (
                        <div className="flex justify-center mb-6">
                            <img
                                className="rounded-lg w-full max-w-md shadow-md"
                                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                alt={movie.title}
                            />
                        </div>
                    )}

                    <div className="prose max-w-none text-justify text-gray-700 leading-relaxed">
                        <p>{movie.overview}</p>
                    </div>
                </div>
            </div>
        </div>

    );
}

export default MovieDetail;

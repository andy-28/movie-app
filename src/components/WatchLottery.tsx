// src/components/WatchLottery.tsx
import { useEffect, useState } from 'react';
import { getWatchlist } from '../utils/watchlistStorage';
import { motion, AnimatePresence } from 'framer-motion';

function WatchLottery() {
    const [movies, setMovies] = useState<any[]>([]);
    const [selected, setSelected] = useState<any | null>(null);
    const [rolling, setRolling] = useState(false);

    useEffect(() => {
        setMovies(getWatchlist());
    }, []);

    const handleLottery = () => {
        if (movies.length === 0 || rolling) return;
        setRolling(true);
        setSelected(null);

        const randomIndex = Math.floor(Math.random() * movies.length);

        setTimeout(() => {
            setSelected(movies[randomIndex]);
            setRolling(false);
        }, 1500);
    };

    return (
        <div className="p-6 max-w-2xl mx-auto text-center">
            <h1 className="text-2xl font-bold mb-6">🎰 電影轉盤抽籤</h1>

            <button
                onClick={handleLottery}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded text-lg disabled:opacity-50"
                disabled={rolling || movies.length === 0}
            >
                {rolling ? '轉動中...' : '轉吧轉吧！'}
            </button>

            <div className="h-40 flex items-center justify-center mt-10">
                <AnimatePresence>
                    {rolling && (
                        <motion.div
                            key="rolling"
                            initial={{ opacity: 0, y: -30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 30 }}
                            transition={{ duration: 0.4, repeat: Infinity, repeatType: 'loop' }}
                            className="text-lg text-gray-500"
                        >
                        </motion.div>
                    )}
                </AnimatePresence>

                {!rolling && selected && (
                    <motion.div
                        key={selected.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="border rounded p-4 bg-white shadow-md"
                    >
                        <h2 className="text-xl font-semibold mb-1">{selected.title}</h2>
                        <p className="text-gray-600 mb-2">{selected.release_date}</p>
                        {selected.poster_path && (
                            <img
                                className="mx-auto"
                                src={`https://image.tmdb.org/t/p/w200${selected.poster_path}`}
                                alt={selected.title}
                            />
                        )}
                    </motion.div>
                )}
            </div>

            {movies.length === 0 && !rolling && (
                <p className="text-gray-500 mt-6">尚未加入任何電影到待看清單</p>
            )}
        </div>
    );
}

export default WatchLottery;

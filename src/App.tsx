import { useState, useEffect } from 'react';
import { searchMovies } from './api/tmdb';
import { useOnScreen } from './hooks/useOnScreen';
import { Link } from 'react-router-dom';
import './index.css';
import { addToWatchlist, isInWatchlist } from './utils/watchlistStorage';

function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sortOption, setSortOption] = useState<'date' | 'title' | 'rating'>('date');

  const { ref, visible } = useOnScreen({ rootMargin: '200px' });

  const fetchMovies = async (reset = false) => {
    try {
      setError('');
      setIsLoading(true);

      const currentPage = reset ? 1 : page;
      const data = await searchMovies(query, currentPage);

      // ✅ 檢查回傳格式
      if (!data || !Array.isArray(data.results)) {
        setError('無法取得電影資料，請稍後再試');
        setResults([]);          // 清空結果，避免殘留資料
        setHasMore(false);
        return;
      }

      // ✅ 查無資料
      if (reset && data.results.length === 0) {
        setResults([]);
        setError(`找不到符合「${query}」的電影`);
        setHasMore(false);
        return;
      }

      // ✅ 正常更新資料
      setResults((prev) =>
        reset ? data.results : [...prev, ...data.results]
      );
      setHasMore(data.page < data.total_pages);
    } catch (err: any) {
      console.error('fetchMovies error:', err);
      const message =
        err?.message || '發生錯誤，請檢查網路或稍後再試';
      setError(message);
    } finally {
      setIsLoading(false);        // 不論成功或失敗都結束 loading
    }
  };

  useEffect(() => {
    const sorted = [...results].sort((a, b) => {
      if (sortOption === 'title') {
        return a.title.localeCompare(b.title);
      } else if (sortOption === 'rating') {
        return (b.vote_average ?? 0) - (a.vote_average ?? 0);
      } else {
        return new Date(b.release_date).getTime() - new Date(a.release_date).getTime();
      }
    });
    setResults(sorted);
  }, [sortOption]);


  const handleSearch = () => {
    setPage(1);
    fetchMovies(true);
  };

  useEffect(() => {
    if (visible && hasMore && query) {
      setPage((prev) => prev + 1);
    }
  }, [visible]);

  useEffect(() => {
    if (page > 1) fetchMovies();
  }, [page]);

  return (
    <div className="min-h-screen">
      <nav className="shadow-sm p-4 flex justify-between items-center container mx-auto mb-6">
        <h1 className="text-xl font-bold text-blue-600">電影搜尋</h1>
        <div className="flex items-center border px-3 py-1 shadow-sm w-full max-w-sm">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="請輸入電影名稱"
            className="flex-grow outline-none px-2 text-sm text-white-700"
          />
          <button onClick={handleSearch} className="p-1 hover:opacity-80">
            <img
              src="https://i2.bahamut.com.tw/anime/search-icon.svg"
              alt="搜尋"
              className="w-5 h-5"
            />
          </button>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/watchlist" className="text-blue-500 hover:underline text-md">
            待看清單
          </Link>
          <Link to="/watch-lottery" className="text-blue-500 hover:underline text-md">
            抽籤
          </Link>
        </div>
      </nav>
      <div className="container mx-auto px-4">

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <div className="flex w-full md:w-2/3 gap-2">

          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">排序：</label>
            <select
              value={sortOption}
              onChange={(e) =>
                setSortOption(e.target.value as 'date' | 'title' | 'rating')
              }
              className="border px-2 py-1 rounded text-sm shadow-sm"
            >
              <option value="date">上映日</option>
              <option value="title">名稱</option>
              <option value="rating">評分</option>
            </select>
          </div>
        </div>


        {error && <div className="text-red-500 mb-4">{error}</div>}
        {isLoading && <div className="text-gray-500 mb-4">載入中...</div>}


        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {results.map((movie) => (
            <li
              key={movie.id}
              className="bg-white border rounded-lg p-2 shadow hover:shadow-md transition duration-200 flex flex-col items-center text-center"
            >
              <Link to={`/movie/${movie.id}`} className="w-full h-full">
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
                <h2 className="font-semibold text-sm truncate">{movie.title}</h2>
                <p className="text-xs text-gray-500">{movie.release_date}</p>
              </Link>

              <button
                onClick={() => addToWatchlist(movie)}
                className="text-xs text-blue-500 hover:underline mt-1"
                disabled={isInWatchlist(movie.id)}
              >
                {isInWatchlist(movie.id) ? '已加入待看清單' : '加入待看清單'}
              </button>
            </li>
          ))}
        </ul>


        {hasMore && <div ref={ref} className="h-10" />}
      </div>
    </div>
  );


}

export default App;

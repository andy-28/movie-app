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
      setError('');               // 清空錯誤訊息
      setIsLoading(true);         // 設定載入中（可搭配 UI 顯示 spinner）

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
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">電影搜尋</h1>
      <h1 className="text-3xl font-bold text-red-500">Tailwind 測試成功</h1>

      <Link to="/watchlist" className="text-blue-500 underline block mb-4">
        查看我的待看清單 →
      </Link>
      <Link to="/watch-lottery" className="text-green-500 underline block mb-4">
        抽電影 🎲 →
      </Link>
      {/* 排序功能 */}
      <div className="flex items-center gap-4 mb-4">
        <label className="text-sm font-medium text-gray-700">排序方式：</label>
        <select
          value={sortOption}
          onChange={(e) =>
            setSortOption(e.target.value as 'date' | 'title' | 'rating')
          }
          className="border px-2 py-1 rounded text-sm"
        >
          <option value="date">依上映日</option>
          <option value="title">依名稱</option>
          <option value="rating">依評分</option>
        </select>
      </div>

      {/* 搜尋欄 */}
      <div className="flex gap-2 mb-4">
        <input
          className="border px-3 py-2 w-full"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="輸入電影名稱"
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleSearch}
        >
          搜尋
        </button>
      </div>

      {/* 錯誤與載入提示 */}
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {isLoading && <div className="text-gray-500 mb-4">載入中...</div>}

      {/* 電影清單 */}
      <ul className="grid grid-cols-2 gap-4">
        {results.map((movie) => (
          <li key={movie.id} className="border rounded p-2 hover:shadow-lg">
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
              onClick={() => addToWatchlist(movie)}
              className="text-sm text-blue-500 hover:underline mt-2"
              disabled={isInWatchlist(movie.id)}
            >
              {isInWatchlist(movie.id) ? '已加入待看清單' : '加入待看清單'}
            </button>
          </li>
        ))}
      </ul>

      {/* 無限載入觸發器 */}
      {hasMore && <div ref={ref} className="h-10" />}
    </div>
  );

}

export default App;

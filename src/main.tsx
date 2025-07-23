// src/main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import './index.css';
import MovieDetail from './components/MovieDetail';
import Watchlist from './components/Watchlist';
import WatchLottery from './components/WatchLottery';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/movie/:id" element={<MovieDetail />} />
        <Route path="/watchlist" element={<Watchlist />} />
        <Route path="/watch-lottery" element={<WatchLottery />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);

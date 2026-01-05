import { Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage';
import DetailPage from './pages/DetailPage';
import WritePage from './pages/WritePage';
import Header from './components/Header';

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/post/:id" element={<DetailPage />} />
        <Route path="/write" element={<WritePage />} />
      </Routes>
    </div>
  );
}

export default App;

import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              🤝 공감투표
            </h1>
          </Link>
          <Link
            to="/write"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            글쓰기
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;

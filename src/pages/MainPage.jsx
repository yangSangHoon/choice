import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import PostCard from '../components/PostCard';
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';

const CATEGORIES = [
  { id: 'all', label: '전체' },
  { id: 'couple', label: '연인' },
  { id: 'friend', label: '친구' },
  { id: 'work', label: '직장' },
  { id: 'family', label: '가족' },
  { id: 'etc', label: '기타' },
];

const SORT_OPTIONS = [
  { id: 'latest', label: '최신순', field: 'created_at', direction: 'desc' },
  { id: 'popular', label: '인기순', field: 'total_votes', direction: 'desc' },
];

function MainPage() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('latest');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    filterAndSortPosts();
  }, [posts, selectedCategory, sortBy, searchQuery]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const postsData = data.map(post => ({
        ...post,
        total_votes: (post.votes_a || 0) + (post.votes_b || 0)
      }));

      setPosts(postsData);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortPosts = () => {
    let filtered = [...posts];

    // 카테고리 필터
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    // 검색 필터
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(query) ||
        post.story.toLowerCase().includes(query)
      );
    }

    // 정렬
    const sortOption = SORT_OPTIONS.find(opt => opt.id === sortBy);
    if (sortOption) {
      filtered.sort((a, b) => {
        const aValue = a[sortOption.field] || 0;
        const bValue = b[sortOption.field] || 0;

        if (sortOption.field === 'created_at') {
          const aTime = new Date(aValue).getTime() || 0;
          const bTime = new Date(bValue).getTime() || 0;
          return sortOption.direction === 'desc' ? bTime - aTime : aTime - bTime;
        }

        return sortOption.direction === 'desc' ? bValue - aValue : aValue - bValue;
      });
    }

    setFilteredPosts(filtered);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* 검색 및 필터 섹션 */}
        <div className="mb-8 space-y-4">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
          />

          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <CategoryFilter
              categories={CATEGORIES}
              selected={selectedCategory}
              onChange={setSelectedCategory}
            />

            <div className="flex gap-2">
              {SORT_OPTIONS.map(option => (
                <button
                  key={option.id}
                  onClick={() => setSortBy(option.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    sortBy === option.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 게시글 리스트 */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-600"></div>
            <p className="mt-4 text-gray-600">게시글을 불러오는 중...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500 text-lg">
              {searchQuery || selectedCategory !== 'all'
                ? '검색 결과가 없습니다.'
                : '아직 게시글이 없습니다.'}
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-4">
            {filteredPosts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MainPage;

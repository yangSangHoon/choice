import { Link } from 'react-router-dom';

const CATEGORY_LABELS = {
  couple: '연인',
  friend: '친구',
  work: '직장',
  family: '가족',
  etc: '기타',
};

function PostCard({ post }) {
  const totalVotes = post.total_votes || 0;

  return (
    <Link to={`/post/${post.id}`}>
      <div className="w-[200px] h-[120px] bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-4 cursor-pointer border border-gray-200 flex flex-col">
        <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-medium rounded-full self-start mb-2">
          {CATEGORY_LABELS[post.category] || post.category}
        </span>

        <h3 className="text-sm font-bold text-gray-900 line-clamp-2 flex-1">
          {post.title}
        </h3>

        <div className="text-xs text-gray-500 mt-2">
          💭 {totalVotes.toLocaleString()}명 투표
        </div>
      </div>
    </Link>
  );
}

export default PostCard;

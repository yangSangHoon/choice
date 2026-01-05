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
  const votesA = post.votes_a || 0;
  const votesB = post.votes_b || 0;

  const percentageA = totalVotes > 0 ? Math.round((votesA / totalVotes) * 100) : 50;
  const percentageB = totalVotes > 0 ? Math.round((votesB / totalVotes) * 100) : 50;

  return (
    <Link to={`/post/${post.id}`}>
      <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 cursor-pointer border border-gray-200">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-900 flex-1 pr-4">
            {post.title}
          </h3>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full whitespace-nowrap">
            {CATEGORY_LABELS[post.category] || post.category}
          </span>
        </div>

        <p className="text-gray-600 mb-4 line-clamp-2">
          {post.story}
        </p>

        <div className="flex items-center justify-between text-sm">
          <div className="flex gap-4 text-gray-500">
            <span>💭 총 {totalVotes.toLocaleString()}명 투표</span>
          </div>

          {totalVotes > 0 && (
            <div className="flex gap-2 text-xs font-medium">
              <span className="text-blue-600">{post.side_a_label} {percentageA}%</span>
              <span className="text-gray-400">vs</span>
              <span className="text-red-600">{post.side_b_label} {percentageB}%</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

export default PostCard;

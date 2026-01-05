import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { hasVoted, addVotedPost, getUserDemographics, setUserDemographics } from '../utils/localStorage';
import DemographicsModal from '../components/DemographicsModal';
import VoteResult from '../components/VoteResult';

const CATEGORY_LABELS = {
  couple: '연인',
  friend: '친구',
  work: '직장',
  family: '가족',
  etc: '기타',
};

function DetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [voted, setVoted] = useState(false);
  const [showDemographicsModal, setShowDemographicsModal] = useState(false);
  const [pendingVote, setPendingVote] = useState(null);

  useEffect(() => {
    fetchPost();
    setVoted(hasVoted(id));
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      if (data) {
        setPost(data);
      } else {
        alert('게시글을 찾을 수 없습니다.');
        navigate('/');
      }
    } catch (error) {
      console.error('Error fetching post:', error);
      alert('게시글을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (side) => {
    if (voted) {
      alert('이미 투표하셨습니다.');
      return;
    }

    // 인구통계 정보가 없으면 모달 표시
    const demographics = getUserDemographics();
    if (!demographics) {
      setPendingVote(side);
      setShowDemographicsModal(true);
      return;
    }

    await submitVote(side);
  };

  const handleDemographicsSubmit = async (demographics) => {
    setUserDemographics(demographics);
    setShowDemographicsModal(false);

    if (pendingVote) {
      await submitVote(pendingVote);
      setPendingVote(null);
    }
  };

  const submitVote = async (side) => {
    try {
      const field = side === 'a' ? 'votes_a' : 'votes_b';
      const currentValue = post[field] || 0;

      const { error } = await supabase
        .from('posts')
        .update({ [field]: currentValue + 1 })
        .eq('id', id);

      if (error) throw error;

      // 로컬 상태 업데이트
      setPost(prev => ({
        ...prev,
        [field]: (prev[field] || 0) + 1
      }));

      addVotedPost(id);
      setVoted(true);
    } catch (error) {
      console.error('Error submitting vote:', error);
      alert('투표 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-600"></div>
          <p className="mt-4 text-gray-600">게시글을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  const totalVotes = (post.votes_a || 0) + (post.votes_b || 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* 게시글 헤더 */}
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 mb-6">
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex-1 pr-4">
              {post.title}
            </h1>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full whitespace-nowrap">
              {CATEGORY_LABELS[post.category] || post.category}
            </span>
          </div>

          <div className="prose max-w-none">
            <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
              {post.story}
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-gray-500 text-sm">
              총 {totalVotes.toLocaleString()}명이 투표했습니다
            </p>
          </div>
        </div>

        {/* 투표 섹션 */}
        {voted ? (
          <VoteResult
            sideALabel={post.side_a_label}
            sideBLabel={post.side_b_label}
            votesA={post.votes_a || 0}
            votesB={post.votes_b || 0}
          />
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
            <h2 className="text-xl font-bold text-center mb-6 text-gray-900">
              누구의 편을 들어주시겠어요?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => handleVote('a')}
                className="group relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105 active:scale-95 shadow-lg"
              >
                <div className="text-xl md:text-2xl font-bold mb-2">
                  {post.side_a_label}
                </div>
                <div className="text-blue-100 text-sm">
                  이쪽 편 들기
                </div>
              </button>

              <button
                onClick={() => handleVote('b')}
                className="group relative overflow-hidden bg-gradient-to-br from-red-500 to-red-600 text-white p-6 rounded-xl hover:from-red-600 hover:to-red-700 transition-all transform hover:scale-105 active:scale-95 shadow-lg"
              >
                <div className="text-xl md:text-2xl font-bold mb-2">
                  {post.side_b_label}
                </div>
                <div className="text-red-100 text-sm">
                  이쪽 편 들기
                </div>
              </button>
            </div>

            <p className="text-center text-gray-500 text-sm mt-6">
              한 번만 투표할 수 있습니다
            </p>
          </div>
        )}

        {/* 뒤로가기 버튼 */}
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            ← 목록으로 돌아가기
          </button>
        </div>
      </div>

      {/* 인구통계 모달 */}
      {showDemographicsModal && (
        <DemographicsModal
          onSubmit={handleDemographicsSubmit}
          onClose={() => {
            setShowDemographicsModal(false);
            setPendingVote(null);
          }}
        />
      )}
    </div>
  );
}

export default DetailPage;

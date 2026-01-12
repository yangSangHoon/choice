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

  const handleShare = async (platform) => {
    const url = window.location.href;
    const text = `${post.title} - 누구 편을 들어줄래?`;

    switch (platform) {
      case 'copy':
        try {
          await navigator.clipboard.writeText(url);
          alert('링크가 복사되었습니다!');
        } catch {
          alert('링크 복사에 실패했습니다.');
        }
        break;
      case 'twitter':
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
          '_blank'
        );
        break;
      case 'kakao':
        if (window.Kakao?.Share) {
          window.Kakao.Share.sendDefault({
            objectType: 'feed',
            content: {
              title: post.title,
              description: `${post.side_a_label} vs ${post.side_b_label}`,
              imageUrl: 'https://via.placeholder.com/300x200',
              link: { mobileWebUrl: url, webUrl: url },
            },
            buttons: [
              { title: '투표하기', link: { mobileWebUrl: url, webUrl: url } },
            ],
          });
        } else {
          // 카카오 SDK 없으면 기본 공유
          window.open(
            `https://story.kakao.com/share?url=${encodeURIComponent(url)}`,
            '_blank'
          );
        }
        break;
      case 'native':
        if (navigator.share) {
          navigator.share({ title: post.title, text, url });
        }
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* 뒤로가기 */}
        <button
          onClick={() => navigate('/')}
          className="text-gray-500 hover:text-gray-700 text-sm mb-4 flex items-center gap-1"
        >
          ← 목록
        </button>

        {/* 게시글 헤더 */}
        <div className="bg-white rounded-lg shadow p-5 mb-4 border-l-4 border-l-blue-400">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs font-medium rounded-full">
              {CATEGORY_LABELS[post.category] || post.category}
            </span>
            <span className="text-xs text-gray-400">
              {totalVotes}명 투표
            </span>
          </div>

          <h1 className="text-lg font-bold text-gray-900 mb-4">
            {post.title}
          </h1>

          <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">
            {post.story}
          </div>

          {/* 공유 버튼 */}
          <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
            <button
              onClick={() => handleShare('copy')}
              className="p-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
              title="링크 복사"
            >
              🔗
            </button>
            <button
              onClick={() => handleShare('twitter')}
              className="p-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
              title="트위터 공유"
            >
              𝕏
            </button>
            <button
              onClick={() => handleShare('kakao')}
              className="p-1.5 text-xs bg-yellow-100 hover:bg-yellow-200 rounded transition-colors"
              title="카카오톡 공유"
            >
              💬
            </button>
            {navigator.share && (
              <button
                onClick={() => handleShare('native')}
                className="p-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                title="공유하기"
              >
                📤
              </button>
            )}
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
          <div className="bg-white rounded-lg shadow p-5">
            <p className="text-sm text-center mb-4 text-gray-500">
              누구의 편을 들어주시겠어요?
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => handleVote('a')}
                className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 py-3 px-4 rounded-lg transition-colors text-sm font-medium border border-blue-200"
              >
                {post.side_a_label}
              </button>

              <button
                onClick={() => handleVote('b')}
                className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 py-3 px-4 rounded-lg transition-colors text-sm font-medium border border-red-200"
              >
                {post.side_b_label}
              </button>
            </div>

            <p className="text-center text-gray-400 text-xs mt-3">
              한 번만 투표할 수 있습니다
            </p>
          </div>
        )}
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

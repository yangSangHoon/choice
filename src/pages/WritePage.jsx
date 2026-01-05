import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { saveDraft, getDraft, clearDraft } from '../utils/localStorage';

const CATEGORIES = [
  { id: 'couple', label: '연인' },
  { id: 'friend', label: '친구' },
  { id: 'work', label: '직장' },
  { id: 'family', label: '가족' },
  { id: 'etc', label: '기타' },
];

function WritePage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    category: 'couple',
    story: '',
    side_a_label: '',
    side_b_label: '',
  });
  const [submitting, setSubmitting] = useState(false);

  // 컴포넌트 마운트 시 임시 저장된 글 불러오기
  useEffect(() => {
    const draft = getDraft();
    if (draft) {
      const shouldRestore = window.confirm(
        '임시 저장된 글이 있습니다. 불러오시겠습니까?'
      );
      if (shouldRestore) {
        setFormData({
          title: draft.title || '',
          category: draft.category || 'couple',
          story: draft.story || '',
          side_a_label: draft.side_a_label || '',
          side_b_label: draft.side_b_label || '',
        });
      } else {
        clearDraft();
      }
    }
  }, []);

  // 폼 데이터 변경 시 임시 저장
  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.title || formData.story) {
        saveDraft(formData);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [formData]);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 유효성 검사
    if (!formData.title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }
    if (!formData.story.trim()) {
      alert('본문을 입력해주세요.');
      return;
    }
    if (!formData.side_a_label.trim() || !formData.side_b_label.trim()) {
      alert('양쪽 입장의 라벨을 모두 입력해주세요.');
      return;
    }

    try {
      setSubmitting(true);

      // 검색 키워드 생성 (제목과 본문에서)
      const searchKeywords = [
        ...formData.title.toLowerCase().split(' '),
        ...formData.story.toLowerCase().split(' ')
      ].filter(word => word.length > 1);

      // Supabase에 저장
      const { data, error } = await supabase
        .from('posts')
        .insert({
          category: formData.category,
          title: formData.title.trim(),
          story: formData.story.trim(),
          side_a_label: formData.side_a_label.trim(),
          side_b_label: formData.side_b_label.trim(),
          votes_a: 0,
          votes_b: 0,
          search_keywords: searchKeywords
        })
        .select()
        .single();

      if (error) throw error;

      // 임시 저장 삭제
      clearDraft();

      alert('게시글이 작성되었습니다!');
      navigate(`/post/${data.id}`);
    } catch (error) {
      console.error('Error creating post:', error);
      alert('게시글 작성 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900">
            새 이야기 작성하기
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 제목 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                제목 *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="갈등 상황을 간단히 요약해주세요"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                maxLength={100}
              />
              <p className="mt-1 text-sm text-gray-500 text-right">
                {formData.title.length}/100
              </p>
            </div>

            {/* 카테고리 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                카테고리 *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {CATEGORIES.map(category => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => handleChange('category', category.id)}
                    className={`py-2 px-4 rounded-lg font-medium transition-colors ${
                      formData.category === category.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 본문 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이야기 (본문) *
              </label>
              <textarea
                value={formData.story}
                onChange={(e) => handleChange('story', e.target.value)}
                placeholder="상황을 자세히 설명해주세요. 어떤 갈등이 있었나요? 어떤 감정을 느꼈나요?"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[300px] resize-y"
                maxLength={5000}
              />
              <p className="mt-1 text-sm text-gray-500 text-right">
                {formData.story.length}/5000
              </p>
            </div>

            {/* Side A/B 라벨 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  첫 번째 입장 (A) *
                </label>
                <input
                  type="text"
                  value={formData.side_a_label}
                  onChange={(e) => handleChange('side_a_label', e.target.value)}
                  placeholder="예: 서운한 아내"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  maxLength={20}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  두 번째 입장 (B) *
                </label>
                <input
                  type="text"
                  value={formData.side_b_label}
                  onChange={(e) => handleChange('side_b_label', e.target.value)}
                  placeholder="예: 당황한 남편"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  maxLength={20}
                />
              </div>
            </div>

            {/* 안내 메시지 */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                💡 <strong>Tip:</strong> 상황을 객관적으로 설명하되, 양쪽 입장을 모두 이해할 수 있도록 작성하면 더 많은 공감과 투표를 받을 수 있습니다.
              </p>
            </div>

            {/* 버튼 */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                disabled={submitting}
              >
                취소
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {submitting ? '작성 중...' : '게시하기'}
              </button>
            </div>

            {/* 임시 저장 안내 */}
            <p className="text-center text-sm text-gray-500">
              작성 중인 내용은 자동으로 임시 저장됩니다
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default WritePage;

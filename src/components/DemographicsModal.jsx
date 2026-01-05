import { useState } from 'react';

const GENDER_OPTIONS = [
  { id: 'male', label: '남성' },
  { id: 'female', label: '여성' },
  { id: 'other', label: '기타' },
];

const AGE_OPTIONS = [
  { id: 'under20', label: '20세 미만' },
  { id: '20s', label: '20대' },
  { id: '30s', label: '30대' },
  { id: '40s', label: '40대' },
  { id: '50s', label: '50대' },
  { id: 'over60', label: '60세 이상' },
];

function DemographicsModal({ onSubmit, onClose }) {
  const [gender, setGender] = useState('');
  const [ageGroup, setAgeGroup] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!gender || !ageGroup) {
      alert('성별과 연령대를 모두 선택해주세요.');
      return;
    }

    onSubmit({ gender, ageGroup });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">
          투표 전 정보 입력
        </h2>
        <p className="text-gray-600 mb-6">
          통계를 위해 간단한 정보를 입력해주세요. 이 정보는 한 번만 입력하시면 됩니다.
        </p>

        <form onSubmit={handleSubmit}>
          {/* 성별 선택 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              성별
            </label>
            <div className="grid grid-cols-3 gap-2">
              {GENDER_OPTIONS.map(option => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setGender(option.id)}
                  className={`py-2 px-4 rounded-lg font-medium transition-colors ${
                    gender === option.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* 연령대 선택 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              연령대
            </label>
            <div className="grid grid-cols-2 gap-2">
              {AGE_OPTIONS.map(option => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setAgeGroup(option.id)}
                  className={`py-2 px-4 rounded-lg font-medium transition-colors ${
                    ageGroup === option.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* 버튼 */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              투표하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DemographicsModal;

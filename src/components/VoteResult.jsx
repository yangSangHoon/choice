function VoteResult({ sideALabel, sideBLabel, votesA, votesB }) {
  const total = votesA + votesB;
  const percentageA = total > 0 ? Math.round((votesA / total) * 100) : 50;
  const percentageB = total > 0 ? Math.round((votesB / total) * 100) : 50;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
      <h2 className="text-xl font-bold text-center mb-6 text-gray-900">
        투표 결과
      </h2>

      {/* Side A */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="font-bold text-lg text-blue-600">{sideALabel}</span>
          <span className="font-bold text-lg text-blue-600">{percentageA}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-8 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-1000 ease-out flex items-center justify-end pr-3"
            style={{ width: `${percentageA}%` }}
          >
            {percentageA > 15 && (
              <span className="text-white text-sm font-medium">
                {votesA.toLocaleString()}명
              </span>
            )}
          </div>
        </div>
        {percentageA <= 15 && (
          <div className="text-right mt-1">
            <span className="text-blue-600 text-sm font-medium">
              {votesA.toLocaleString()}명
            </span>
          </div>
        )}
      </div>

      {/* Side B */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="font-bold text-lg text-red-600">{sideBLabel}</span>
          <span className="font-bold text-lg text-red-600">{percentageB}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-8 overflow-hidden">
          <div
            className="bg-gradient-to-r from-red-500 to-red-600 h-full rounded-full transition-all duration-1000 ease-out flex items-center justify-end pr-3"
            style={{ width: `${percentageB}%` }}
          >
            {percentageB > 15 && (
              <span className="text-white text-sm font-medium">
                {votesB.toLocaleString()}명
              </span>
            )}
          </div>
        </div>
        {percentageB <= 15 && (
          <div className="text-right mt-1">
            <span className="text-red-600 text-sm font-medium">
              {votesB.toLocaleString()}명
            </span>
          </div>
        )}
      </div>

      <div className="text-center pt-4 border-t border-gray-200">
        <p className="text-gray-600">
          투표해주셔서 감사합니다! 🎉
        </p>
        <p className="text-gray-500 text-sm mt-1">
          총 {total.toLocaleString()}명이 참여했습니다
        </p>
      </div>
    </div>
  );
}

export default VoteResult;

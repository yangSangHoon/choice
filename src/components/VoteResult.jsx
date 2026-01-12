function VoteResult({ sideALabel, sideBLabel, votesA, votesB }) {
  const total = votesA + votesB;
  const percentageA = total > 0 ? Math.round((votesA / total) * 100) : 50;
  const percentageB = total > 0 ? Math.round((votesB / total) * 100) : 50;

  return (
    <div className="bg-white rounded-lg shadow p-5">
      <p className="text-sm text-center mb-4 text-gray-500">
        투표 결과
      </p>

      {/* Side A */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <span className="font-medium text-sm text-blue-700">{sideALabel}</span>
          <span className="font-medium text-sm text-blue-700">{percentageA}%</span>
        </div>
        <div className="w-full bg-blue-50 rounded-full h-6 overflow-hidden border border-blue-200">
          <div
            className="bg-blue-200 h-full rounded-full transition-all duration-1000 ease-out flex items-center justify-end pr-2"
            style={{ width: `${percentageA}%` }}
          >
            {percentageA > 20 && (
              <span className="text-blue-700 text-xs font-medium">
                {votesA.toLocaleString()}명
              </span>
            )}
          </div>
        </div>
        {percentageA <= 20 && (
          <div className="text-right mt-1">
            <span className="text-blue-600 text-xs font-medium">
              {votesA.toLocaleString()}명
            </span>
          </div>
        )}
      </div>

      {/* Side B */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <span className="font-medium text-sm text-red-700">{sideBLabel}</span>
          <span className="font-medium text-sm text-red-700">{percentageB}%</span>
        </div>
        <div className="w-full bg-red-50 rounded-full h-6 overflow-hidden border border-red-200">
          <div
            className="bg-red-200 h-full rounded-full transition-all duration-1000 ease-out flex items-center justify-end pr-2"
            style={{ width: `${percentageB}%` }}
          >
            {percentageB > 20 && (
              <span className="text-red-700 text-xs font-medium">
                {votesB.toLocaleString()}명
              </span>
            )}
          </div>
        </div>
        {percentageB <= 20 && (
          <div className="text-right mt-1">
            <span className="text-red-600 text-xs font-medium">
              {votesB.toLocaleString()}명
            </span>
          </div>
        )}
      </div>

      <div className="text-center pt-3 border-t border-gray-100">
        <p className="text-gray-400 text-xs">
          총 {total.toLocaleString()}명 참여
        </p>
      </div>
    </div>
  );
}

export default VoteResult;

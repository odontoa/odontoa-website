interface KeyTakeawaysV2Props {
  takeaways: string[];
}

export default function KeyTakeawaysV2({ takeaways }: KeyTakeawaysV2Props) {
  if (takeaways.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 mb-8">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Ključni zaključci</h3>
          <ul className="space-y-2">
            {takeaways.map((takeaway, index) => (
              <li key={index} className="flex items-start space-x-2">
                <span className="text-blue-600 font-medium text-sm mt-1">•</span>
                <span className="text-gray-700 text-sm">{takeaway}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}


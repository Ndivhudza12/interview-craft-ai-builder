
interface ProgressIndicatorProps {
  totalQuestions: number;
  currentIndex: number;
  answers: Array<{ questionId: number }>;
}

export function ProgressIndicator({ totalQuestions, currentIndex, answers }: ProgressIndicatorProps) {
  return (
    <div className="flex justify-center">
      <div className="flex items-center gap-1">
        {Array.from({ length: totalQuestions }).map((_, index) => (
          <div 
            key={index}
            className={`h-2 w-2 rounded-full ${
              index === currentIndex ? 'bg-indigo-600' : 
              answers.some(a => a.questionId === index) ? 'bg-indigo-300' : 'bg-gray-300'
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
}

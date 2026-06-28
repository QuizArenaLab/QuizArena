import { CompetitionResultReadModel } from "../../../types/results.types";
import { Check, X, Minus } from "lucide-react";

export function QuestionReviewRegion({ data }: { data: CompetitionResultReadModel }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Question Review</h2>
      <div className="space-y-4">
        {data.questionReviews.map((review, idx) => (
          <div key={review.questionId} className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="mt-1">
                {review.isSkipped ? (
                  <Minus className="text-slate-500 w-6 h-6" />
                ) : review.isCorrect ? (
                  <Check className="text-green-500 w-6 h-6" />
                ) : (
                  <X className="text-red-500 w-6 h-6" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm text-slate-400 mb-1">Question {idx + 1}</p>
                <div 
                  className="text-white text-lg mb-4" 
                  dangerouslySetInnerHTML={{ __html: review.questionText }} 
                />
                
                <div className="space-y-2">
                  {review.options.map(opt => {
                    const isSelected = opt.id === review.userAnswerId;
                    const isCorrect = opt.id === review.correctAnswerId;
                    
                    let bg = "bg-slate-800 border-slate-700";
                    let text = "text-slate-300";
                    
                    if (isCorrect) {
                      bg = "bg-green-500/10 border-green-500/50";
                      text = "text-green-400";
                    } else if (isSelected && !isCorrect) {
                      bg = "bg-red-500/10 border-red-500/50";
                      text = "text-red-400";
                    }

                    return (
                      <div key={opt.id} className={`p-3 rounded-lg border ${bg} ${text}`}>
                        {opt.text}
                      </div>
                    );
                  })}
                </div>

                {review.explanation && (
                  <div className="mt-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                    <p className="text-sm font-semibold text-slate-300 mb-1">Explanation</p>
                    <p className="text-slate-400 text-sm">{review.explanation}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

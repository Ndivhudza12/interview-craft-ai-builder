
export const generateAnswerFeedback = (answer: { questionText: string; answerText: string }) => {
  const feedbacks = [
    "Your response was well-structured and addressed the key points.",
    "Consider providing more specific examples in your answer.",
    "Your answer demonstrates good understanding of the topic.",
    "The response could be more concise and focused.",
    "You effectively highlighted your relevant experience.",
    "Try to connect your skills more directly to the job requirements.",
    "Good use of technical terminology and industry knowledge.",
    "The answer could benefit from a stronger conclusion.",
  ];
  
  const index = (answer.questionText.length + answer.answerText.length) % feedbacks.length;
  return feedbacks[index];
};

export const generateImprovementTips = (answer: { questionId: number }) => {
  const tips = [
    "Use the STAR method (Situation, Task, Action, Result) to structure your response.",
    "Include quantifiable achievements when discussing your experience.",
    "Prepare 2-3 concrete examples that showcase your skills.",
    "Practice brevity while still fully answering the question.",
    "Research the company more thoroughly to tailor your answers.",
    "Focus on demonstrating problem-solving abilities.",
    "Highlight collaborative experiences and teamwork.",
    "Show enthusiasm for the role and company mission.",
  ];
  
  const index = answer.questionId % tips.length;
  return tips[index];
};

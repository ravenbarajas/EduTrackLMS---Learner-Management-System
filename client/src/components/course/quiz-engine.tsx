import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface QuizEngineProps {
  module: any;
  onComplete: (score: number) => void;
}

export default function QuizEngine({ module, onComplete }: QuizEngineProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);

  // Mock questions if none provided
  const questions = module.content?.questions || [
    {
      id: "q1",
      question: "What is the most important quality of a good leader?",
      type: "multiple-choice",
      options: ["Intelligence", "Emotional intelligence", "Technical skills", "Years of experience"],
      correctAnswer: 1
    },
    {
      id: "q2",
      question: "True or False: Leadership skills can be learned and developed over time.",
      type: "true-false",
      options: ["True", "False"],
      correctAnswer: 0
    }
  ];

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  const handleSubmit = () => {
    // Calculate score
    let correct = 0;
    questions.forEach((question, index) => {
      const userAnswer = parseInt(answers[question.id] || "0");
      if (userAnswer === question.correctAnswer) {
        correct++;
      }
    });

    const score = Math.round((correct / questions.length) * 100);
    setShowResults(true);
    
    // Complete after showing results
    setTimeout(() => {
      onComplete(score);
    }, 2000);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  if (showResults) {
    const correct = questions.filter((question, index) => {
      const userAnswer = parseInt(answers[question.id] || "0");
      return userAnswer === question.correctAnswer;
    }).length;
    
    const score = Math.round((correct / questions.length) * 100);

    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Quiz Results</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <div className="mb-6">
            <div className="text-4xl font-bold text-emerald-600 mb-2">
              {score}%
            </div>
            <div className="text-slate-600">
              You got {correct} out of {questions.length} questions correct
            </div>
          </div>
          
          <div className="flex justify-center">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center ${
              score >= 80 ? 'bg-emerald-100' : score >= 60 ? 'bg-amber-100' : 'bg-red-100'
            }`}>
              <i className={`text-3xl ${
                score >= 80 ? 'fas fa-trophy text-emerald-500' : 
                score >= 60 ? 'fas fa-medal text-amber-500' : 
                'fas fa-times text-red-500'
              }`}></i>
            </div>
          </div>
          
          <div className="mt-4 text-sm text-slate-600">
            {score >= 80 ? 'Excellent work! Moving to next module...' :
             score >= 60 ? 'Good job! Moving to next module...' :
             'You may want to review the material before continuing.'}
          </div>
        </CardContent>
      </Card>
    );
  }

  const question = questions[currentQuestion];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Knowledge Check</CardTitle>
          <div className="text-sm text-slate-600">
            Question {currentQuestion + 1} of {questions.length}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <h4 className="font-medium text-slate-900 mb-4">
            {currentQuestion + 1}. {question.question}
          </h4>
          
          <RadioGroup
            value={answers[question.id] || ""}
            onValueChange={(value) => handleAnswerChange(question.id, value)}
          >
            {question.options.map((option: string, index: number) => (
              <div key={index} className="flex items-center space-x-2 p-3 border border-slate-200 rounded-lg hover:bg-slate-50">
                <RadioGroupItem value={index.toString()} id={`${question.id}-${index}`} />
                <Label htmlFor={`${question.id}-${index}`} className="flex-1 cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePreviousQuestion}
            disabled={currentQuestion === 0}
          >
            <i className="fas fa-arrow-left mr-2"></i>
            Previous
          </Button>
          
          <div className="flex space-x-2">
            {questions.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full ${
                  index === currentQuestion
                    ? 'bg-blue-500'
                    : answers[questions[index].id]
                    ? 'bg-emerald-500'
                    : 'bg-slate-300'
                }`}
              />
            ))}
          </div>

          {currentQuestion === questions.length - 1 ? (
            <Button
              onClick={handleSubmit}
              disabled={!answers[question.id]}
              className="bg-blue-500 hover:bg-blue-600"
            >
              Submit Quiz
            </Button>
          ) : (
            <Button
              onClick={handleNextQuestion}
              disabled={!answers[question.id]}
              className="bg-blue-500 hover:bg-blue-600"
            >
              Next
              <i className="fas fa-arrow-right ml-2"></i>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

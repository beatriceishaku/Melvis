
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";

interface Question {
  id: number;
  text: string;
  options: string[];
}

const questions: Question[] = [
  {
    id: 1,
    text: "Over the past 2 weeks, how often have you felt down, depressed, or hopeless?",
    options: ["Not at all", "Several days", "More than half the days", "Nearly every day"],
  },
  {
    id: 2,
    text: "Over the past 2 weeks, how often have you had little interest or pleasure in doing things?",
    options: ["Not at all", "Several days", "More than half the days", "Nearly every day"],
  },
  {
    id: 3,
    text: "How would you rate your sleep quality over the past 2 weeks?",
    options: ["Very good", "Good", "Average", "Poor", "Very poor"],
  },
  {
    id: 4,
    text: "How often do you feel overwhelmed by stress?",
    options: ["Rarely", "Sometimes", "Often", "Almost always"],
  },
  {
    id: 5,
    text: "How difficult have you found it to relax over the past 2 weeks?",
    options: ["Not difficult at all", "A little difficult", "Very difficult", "Extremely difficult"],
  },
  {
    id: 6,
    text: "How often have you been bothered by feeling nervous, anxious, or on edge?",
    options: ["Not at all", "Several days", "More than half the days", "Nearly every day"],
  },
  {
    id: 7,
    text: "How would you rate your ability to cope with daily challenges?",
    options: ["Excellent", "Good", "Fair", "Poor", "Very poor"],
  },
  {
    id: 8,
    text: "How connected do you feel to others in your life?",
    options: ["Very connected", "Somewhat connected", "Not very connected", "Not at all connected"],
  },
  {
    id: 9,
    text: "How often do you engage in activities that you enjoy?",
    options: ["Daily", "Several times a week", "Once a week", "Rarely", "Never"],
  },
  {
    id: 10,
    text: "How would you rate your overall mental well-being at the moment?",
    options: ["Excellent", "Good", "Fair", "Poor", "Very poor"],
  },
];

interface ResultCategory {
  range: [number, number];
  title: string;
  description: string;
  recommendations: string[];
}

const resultCategories: ResultCategory[] = [
  {
    range: [0, 10],
    title: "Excellent Mental Well-being",
    description: "Your responses suggest that you are currently experiencing positive mental health. Continue your healthy practices!",
    recommendations: [
      "Maintain your current self-care routines",
      "Consider mentoring others in mental wellness",
      "Keep monitoring your mental health periodically"
    ]
  },
  {
    range: [11, 20],
    title: "Good Mental Well-being",
    description: "You appear to be doing well overall, with some room for improvement in specific areas.",
    recommendations: [
      "Focus on areas where you scored lower",
      "Practice mindfulness for 10 minutes daily",
      "Maintain social connections"
    ]
  },
  {
    range: [21, 30],
    title: "Moderate Concerns",
    description: "You're experiencing some challenges that may benefit from additional attention and self-care.",
    recommendations: [
      "Consider daily meditation or mindfulness",
      "Establish a regular sleep schedule",
      "Reach out to friends or family for support",
      "Limit social media and news consumption"
    ]
  },
  {
    range: [31, 40],
    title: "Significant Concerns",
    description: "Your responses indicate you may be experiencing notable difficulties with your mental well-being.",
    recommendations: [
      "Consider speaking with a mental health professional",
      "Prioritize self-care activities daily",
      "Practice deep breathing exercises when feeling stressed",
      "Create a structured daily routine",
      "Reach out to supportive friends or family"
    ]
  }
];

const Assessment = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [resultCategory, setResultCategory] = useState<ResultCategory | null>(null);

  const handleNext = () => {
    if (currentAnswer === null) return;
    
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = currentAnswer;
    setAnswers(newAnswers);
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setCurrentAnswer(null);
    } else {
      // Calculate score
      const totalScore = newAnswers.reduce((sum, value) => sum + value, 0);
      setScore(totalScore);
      
      // Determine result category
      const category = resultCategories.find(
        cat => totalScore >= cat.range[0] && totalScore <= cat.range[1]
      ) || resultCategories[resultCategories.length - 1];
      
      setResultCategory(category);
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setCurrentAnswer(answers[currentQuestion - 1] || null);
    }
  };

  const restartAssessment = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setCurrentAnswer(null);
    setShowResults(false);
    setScore(0);
    setResultCategory(null);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-blue-800">Mental Health Assessment</h1>
          <p className="text-xl text-blue-600">
            {showResults
              ? "Your assessment results"
              : "Take a moment to honestly assess your current state"}
          </p>
        </div>

        {!showResults ? (
          <Card className="max-w-3xl mx-auto">
            <CardHeader>
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm text-blue-600">
                  Question {currentQuestion + 1} of {questions.length}
                </p>
                <p className="text-sm text-blue-600">
                  {Math.round(((currentQuestion + 1) / questions.length) * 100)}% Complete
                </p>
              </div>
              <Progress
                value={((currentQuestion + 1) / questions.length) * 100}
                className="h-2"
              />
              <CardTitle className="mt-4 text-blue-700">
                {questions[currentQuestion].text}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={currentAnswer !== null ? currentAnswer.toString() : undefined}
                onValueChange={(value) => setCurrentAnswer(parseInt(value))}
                className="space-y-3"
              >
                {questions[currentQuestion].options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`}>{option}</Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
              >
                Previous
              </Button>
              <Button
                onClick={handleNext}
                disabled={currentAnswer === null}
              >
                {currentQuestion < questions.length - 1 ? "Next" : "Submit"}
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card className="max-w-3xl mx-auto">
              <CardHeader>
                <CardTitle className="text-blue-700">{resultCategory?.title}</CardTitle>
                <CardDescription className="text-lg">{resultCategory?.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Recommendations:</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    {resultCategory?.recommendations.map((rec, i) => (
                      <li key={i}>{rec}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Your Assessment Results</h3>
                  <div className="w-full bg-blue-100 rounded-full h-4 mb-1">
                    <div
                      className="bg-blue-600 h-4 rounded-full"
                      style={{ width: `${(score / 40) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm text-blue-600">
                    <span>Low Concern</span>
                    <span>Moderate Concern</span>
                    <span>High Concern</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <p className="text-blue-600">
                  Remember, this is a self-assessment tool and not a clinical diagnosis.
                  If you're experiencing significant distress, please consult with a mental health professional.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button onClick={restartAssessment} variant="outline">Retake Assessment</Button>
                  <Button asChild>
                    <a href="/chat">Talk to MindfulMe AI</a>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Assessment;

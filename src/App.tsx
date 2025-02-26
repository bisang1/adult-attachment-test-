import React, { useState } from 'react';
import { Heart, ArrowRight, RefreshCw, Share2 } from 'lucide-react';
import { questions } from './questions';

function App() {
  const [started, setStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (score: number) => {
    const newAnswers = [...answers, score];
    setAnswers(newAnswers);
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setShowResult(true);
    }
  };

  const calculateResult = () => {
    const total = answers.reduce((acc, curr) => acc + curr, 0);
    const maxScore = questions.length * 4;
    const percentage = (total / maxScore) * 100;

    if (percentage >= 75) {
      return {
        title: '심각한 애정 결핍',
        description: '당신은 높은 수준의 애정 결핍을 경험하고 있을 수 있습니다. 전문가와의 상담을 고려해보세요.'
      };
    } else if (percentage >= 50) {
      return {
        title: '중간 수준의 애정 결핍',
        description: '당신은 중간 정도의 애정 결핍을 겪고 있습니다. 자신을 돌보는 시간을 가져보세요.'
      };
    } else {
      return {
        title: '건강한 상태',
        description: '당신은 비교적 건강한 애착 관계를 형성하고 있습니다.'
      };
    }
  };

  const resetTest = () => {
    setStarted(false);
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResult(false);
  };

  const shareResult = () => {
    const result = calculateResult();
    const shareText = `성인 애정 결핍 테스트 결과: ${result.title}\n${result.description}\n\n테스트 하러가기: ${window.location.href}`;
    
    if (navigator.share) {
      navigator.share({
        title: '성인 애정 결핍 테스트 결과',
        text: shareText,
        url: window.location.href,
      }).catch((error) => console.log('공유 실패:', error));
    } else {
      navigator.clipboard.writeText(shareText)
        .then(() => alert('결과가 클립보드에 복사되었습니다. 친구에게 공유해보세요!'))
        .catch(() => alert('클립보드 복사에 실패했습니다.'));
    }
  };

  if (!started) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <Heart className="w-16 h-16 text-pink-400 mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              성인 애정 결핍 테스트
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              당신의 애착 유형과 감정적 건강을 확인해보세요
            </p>
            <button
              onClick={() => setStarted(true)}
              className="bg-pink-400 hover:bg-pink-500 text-white font-semibold py-3 px-8 rounded-full shadow-lg transform transition hover:scale-105 flex items-center mx-auto"
            >
              테스트 시작하기
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showResult) {
    const result = calculateResult();
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
              {result.title}
            </h2>
            <p className="text-lg text-gray-600 text-center mb-8">
              {result.description}
            </p>
            <div className="space-y-4">
              <button
                onClick={resetTest}
                className="bg-pink-400 hover:bg-pink-500 text-white font-semibold py-3 px-8 rounded-full shadow-lg transform transition hover:scale-105 flex items-center mx-auto"
              >
                <RefreshCw className="mr-2 w-5 h-5" />
                다시 테스트하기
              </button>
              <button
                onClick={shareResult}
                className="bg-blue-400 hover:bg-blue-500 text-white font-semibold py-3 px-8 rounded-full shadow-lg transform transition hover:scale-105 flex items-center mx-auto"
              >
                <Share2 className="mr-2 w-5 h-5" />
                내 결과 친구에게 보내기
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-8">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-pink-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
            <p className="text-center mt-2 text-gray-600">
              {currentQuestion + 1} / {questions.length}
            </p>
          </div>
          
          <h2 className="text-xl font-semibold text-gray-800 mb-8 text-center">
            {questions[currentQuestion].question}
          </h2>
          
          <div className="space-y-4">
            {[
              { score: 1, label: '전혀 그렇지 않다' },
              { score: 2, label: '그렇지 않다' },
              { score: 3, label: '그렇다' },
              { score: 4, label: '매우 그렇다' },
            ].map((option) => (
              <button
                key={option.score}
                onClick={() => handleAnswer(option.score)}
                className="w-full py-3 px-6 text-left rounded-lg hover:bg-pink-50 transition-colors duration-200 border border-gray-200 hover:border-pink-200"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

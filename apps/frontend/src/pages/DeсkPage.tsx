import { useEffect, useMemo, useState } from "react";
import { useGetCardsFromDeck, useUpdateDeck } from "../hooks/useDecks";
import { useNavigate, useParams } from "react-router";

type Card = {
  id: string;
  question: string;
  answer: string;
  options: string[];
  explanation?: string;
};

type AnswerState = {
  cardId: string;
  question: string;
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
};

const shuffleArray = <T,>(items: T[]) => {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const DeсkPage = () => {
  const { deckId } = useParams() as { deckId: string };
  const {
    data: cardsFetch,
    isLoading,
    isError,
    error,
  } = useGetCardsFromDeck(deckId as string);

  const [cards, setCards] = useState<Card[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answerHistory, setAnswerHistory] = useState<AnswerState[]>([]);
  const [isQuizFinished, setIsQuizFinished] = useState(false);

  const { mutate: completeDeck } = useUpdateDeck();

  useEffect(() => {
    if (cardsFetch?.cards?.length) {
      setCards(shuffleArray(cardsFetch.cards as Card[]));
      setCurrentQuestionIndex(0);
      setIsQuizFinished(false);
      setAnswerHistory([]);
      setStartTime(Date.now());
      setSeconds(0);
    }
  }, [cardsFetch]);

  const currentCard = cards[currentQuestionIndex];

  const currentAnswers = useMemo(() => {
    if (!currentCard) return [];

    const answers = [currentCard.answer, ...(currentCard.options ?? [])];
    return shuffleArray(answers);
  }, [currentCard]);

  const handleAnswer = (selectedAnswer: string) => {
    if (!currentCard) return;

    const nextIndex = currentQuestionIndex + 1;
    const isCorrect = selectedAnswer === currentCard.answer;

    setAnswerHistory((prev) => [
      ...prev,
      {
        cardId: currentCard.id,
        question: currentCard.question,
        selectedAnswer,
        correctAnswer: currentCard.answer,
        isCorrect,
      },
    ]);

    if (nextIndex >= cards.length) {
      setIsQuizFinished(true);
      completeDeck({ deckId, data: { isCompleted: true } });
      return;
    }

    setCurrentQuestionIndex(nextIndex);
  };

  const [startTime, setStartTime] = useState<number | null>(null);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (isQuizFinished || startTime === null) return undefined;

    const interval = window.setInterval(() => {
      setSeconds(Math.max(0, Math.floor((Date.now() - startTime) / 1000)));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [startTime, isQuizFinished]);

  const formatTime = (value: number) => {
    const mins = Math.floor(value / 60)
      .toString()
      .padStart(2, "0");
    const secs = (value % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return <div>Loading quiz...</div>;
  }

  if (isError) {
    return <div>Failed to load cards: {(error as Error)?.message}</div>;
  }

  if (!cardsFetch || !cardsFetch.cards?.length) {
    return <div>No cards are found for this deck.</div>;
  }

  return (
    <div className="relative space-y-3">
      <button
        type="button"
        onClick={handleGoBack}
        className="absolute top-2 left-2 px-3 py-2 rounded-full bg-bg-background text-sm font-medium hover:bg-accent-hover"
      >
        Back
      </button>

      <div className="absolute top-2 right-2 px-3 py-2 rounded-full bg-bg-background text-sm font-medium">
        {formatTime(seconds)}
      </div>

      <section className="p-2 w-full bg-bg-surface h-50 flex justify-center items-center flex-col rounded-lg">
        <div className="flex justify-center items-center gap-3">
          <p className="px-3 py-2 rounded-full bg-bg-background">Question</p>
          <p className="p-2 rounded-full bg-bg-background">
            {Math.min(currentQuestionIndex + 1, cards.length)}/{cards.length}
          </p>
        </div>

        {isQuizFinished ? (
          <div className="flex-1 flex flex-col justify-center items-center text-4xl gap-3">
            <p>Quiz complete!</p>
            <p>
              Score: {answerHistory.filter((item) => item.isCorrect).length}/
              {answerHistory.length}
            </p>
          </div>
        ) : (
          <h1 className="flex-1 flex justify-center items-center text-4xl text-center">
            {currentCard?.question}
          </h1>
        )}
      </section>

      {!isQuizFinished && (
        <section className="w-full h-120 flex flex-col justify-center items-center gap-2">
          <h1 className="px-3 py-1 rounded-full bg-bg-surface">Options</h1>
          {currentAnswers.length > 0 ? (
            currentAnswers.map((answer) => (
              <button
                key={answer}
                type="button"
                onClick={() => handleAnswer(answer)}
                className="w-full h-1/4 bg-bg-surface rounded-lg hover:bg-accent-hover"
              >
                {answer}
              </button>
            ))
          ) : (
            <div>No answers available for this question.</div>
          )}
        </section>
      )}

      {isQuizFinished && answerHistory.length > 0 && (
        <section className="w-full p-4 bg-bg-surface rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Review</h2>
          <ul className="space-y-2">
            {answerHistory.map((item) => (
              <li
                key={item.cardId}
                className={`rounded-lg border p-3 ${item.isCorrect ? "border-green-600" : "border-red-600"}`}
              >
                <p className="font-medium">{item.question}</p>
                <p>
                  Your answer:{" "}
                  <span
                    className={
                      item.isCorrect ? "text-green-600" : "text-red-600"
                    }
                  >
                    {item.selectedAnswer}
                  </span>
                </p>
                {!item.isCorrect && (
                  <p>
                    Correct answer:{" "}
                    <span className="text-green-600">{item.correctAnswer}</span>
                  </p>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};

export default DeсkPage;

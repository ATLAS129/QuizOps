import { useEffect, useMemo, useRef, useState } from "react";
import {
  FaArrowLeft,
  FaArrowRight,
  FaCheck,
  FaClock,
  FaRedo,
  FaTrophy,
  FaTimes,
} from "react-icons/fa";
import { useNavigate, useParams } from "react-router";
import { useGetCardsFromDeck, useUpdateDeck } from "../hooks/useDecks";
import { formatTime } from "../lib/formatTime";
import LoadingSpinner from "../components/LoadingSpinner";

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
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
  }
  return copy;
};

const isTrueFalseCard = (card: Card) =>
  card.options?.length === 2 &&
  card.options.includes("True") &&
  card.options.includes("False");

const QuizPage = () => {
  const { deckId = "" } = useParams() as { deckId: string };
  const navigate = useNavigate();
  const {
    data: cardsFetch,
    isLoading,
    isError,
    error,
  } = useGetCardsFromDeck(deckId);
  const { mutate: completeDeck, isPending: isSavingResult } = useUpdateDeck();

  const [cards, setCards] = useState<Card[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answerHistory, setAnswerHistory] = useState<AnswerState[]>([]);
  const [isQuizFinished, setIsQuizFinished] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [seconds, setSeconds] = useState(0);
  const answeringRef = useRef(false);

  useEffect(() => {
    if (!cardsFetch?.cards?.length) return;

    setCards(shuffleArray(cardsFetch.cards as Card[]));
    setCurrentQuestionIndex(0);
    setAnswerHistory([]);
    setIsQuizFinished(false);
    setStartTime(Date.now());
    setSeconds(0);
    answeringRef.current = false;
  }, [cardsFetch]);

  useEffect(() => {
    if (isQuizFinished || startTime === null) return undefined;

    const interval = window.setInterval(() => {
      setSeconds(Math.max(0, Math.floor((Date.now() - startTime) / 1000)));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [isQuizFinished, startTime]);

  const currentCard = cards[currentQuestionIndex];
  const currentAnswers = useMemo(() => {
    if (!currentCard) return [];

    const answers = isTrueFalseCard(currentCard)
      ? ["True", "False"]
      : [currentCard.answer, ...(currentCard.options ?? [])];

    return shuffleArray([...new Set(answers)]);
  }, [currentCard]);

  const score = answerHistory.filter((answer) => answer.isCorrect).length;
  const progress = cards.length
    ? Math.round((currentQuestionIndex / cards.length) * 100)
    : 0;

  const handleAnswer = (selectedAnswer: string) => {
    if (!currentCard || isQuizFinished || answeringRef.current) return;

    answeringRef.current = true;
    const nextAnswerHistory = [
      ...answerHistory,
      {
        cardId: currentCard.id,
        question: currentCard.question,
        selectedAnswer,
        correctAnswer: currentCard.answer,
        isCorrect: selectedAnswer === currentCard.answer,
      },
    ];
    const isLastQuestion = currentQuestionIndex >= cards.length - 1;

    setAnswerHistory(nextAnswerHistory);

    if (!isLastQuestion) {
      setCurrentQuestionIndex((index) => index + 1);
      answeringRef.current = false;
      return;
    }

    const completionDuration = startTime
      ? Math.max(0, Math.floor((Date.now() - startTime) / 1000))
      : seconds;

    setIsQuizFinished(true);
    completeDeck({
      deckId,
      data: {
        isCompleted: true,
        correctAnswersCompleted: nextAnswerHistory.filter(
          (answer) => answer.isCorrect,
        ).length,
        completionDuration,
        completedAt: new Date(),
      },
    });
  };

  if (isLoading) return <LoadingSpinner />;

  if (isError) {
    return (
      <div className="flex min-h-[70svh] flex-col items-center justify-center gap-3 px-5 text-center">
        <p className="text-lg font-semibold">Unable to load this quiz</p>
        <p className="max-w-md text-sm text-text-muted">
          {(error as Error)?.message || "Please try again."}
        </p>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mt-2 inline-flex items-center gap-2 rounded-xl bg-accent-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-accent-hover"
        >
          <FaArrowLeft className="text-xs" />
          Go back
        </button>
      </div>
    );
  }

  if (!cards.length) {
    return (
      <div className="flex min-h-[70svh] flex-col items-center justify-center gap-3 px-5 text-center">
        <p className="text-lg font-semibold">This quiz has no questions</p>
        <p className="text-sm text-text-muted">
          Return to the deck and try again later.
        </p>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mt-2 inline-flex items-center gap-2 rounded-xl bg-accent-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-accent-hover"
        >
          <FaArrowLeft className="text-xs" />
          Go back
        </button>
      </div>
    );
  }

  if (isQuizFinished) {
    const percentage = Math.round((score / cards.length) * 100);

    return (
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-5 pb-10 text-left">
        <section className="overflow-hidden rounded-3xl border border-white/10 bg-bg-surface shadow-xl shadow-black/5">
          <div className="bg-accent-primary px-5 py-8 text-center text-white sm:px-8 sm:py-10">
            <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-white/15">
              <FaTrophy className="text-2xl" />
            </span>
            <p className="mt-4 text-sm font-medium text-white/75">
              Quiz complete
            </p>
            <h1 className="mt-1 text-3xl font-semibold sm:text-4xl">
              Nice work.
            </h1>
            <p className="mt-2 text-sm text-white/75">
              Here is how you did this round.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 p-5 sm:grid-cols-3 sm:p-7">
            <div className="rounded-2xl bg-bg-background p-4 text-center">
              <p className="text-3xl font-semibold text-accent-primary">
                {percentage}%
              </p>
              <p className="mt-1 text-xs text-text-muted">Accuracy</p>
            </div>
            <div className="rounded-2xl bg-bg-background p-4 text-center">
              <p className="text-3xl font-semibold text-text-primary">
                {score}/{cards.length}
              </p>
              <p className="mt-1 text-xs text-text-muted">Correct answers</p>
            </div>
            <div className="col-span-2 rounded-2xl bg-bg-background p-4 text-center sm:col-span-1">
              <p className="text-3xl font-semibold text-text-primary">
                {formatTime(seconds)}
              </p>
              <p className="mt-1 text-xs text-text-muted">Time spent</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-border-color p-5 sm:flex-row sm:justify-end sm:p-7">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border-color px-5 py-2.5 text-sm font-medium transition hover:bg-bg-surface-hover"
            >
              <FaArrowLeft className="text-xs" />
              Back to deck
            </button>
            <button
              type="button"
              disabled={isSavingResult}
              onClick={() => window.location.reload()}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-accent-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FaRedo className="text-xs" />
              Try again
            </button>
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-bg-surface p-5 shadow-xl shadow-black/5 sm:p-7">
          <div className="mb-5 border-b border-border-color pb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">
              Review
            </p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight">
              Your answers
            </h2>
          </div>
          <div className="flex flex-col gap-3">
            {answerHistory.map((item, index) => {
              const card = cards.find((current) => current.id === item.cardId);
              return (
                <article
                  key={item.cardId}
                  className={`rounded-2xl border p-4 ${item.isCorrect ? "border-emerald-500/25 bg-emerald-500/5" : "border-rose-500/25 bg-rose-500/5"}`}
                >
                  <div className="flex gap-3">
                    <span
                      className={`flex size-7 shrink-0 items-center justify-center rounded-full text-xs ${item.isCorrect ? "bg-emerald-500/15 text-emerald-600" : "bg-rose-500/15 text-rose-600"}`}
                    >
                      {item.isCorrect ? <FaCheck /> : <FaTimes />}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-text-muted">
                        Question {index + 1}
                      </p>
                      <p className="mt-1 font-medium">{item.question}</p>
                      <p className="mt-3 text-sm">
                        Your answer:{" "}
                        <span
                          className={
                            item.isCorrect
                              ? "font-semibold text-emerald-600"
                              : "font-semibold text-rose-600"
                          }
                        >
                          {item.selectedAnswer}
                        </span>
                      </p>
                      {!item.isCorrect && (
                        <p className="mt-1 text-sm">
                          Correct answer:{" "}
                          <span className="font-semibold text-emerald-600">
                            {item.correctAnswer}
                          </span>
                        </p>
                      )}
                      {card?.explanation && (
                        <p className="mt-3 border-t border-current/10 pt-3 text-sm leading-6 text-text-muted">
                          {card.explanation}
                        </p>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-[calc(100svh-3.5rem)] w-full max-w-3xl flex-col gap-4 pb-8 text-left">
      <header className="flex items-center justify-between gap-4 px-1 py-1">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-text-muted transition hover:bg-bg-surface-hover hover:text-text-primary"
        >
          <FaArrowLeft className="text-xs" />
          Exit quiz
        </button>
        <div className="inline-flex items-center gap-2 rounded-lg bg-bg-surface px-3 py-2 text-sm font-semibold text-text-primary shadow-sm">
          <FaClock className="text-xs text-accent-primary" />
          {formatTime(seconds)}
        </div>
      </header>

      <section className="rounded-3xl border border-white/10 bg-bg-surface p-5 shadow-xl shadow-black/5 sm:p-8">
        <div className="flex items-center justify-between gap-4 text-xs font-medium text-text-muted">
          <span>
            {isTrueFalseCard(currentCard) ? "True / False" : "Multiple choice"}
          </span>
          <span>
            Question {currentQuestionIndex + 1} of {cards.length}
          </span>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-bg-surface-hover">
          <div
            className="h-full rounded-full bg-accent-primary transition-all duration-300"
            style={{ width: `${Math.max(progress, 5)}%` }}
          />
        </div>
        <h1 className="mt-10 max-w-2xl text-2xl font-semibold leading-tight tracking-tight text-text-primary sm:text-4xl sm:leading-tight">
          {currentCard.question}
        </h1>
      </section>

      <section className="grid gap-3 sm:grid-cols-2">
        {currentAnswers.map((answer, index) => (
          <button
            key={answer}
            type="button"
            disabled={answeringRef.current}
            onClick={() => handleAnswer(answer)}
            className="group flex min-h-20 items-center gap-4 rounded-2xl border border-border-color bg-bg-surface p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-accent-primary/50 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 sm:min-h-24 sm:p-5"
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-bg-background text-sm font-semibold text-text-muted transition group-hover:bg-accent-primary group-hover:text-white">
              {String.fromCharCode(65 + index)}
            </span>
            <span className="text-base font-medium leading-6 text-text-primary sm:text-lg">
              {answer}
            </span>
            <FaArrowRight className="ml-auto shrink-0 text-xs text-text-muted opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
          </button>
        ))}
      </section>

      <p className="px-1 text-center text-xs text-text-muted">
        Choose the best answer to continue. Your progress is saved when you
        finish.
      </p>
    </main>
  );
};

export default QuizPage;

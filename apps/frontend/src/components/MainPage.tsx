import { useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { FaFilePdf } from "react-icons/fa6";
import DecksSection from "./DecksSection";
import { useCreateDeck } from "../hooks/useDecks";
import LoadingSpinner from "./LoadingSpinner";

export interface deckInterface {
  id: string;
  title: string;
  isCompleted: boolean;
  _count: { cards: number };
}

const MainPageComponent = () => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const dragCounterRef = useRef(0);
  const [url, setUrl] = useState("");
  const [prompt, setPrompt] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { mutate: createDeck, isPending: isCreating } = useCreateDeck();

  const [numberOfQuestions, setNumberOfQuestions] = useState<
    "5" | "10" | "15" | "20"
  >("5");
  const [difficulty, setDifficulty] = useState<
    "Easy" | "Medium" | "Hard" | "Mixed"
  >("Mixed");
  const [questionType, setQuestionType] = useState<
    "Mixed" | "Multiple choice" | "True / False"
  >("Mixed");
  const [extraOptions, setExtraOptions] = useState<string[]>([]);

  const handleFileSelect = (file: File | null) => {
    if (!file) {
      setPdfFile(null);
      return;
    }

    if (file.type !== "application/pdf") {
      setErrorMessage("Please select a PDF file.");
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setErrorMessage("PDF files must be 50 MB or smaller.");
      return;
    }

    setErrorMessage(null);
    setPdfFile(file);
  };

  const handleFileInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(event.target.files?.[0] ?? null);
  };

  const handleDragEnter = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    dragCounterRef.current += 1;
    setIsDragActive(true);
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDragLeave = () => {
    dragCounterRef.current = Math.max(0, dragCounterRef.current - 1);
    if (dragCounterRef.current === 0) {
      setIsDragActive(false);
    }
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    dragCounterRef.current = 0;
    setIsDragActive(false);
    handleFileSelect(event.dataTransfer.files?.[0] ?? null);
  };

  const handleInput = () => {
    if (!textareaRef.current) return;

    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  };

  const handleCreateDeck = () => {
    if (!url.trim() && !prompt.trim() && !pdfFile) {
      setErrorMessage("Please provide a URL, prompt, or PDF file.");
      return;
    }

    setErrorMessage(null);

    createDeck(
      {
        url: url.trim() || undefined,
        prompt: prompt.trim() || undefined,
        file: pdfFile,
        questionType: questionType || undefined,
        difficulty: difficulty || undefined,
        numberOfQuestions: numberOfQuestions || undefined,
        extraOptions,
      },
      {
        onSuccess: () => {
          setUrl("");
          setPrompt("");
          setPdfFile(null);
          setExtraOptions([]);
          setErrorMessage(null);
        },
        onError: (error: any) => {
          setErrorMessage(error?.message || "Unable to create deck.");
        },
      },
    );
  };

  if (isCreating) return <LoadingSpinner />;

  return (
    <div className="flex flex-col gap-5">
      <div className="mx-auto w-full">
        {/* HEADER */}
        <header className="pb-5 flex flex-col justify-center items-center">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-accent-primary/10 px-3 py-1.5 text-sm font-medium text-accent-primary">
            <span className="text-base">✦</span>
            Quiz Generator
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-text-primary md:text-4xl">
            Create a quiz from anything
          </h1>

          <p className="mt-3 max-w-2xl text-base leading-7 text-text-muted md:text-lg">
            Add your study material and we'll turn it into a quiz for you.
          </p>
        </header>

        {/* Main card */}
        <div className="overflow-hidden rounded-4xl border border-white/[0.07] bg-bg-surface shadow-2xl p-5 shadow-black/20">
          {/* STEP 1 */}
          <section className="flex flex-col items-center">
            <div className="mb-6 flex items-center justify-center gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent-primary text-sm font-bold text-white shadow-lg shadow-accent-primary/20">
                1
              </div>

              <div>
                <h2 className="place-self-start text-xl font-semibold text-text-primary">
                  Add your material
                </h2>

                <p className="place-self-start mt-1 text-sm leading-6 text-text-muted md:text-base">
                  Start with a PDF. You can add more sources below.
                </p>
              </div>
            </div>

            {/* PDF upload */}
            <div
              className={`w-full group relative overflow-hidden rounded-3xl border transition-all duration-300 ${
                isDragActive
                  ? "border-accent-primary bg-accent-primary/10 shadow-xl shadow-accent-primary/10"
                  : pdfFile
                    ? "border-accent-primary/40 bg-accent-primary/5"
                    : "border-white/8 bg-bg-background hover:border-accent-primary/30 hover:bg-bg-background/80"
              }`}
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={handleFileInputChange}
              />

              <div className="flex min-h-82.5 cursor-pointer flex-col items-center justify-center px-6 py-12 text-center md:min-h-95">
                {pdfFile ? (
                  <>
                    <div className="mb-6 flex size-24 items-center justify-center rounded-[28px] bg-accent-primary/10">
                      <FaFilePdf className="size-11 text-accent-primary" />
                    </div>

                    <div className="mb-2 rounded-full bg-accent-primary/10 px-3 py-1 text-sm font-medium text-accent-primary">
                      PDF added
                    </div>

                    <p className="max-w-xl truncate text-lg font-semibold text-text-primary md:text-xl">
                      {pdfFile.name}
                    </p>

                    <p className="mt-2 text-sm text-text-muted md:text-base">
                      Ready to generate your quiz.
                    </p>

                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        setPdfFile(null);
                        setErrorMessage(null);

                        if (fileInputRef.current) {
                          fileInputRef.current.value = "";
                        }
                      }}
                      className="mt-6 rounded-xl border border-white/8 bg-bg-surface px-5 py-3 text-sm font-medium text-text-muted transition hover:border-rose-400/30 hover:bg-rose-400/10 hover:text-rose-400"
                    >
                      Choose another file
                    </button>
                  </>
                ) : (
                  <>
                    <div
                      className={`mb-7 flex size-24 items-center justify-center rounded-[28px] transition-all duration-300 ${
                        isDragActive
                          ? "bg-accent-primary/15 scale-105"
                          : "bg-bg-surface group-hover:bg-accent-primary/10 group-hover:scale-105"
                      }`}
                    >
                      <FaFilePdf
                        className={`size-11 transition-all ${
                          isDragActive
                            ? "text-accent-primary"
                            : "text-text-muted group-hover:text-accent-primary"
                        }`}
                      />
                    </div>

                    <h3 className="text-xl font-semibold text-text-primary md:text-2xl">
                      {isDragActive ? "Drop your PDF here" : "Upload your PDF"}
                    </h3>

                    <p className="mt-2 text-sm text-text-muted md:text-base">
                      Drag and drop your file here, or click to browse
                    </p>

                    <div className="mt-6 flex items-center gap-2 text-sm text-text-muted">
                      <span className="rounded-lg bg-bg-surface px-3 py-1.5">
                        PDF
                      </span>

                      <span>•</span>

                      <span>Up to 50 MB</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Additional sources */}
            <div className="p-2 gap-3 flex">
              {/* URL */}
              <details className="overflow-hidden rounded-2xl border border-white/7 bg-bg-background transition hover:border-white/11">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-5 md:px-6">
                  <div className="flex items-center gap-4">
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-bg-surface text-xl">
                      🌐
                    </div>

                    <div>
                      <p className="text-base font-semibold text-text-primary md:text-lg">
                        Add a webpage
                      </p>

                      <p className="mt-1 text-sm text-text-muted">
                        Use content from a website
                      </p>
                    </div>
                  </div>

                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-bg-surface text-lg text-text-muted transition group-open:rotate-180">
                    ↓
                  </div>
                </summary>

                <div className="border-t border-white/6 px-5 pb-5 pt-4 md:px-6">
                  <input
                    type="text"
                    id="url"
                    value={url}
                    onChange={(event) => setUrl(event.target.value)}
                    placeholder="Paste a webpage URL"
                    className="w-full rounded-xl border border-bg-surface-hover bg-bg-surface px-4 py-4 text-base text-text-primary outline-none transition placeholder:text-text-muted/60 focus:border-accent-primary focus:ring-4 focus:ring-accent-primary/10"
                  />
                </div>
              </details>

              {/* Prompt */}
              <details className="group overflow-hidden rounded-2xl border border-white/[0.07] bg-bg-background transition hover:border-white/11">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-5 md:px-6 [&::-webkit-details-marker]:hidden">
                  <div className="flex items-center gap-4">
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-bg-surface text-xl">
                      ✨
                    </div>

                    <div>
                      <p className="text-base font-semibold text-text-primary md:text-lg">
                        Add instructions
                      </p>

                      <p className="mt-1 text-sm text-text-muted">
                        Tell AI what to focus on
                      </p>
                    </div>
                  </div>

                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-bg-surface text-lg text-text-muted transition group-open:rotate-180">
                    ↓
                  </div>
                </summary>

                <div className="border-t border-white/6 px-5 pb-5 pt-4 md:px-6">
                  <textarea
                    ref={textareaRef}
                    id="prompt"
                    value={prompt}
                    onChange={(event) => setPrompt(event.target.value)}
                    onInput={handleInput}
                    placeholder="Example: Focus on important concepts and avoid easy questions."
                    className="min-h-36 w-full resize-none rounded-xl border border-bg-surface-hover bg-bg-surface px-4 py-4 text-base leading-6 text-text-primary outline-none transition placeholder:text-text-muted/60 focus:border-accent-primary focus:ring-4 focus:ring-accent-primary/10"
                  />
                </div>
              </details>
            </div>

            {/* Added source summary */}
            {(pdfFile || url || prompt) && (
              <div className="mt-4 flex flex-wrap items-center gap-2 rounded-2xl border border-accent-primary/10 bg-accent-primary/4 px-4 py-3">
                <span className="text-sm font-medium text-text-primary">
                  Added:
                </span>

                {pdfFile && (
                  <span className="rounded-lg bg-bg-surface px-3 py-1.5 text-sm text-text-muted">
                    PDF
                  </span>
                )}

                {url && (
                  <span className="rounded-lg bg-bg-surface px-3 py-1.5 text-sm text-text-muted">
                    Webpage
                  </span>
                )}

                {prompt && (
                  <span className="rounded-lg bg-bg-surface px-3 py-1.5 text-sm text-text-muted">
                    Instructions
                  </span>
                )}
              </div>
            )}
          </section>

          {/* STEP 2 */}
          <section>
            <div className="flex justify-center items-center gap-5 py-5">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent-primary text-sm font-bold text-white shadow-lg shadow-accent-primary/20">
                2
              </div>

              <div>
                <h2 className="place-self-start text-xl font-semibold text-text-primary">
                  Customize your quiz
                </h2>

                <p className="place-self-start mt-1 text-sm leading-6 text-text-muted md:text-base">
                  These settings are optional — AI will choose sensible
                  defaults.
                </p>
              </div>
            </div>

            <details className="group overflow-hidden rounded-2xl border border-white/[0.07] bg-bg-background">
              <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-5 md:px-6 [&::-webkit-details-marker]:hidden">
                <div className="flex items-center gap-2">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-bg-surface text-xl">
                    ⚙
                  </div>

                  <div>
                    <p className="place-self-start text-base font-semibold text-text-primary md:text-lg">
                      Generation preferences
                    </p>

                    <p className="text-sm text-text-muted">
                      Questions, types, difficulty, and more
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="hidden rounded-full bg-bg-surface px-3 py-1.5 text-xs font-medium text-text-muted sm:block">
                    Optional
                  </span>

                  <div className="flex size-10 items-center justify-center rounded-xl bg-bg-surface text-lg text-text-muted transition group-open:rotate-180">
                    ↓
                  </div>
                </div>
              </summary>

              <div className="border-t border-white/6 p-5 md:p-6">
                {/* Quantity */}
                <div className="mb-4 rounded-2xl border border-white/6 bg-bg-surface p-5">
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <p className="place-self-start text-base font-semibold text-text-primary md:text-lg">
                        Number of questions
                      </p>

                      <p className="mt-1 text-sm text-text-muted">
                        Choose how many questions to create.
                      </p>
                    </div>

                    <div className="rounded-xl bg-accent-primary/10 px-4 py-2 text-lg font-bold text-accent-primary">
                      {numberOfQuestions}
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-2 rounded-xl bg-bg-background p-1.5">
                    {["5", "10", "15", "20"].map((value) => (
                      <button
                        key={value}
                        type="button"
                        className={`rounded-lg py-3 text-sm font-semibold transition md:text-base ${
                          value === numberOfQuestions
                            ? "bg-accent-primary text-white shadow-lg shadow-accent-primary/20"
                            : "text-text-muted hover:bg-bg-surface hover:text-text-primary"
                        }`}
                        onClick={() =>
                          setNumberOfQuestions(
                            value as "5" | "10" | "15" | "20",
                          )
                        }
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Other settings */}
                <div className="flex justify-center items-center gap-4">
                  <div className="w-full flex flex-col gap-4">
                    <div className="rounded-2xl border border-white/6 bg-bg-surface p-5">
                      <label htmlFor="difficulty">
                        <p className="text-base font-semibold text-text-primary md:text-lg">
                          Difficulty
                        </p>

                        <span className="mt-1 block text-sm text-text-muted">
                          How challenging should the questions be?
                        </span>
                      </label>

                      <select
                        id="difficulty"
                        className="mt-4 w-full rounded-xl border border-bg-surface-hover bg-bg-background px-4 py-3.5 text-base text-text-primary outline-none transition focus:border-accent-primary focus:ring-4 focus:ring-accent-primary/10"
                        value={difficulty}
                        onChange={(e) =>
                          setDifficulty(
                            e.target.value as
                              | "Easy"
                              | "Medium"
                              | "Hard"
                              | "Mixed",
                          )
                        }
                      >
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                        <option value="Mixed">Mixed</option>
                      </select>
                    </div>

                    <div className="rounded-2xl border border-white/6 bg-bg-surface p-5">
                      <label htmlFor="questionType">
                        <p className="text-base font-semibold text-text-primary md:text-lg">
                          Question type
                        </p>

                        <span className="mt-1 block text-sm text-text-muted">
                          Choose how users will answer.
                        </span>
                      </label>

                      <select
                        id="questionType"
                        defaultValue="mixed"
                        className="mt-4 w-full rounded-xl border border-bg-surface-hover bg-bg-background px-4 py-3.5 text-base text-text-primary outline-none transition focus:border-accent-primary focus:ring-4 focus:ring-accent-primary/10"
                        value={questionType}
                        onChange={(e) =>
                          setQuestionType(
                            e.target.value as
                              | "Mixed"
                              | "Multiple choice"
                              | "True / False",
                          )
                        }
                      >
                        <option value="Mixed">Mixed</option>
                        <option value="Multiple choice">Multiple choice</option>
                        <option value="True / False">True / False</option>
                      </select>
                    </div>
                  </div>

                  <div className="w-full rounded-2xl border border-white/6 bg-bg-surface p-5">
                    <p className="text-base font-semibold text-text-primary md:text-lg">
                      Extra options
                    </p>

                    <p className="mt-1 text-sm text-text-muted">
                      Fine-tune the generated questions.
                    </p>

                    <div className="mt-4 space-y-2">
                      {[
                        "Include explanations",
                        "Avoid duplicate questions",
                        "Focus on key concepts",
                      ].map((option) => (
                        <label
                          key={option}
                          className="flex cursor-pointer items-center justify-between rounded-xl px-3 py-3 transition hover:bg-bg-background"
                        >
                          <span className="text-sm text-text-primary">
                            {option}
                          </span>

                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={extraOptions.includes(option)}
                              onChange={(e) => {
                                setExtraOptions((prev) =>
                                  e.target.checked
                                    ? [...prev, option]
                                    : prev.filter((opt) => opt !== option),
                                );
                              }}
                              className="peer sr-only"
                            />

                            <div className="h-6 w-11 rounded-full bg-bg-surface-hover transition peer-checked:bg-accent-primary" />

                            <div className="absolute left-1 top-1 size-4 rounded-full bg-white shadow transition peer-checked:translate-x-5" />
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </details>
          </section>

          {/* Bottom CTA */}
          <div className="mt-9 rounded-3xl border border-accent-primary/15 bg-accent-primary/5 p-5 md:p-6">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-text-primary md:text-xl">
                  Everything looks good?
                </h3>

                <p className="mt-1.5 text-sm text-text-muted md:text-base">
                  Your quiz will be generated using the material you've added.
                </p>
              </div>

              <button
                type="button"
                disabled={isCreating}
                onClick={handleCreateDeck}
                className="group flex h-14 w-full shrink-0 items-center justify-center gap-3 rounded-2xl bg-accent-primary px-8 text-base font-semibold text-white shadow-xl shadow-accent-primary/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent-hover hover:shadow-2xl hover:shadow-accent-primary/30 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 md:w-auto md:text-lg"
              >
                {isCreating ? (
                  <>
                    <span className="size-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Creating quiz…
                  </>
                ) : (
                  <>
                    Generate quiz
                    <span className="text-xl transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>

          {errorMessage ? (
            <p className="mt-4 text-sm text-rose-400">{errorMessage}</p>
          ) : (
            <p className="mt-4 text-xs text-text-muted">
              Start with a PDF or add another source above. The other settings
              are optional.
            </p>
          )}
        </div>
      </div>

      <DecksSection />
    </div>
  );
};

export default MainPageComponent;

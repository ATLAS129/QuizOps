import { useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { FaFilePdf } from "react-icons/fa6";
import { useCreateDeck } from "../hooks/useDecks";
import LoadingSpinner from "./LoadingSpinner";

export interface deckInterface {
  id: string;
  title: string;
  isCompleted: boolean;
  _count: { cards: number };
}

const CreatePageComponent = () => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const dragCounterRef = useRef(0);
  const [url, setUrl] = useState("");
  const [prompt, setPrompt] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [selectedSource, setSelectedSource] = useState<"url" | "prompt" | null>(
    null,
  );
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
      },
      {
        onSuccess: () => {
          setUrl("");
          setPrompt("");
          setPdfFile(null);
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
        {/* Main card */}
        <div className="overflow-hidden rounded-4xl bg-bg-surface p-3">
          {/* STEP 1 */}
          <section className="flex flex-col items-center">
            {/* PDF upload */}
            <div
              className={`w-full group relative overflow-hidden rounded-3xl transition-all duration-300 ${
                isDragActive
                  ? "border-accent-primary bg-bg-surface-hover"
                  : pdfFile
                    ? "border-accent-primary/50 bg-accent-primary/20"
                    : "bg-bg-background hover:border-accent-primary hover:bg-bg-background"
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

              <div className="flex cursor-pointer flex-col items-center justify-center p-6 text-center">
                {pdfFile ? (
                  <>
                    <div className="mb-6 flex size-24 items-center justify-center rounded-2xl bg-accent-primary/10">
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
                      className="mt-6 rounded-xl border border-white/8 bg-accent-primary/10 px-5 py-3 text-sm font-medium text-text-muted transition hover:border-rose-400/30 hover:bg-rose-400/10 hover:text-rose-400"
                    >
                      Choose another file
                    </button>
                  </>
                ) : (
                  <>
                    <div
                      className={`mb-7 flex size-24 items-center justify-center rounded-2xl transition-all duration-300 ${
                        isDragActive
                          ? "bg-accent-primary/15 scale-105"
                          : "bg-bg-surface group-hover:bg-accent-primary/1"
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

            <section className="mt-4 w-full rounded-xl border border-bg-surface-hover bg-bg-background py-3 px-8">
              <div className="sm:flex sm:items-center sm:justify-between sm:gap-4">
                <div className="mb-3 sm:mb-0">
                  <h3 className="text-sm font-semibold text-text-primary">
                    Add another source
                  </h3>
                  <p className="mt-0.5 text-xs text-text-muted">
                    Webpage or note
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    aria-expanded={selectedSource === "url"}
                    onClick={() =>
                      setSelectedSource((current) =>
                        current === "url" ? null : "url",
                      )
                    }
                    className={`inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-lg border px-3 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary sm:flex-none ${
                      selectedSource === "url"
                        ? "border-accent-primary bg-accent-primary/10 text-accent-primary"
                        : "border-bg-surface-hover bg-bg-surface text-text-primary hover:border-accent-primary/50"
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className="text-base leading-none text-accent-primary"
                    >
                      {url ? "↗" : "+"}
                    </span>
                    {url ? "Edit webpage" : "Webpage"}
                    <span className="sr-only">
                      {selectedSource === "url"
                        ? "Close webpage editor"
                        : "Open webpage editor"}
                    </span>
                  </button>
                  <button
                    type="button"
                    aria-expanded={selectedSource === "prompt"}
                    onClick={() =>
                      setSelectedSource((current) =>
                        current === "prompt" ? null : "prompt",
                      )
                    }
                    className={`inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-lg border px-3 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary sm:flex-none ${
                      selectedSource === "prompt"
                        ? "border-accent-primary bg-accent-primary/10 text-accent-primary"
                        : "border-bg-surface-hover bg-bg-surface text-text-primary hover:border-accent-primary/50"
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className="text-base leading-none text-accent-primary"
                    >
                      {prompt ? "Aa" : "+"}
                    </span>
                    {prompt ? "Edit note" : "Note"}
                    <span className="sr-only">
                      {selectedSource === "prompt"
                        ? "Close note editor"
                        : "Open note editor"}
                    </span>
                  </button>
                </div>
              </div>

              {selectedSource === "url" && (
                <div className="mt-3">
                  <label
                    htmlFor="url"
                    className="mb-2 block text-sm font-medium text-text-primary"
                  >
                    Webpage link
                  </label>
                  <input
                    type="url"
                    id="url"
                    value={url}
                    onChange={(event) => setUrl(event.target.value)}
                    placeholder="https://example.com/article"
                    className="w-full rounded-lg border border-bg-surface-hover bg-bg-background px-3 py-2.5 text-sm text-text-primary outline-none transition placeholder:text-text-muted/60 focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/20"
                  />
                  <div className="mt-2 flex gap-4">
                    {url && (
                      <button
                        type="button"
                        onClick={() => setUrl("")}
                        className="py-1 text-sm text-text-muted underline underline-offset-4 hover:text-text-primary"
                      >
                        Remove link
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setSelectedSource(null)}
                      className="py-1 text-sm font-medium text-text-primary underline underline-offset-4 hover:text-accent-primary"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}

              {selectedSource === "prompt" && (
                <div className="mt-3">
                  <label
                    htmlFor="prompt"
                    className="mb-2 block text-sm font-medium text-text-primary"
                  >
                    Note for the quiz
                  </label>
                  <textarea
                    ref={textareaRef}
                    id="prompt"
                    value={prompt}
                    onChange={(event) => setPrompt(event.target.value)}
                    onInput={handleInput}
                    placeholder="Anything specific to include or focus on?"
                    className="min-h-24 w-full resize-y rounded-lg border border-bg-surface-hover bg-bg-background px-3 py-2.5 text-sm leading-6 text-text-primary outline-none transition placeholder:text-text-muted/60 focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/20"
                  />
                  <div className="mt-2 flex gap-4">
                    {prompt && (
                      <button
                        type="button"
                        onClick={() => setPrompt("")}
                        className="py-1 text-sm text-text-muted underline underline-offset-4 hover:text-text-primary"
                      >
                        Remove note
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setSelectedSource(null)}
                      className="py-1 text-sm font-medium text-text-primary underline underline-offset-4 hover:text-accent-primary"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </section>

            {(pdfFile || url || prompt) && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {pdfFile && (
                  <span
                    title={pdfFile.name}
                    className="max-w-full truncate rounded-md bg-bg-background px-2 py-1 text-xs text-text-muted"
                  >
                    PDF · {pdfFile.name}
                  </span>
                )}
                {url && (
                  <span
                    title={url}
                    className="max-w-full truncate rounded-md bg-bg-background px-2 py-1 text-xs text-text-muted"
                  >
                    Webpage · {url}
                  </span>
                )}
                {prompt && (
                  <span
                    title={prompt}
                    className="max-w-full truncate rounded-md bg-bg-background px-2 py-1 text-xs text-text-muted"
                  >
                    Note · {prompt}
                  </span>
                )}
              </div>
            )}
          </section>

          <section className="mt-5 rounded-2xl border border-white/[0.07] bg-bg-background p-5 md:p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-text-primary">
                Generation preferences
              </h2>
              <p className="mt-1 text-sm text-text-muted">
                Choose how long and what kind of quiz you’d like.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <label className="flex flex-col">
                <span className="text-sm font-semibold text-text-primary">
                  Questions
                </span>
                <span className="mt-1 min-h-8 text-xs leading-4 text-text-muted">
                  How many questions?
                </span>
                <select
                  id="numberOfQuestions"
                  className="mt-2 h-11 w-full rounded-xl border border-bg-surface-hover bg-bg-surface px-3 text-sm text-text-primary outline-none transition focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/20"
                  value={numberOfQuestions}
                  onChange={(event) =>
                    setNumberOfQuestions(
                      event.target.value as "5" | "10" | "15" | "20",
                    )
                  }
                >
                  <option value="5">5 questions</option>
                  <option value="10">10 questions</option>
                  <option value="15">15 questions</option>
                  <option value="20">20 questions</option>
                </select>
              </label>

              <label className="flex flex-col">
                <span className="text-sm font-semibold text-text-primary">
                  Difficulty
                </span>
                <span className="mt-1 min-h-8 text-xs leading-4 text-text-muted">
                  How challenging should it be?
                </span>
                <select
                  id="difficulty"
                  className="mt-2 h-11 w-full rounded-xl border border-bg-surface-hover bg-bg-surface px-3 text-sm text-text-primary outline-none transition focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/20"
                  value={difficulty}
                  onChange={(event) =>
                    setDifficulty(
                      event.target.value as
                        | "Easy"
                        | "Medium"
                        | "Hard"
                        | "Mixed",
                    )
                  }
                >
                  <option value="Mixed">Mixed</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </label>

              <label className="flex flex-col">
                <span className="text-sm font-semibold text-text-primary">
                  Answer format
                </span>
                <span className="mt-1 min-h-8 text-xs leading-4 text-text-muted">
                  How should answers work?
                </span>
                <select
                  id="questionType"
                  className="mt-2 h-11 w-full rounded-xl border border-bg-surface-hover bg-bg-surface px-3 text-sm text-text-primary outline-none transition focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/20"
                  value={questionType}
                  onChange={(event) =>
                    setQuestionType(
                      event.target.value as
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
              </label>
            </div>
          </section>

          <section className="flex justify-end border-t border-bg-surface-hover pt-5">
            <button
              type="button"
              disabled={isCreating}
              onClick={handleCreateDeck}
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-accent-primary px-10 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {isCreating ? (
                <>
                  <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Creating…
                </>
              ) : (
                "Generate quiz"
              )}
            </button>
            {errorMessage && (
              <p role="alert" className="mt-3 text-sm text-rose-400">
                {errorMessage}
              </p>
            )}
          </section>
        </div>
      </div>

      {/* <DecksSection /> */}
    </div>
  );
};

export default CreatePageComponent;
